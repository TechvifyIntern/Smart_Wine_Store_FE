"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DiscountEvent } from "@/data/discount_event";
import {
    discountEventSchema,
    discountEventEditActiveSchema,
    type DiscountEventFormData
} from "@/validations/discounts/discountEventSchema";

export interface CreateDiscountEventProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "edit";
    event?: DiscountEvent | null;
    eventStatus?: string; // Add status to determine if event is Active
    onCreate?: (data: Omit<DiscountEvent, "DiscountEventID" | "CreatedAt" | "UpdatedAt">) => void | Promise<void>;
    onUpdate?: (id: number, data: Omit<DiscountEvent, "DiscountEventID" | "CreatedAt" | "UpdatedAt">) => void | Promise<void>;
}

// Helper function to convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
const toDatetimeLocalFormat = (isoString: string): string => {
    if (!isoString) return "";
    try {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
        return "";
    }
};

// Helper function to convert datetime-local format to ISO string
const toISOString = (datetimeLocal: string): string => {
    if (!datetimeLocal) return "";
    try {
        return new Date(datetimeLocal).toISOString();
    } catch (error) {
        return "";
    }
};

// Get current datetime in datetime-local format for min attribute
const getCurrentDatetimeLocal = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function CreateDiscountEvent({
    open,
    onOpenChange,
    mode,
    event,
    eventStatus,
    onCreate,
    onUpdate,
}: CreateDiscountEventProps) {
    // Determine if event is Active
    const isActiveEvent = mode === "edit" && eventStatus === "Active";

    // Use different schema based on event status
    const validationSchema = isActiveEvent ? discountEventEditActiveSchema : discountEventSchema;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm<DiscountEventFormData>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            EventName: "",
            Description: "",
            DiscountValue: 10,
            TimeStart: "",
            TimeEnd: "",
        },
    });

    // Watch TimeStart to set min for TimeEnd
    const timeStart = watch("TimeStart");

    // Get minimum datetime (current time for create, or allow past for edit)
    const minDateTime = useMemo(() => {
        if (mode === "edit") {
            return "";
        }
        return getCurrentDatetimeLocal();
    }, [mode]);

    // Get minimum datetime for TimeEnd when event is Active
    const minEndDateTime = useMemo(() => {
        if (isActiveEvent) {
            return getCurrentDatetimeLocal(); // Must be in future
        }
        return timeStart || minDateTime;
    }, [isActiveEvent, timeStart, minDateTime]);

    // Pre-fill form when in edit mode
    useEffect(() => {
        if (mode === "edit" && event) {
            setValue("EventName", event.EventName);
            setValue("Description", event.Description || "");
            setValue("DiscountValue", event.DiscountValue);
            setValue("TimeStart", toDatetimeLocalFormat(event.TimeStart));
            setValue("TimeEnd", toDatetimeLocalFormat(event.TimeEnd));
        } else if (mode === "create") {
            reset({
                EventName: "",
                Description: "",
                DiscountValue: 10,
                TimeStart: "",
                TimeEnd: "",
            });
        }
    }, [mode, event, setValue, reset]);

    const onSubmit = async (data: DiscountEventFormData) => {
        try {
            const formattedData = {
                EventName: data.EventName,
                Description: data.Description || "",
                DiscountValue: data.DiscountValue,
                TimeStart: toISOString(data.TimeStart),
                TimeEnd: toISOString(data.TimeEnd),
            };

            if (mode === "create" && onCreate) {
                await onCreate(formattedData);
            } else if (mode === "edit" && onUpdate && event) {
                await onUpdate(event.DiscountEventID, formattedData);
            }

            // Close modal and reset form on success
            onOpenChange(false);
            reset();
        } catch (error) {
            console.error("Error submitting form:", error);
            // Handle error (you can add toast notification here)
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white! border-gray-200!">
                <DialogHeader>
                    <DialogTitle className="text-gray-900!">
                        {mode === "create" ? "Create New Discount Event" : "Edit Discount Event"}
                        {isActiveEvent && <span className="text-sm font-normal text-orange-500 ml-2">(Active Event)</span>}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600!">
                        {mode === "create"
                            ? "Fill in the details to create a new discount event."
                            : isActiveEvent
                                ? "For active events, you can only modify the end date to extend the event."
                                : "Update the details of the discount event."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {/* Event Name */}
                        <div className="space-y-2">
                            <Label htmlFor="EventName" className="text-sm font-medium text-gray-900!">
                                Event Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="EventName"
                                placeholder="e.g., Black Friday Wine Sale"
                                {...register("EventName")}
                                disabled={isActiveEvent}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#eb883b]! ${isActiveEvent ? "opacity-60 cursor-not-allowed" : ""} ${errors.EventName ? "border-red-500!" : ""}`}
                            />
                            {errors.EventName && (
                                <p className="text-sm text-red-500">{errors.EventName.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="Description" className="text-sm font-medium text-gray-900!">
                                Description
                            </Label>
                            <Textarea
                                id="Description"
                                placeholder="Describe the discount event..."
                                rows={4}
                                {...register("Description")}
                                disabled={isActiveEvent}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#eb883b]! resize-none ${isActiveEvent ? "opacity-60 cursor-not-allowed" : ""} ${errors.Description ? "border-red-500!" : ""}`}
                            />
                            {errors.Description && (
                                <p className="text-sm text-red-500">{errors.Description.message}</p>
                            )}
                        </div>

                        {/* Discount Value */}
                        <div className="space-y-2">
                            <Label htmlFor="DiscountValue" className="text-sm font-medium text-gray-900!">
                                Discount Value (%) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="DiscountValue"
                                type="number"
                                min="1"
                                max="100"
                                step="1"
                                placeholder="e.g., 25"
                                {...register("DiscountValue", { valueAsNumber: true })}
                                disabled={isActiveEvent}
                                className={`bg-white! border-gray-300! text-gray-900! placeholder:text-gray-400! focus:ring-2 focus:ring-[#eb883b]! ${isActiveEvent ? "opacity-60 cursor-not-allowed" : ""} ${errors.DiscountValue ? "border-red-500!" : ""}`}
                            />
                            {errors.DiscountValue && (
                                <p className="text-sm text-red-500">{errors.DiscountValue.message}</p>
                            )}
                        </div>

                        {/* Time Start */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="TimeStart" className="text-sm font-medium text-gray-900!">
                                    Start Date & Time <span className="text-red-500">*</span>
                                </Label>
                                {errors.TimeStart && (
                                    <p className="text-xs text-red-500 font-medium">{errors.TimeStart.message}</p>
                                )}
                            </div>
                            <Input
                                id="TimeStart"
                                type="datetime-local"
                                min={minDateTime}
                                {...register("TimeStart")}
                                disabled={isActiveEvent}
                                className={`bg-white! border-gray-300! text-gray-900! focus:ring-2 focus:ring-[#eb883b]! ${isActiveEvent ? "opacity-60 cursor-not-allowed" : ""} ${errors.TimeStart ? "border-red-500!" : ""}`}
                            />
                        </div>

                        {/* Time End */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="TimeEnd" className="text-sm font-medium text-gray-900!">
                                    End Date & Time <span className="text-red-500">*</span>
                                </Label>
                                {errors.TimeEnd && (
                                    <p className="text-xs text-red-500 font-medium">{errors.TimeEnd.message}</p>
                                )}
                            </div>
                            <Input
                                id="TimeEnd"
                                type="datetime-local"
                                min={minEndDateTime}
                                {...register("TimeEnd")}
                                className={`bg-white! border-gray-300! text-gray-900! focus:ring-2 focus:ring-[#eb883b]! ${isActiveEvent ? "border-orange-300! focus:ring-orange-500!" : ""} ${errors.TimeEnd ? "border-red-500!" : ""}`}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="bg-white! border-gray-300! text-gray-700! hover:bg-gray-100! disabled:opacity-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#eb883b] hover:bg-[#d97730] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? mode === "create"
                                    ? "Creating..."
                                    : "Updating..."
                                : mode === "create"
                                    ? "Create Event"
                                    : "Update Event"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
