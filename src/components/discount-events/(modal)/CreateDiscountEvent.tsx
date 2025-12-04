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
  type DiscountEventFormData,
} from "@/validations/discounts/discountEventSchema";

export interface CreateDiscountEventProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  event?: DiscountEvent | null;
  eventStatus?: string;
  onCreate?: (
    data: Omit<DiscountEvent, "EventID" | "CreatedAt" | "UpdatedAt">
  ) => void | Promise<void>;
  onUpdate?: (
    id: number,
    data: Omit<DiscountEvent, "EventID" | "CreatedAt" | "UpdatedAt">
  ) => void | Promise<void>;
}

const toDatetimeLocalFormat = (isoString: string): string => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d}T${h}:${mm}`;
  } catch {
    return "";
  }
};

const toISOString = (d: string): string => {
  if (!d) return "";
  try {
    return new Date(d).toISOString();
  } catch {
    return "";
  }
};

const getCurrentDatetimeLocal = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${mm}`;
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
  const isActiveEvent = mode === "edit" && eventStatus === "Active";

  const validationSchema = isActiveEvent
    ? discountEventEditActiveSchema
    : discountEventSchema;

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

  const timeStart = watch("TimeStart");

  const minDateTime = useMemo(() => {
    return mode === "edit" ? "" : getCurrentDatetimeLocal();
  }, [mode]);

  const minEndDateTime = useMemo(() => {
    if (isActiveEvent) return getCurrentDatetimeLocal();
    return timeStart || minDateTime;
  }, [isActiveEvent, timeStart, minDateTime]);

  useEffect(() => {
    if (mode === "edit" && event) {
      setValue("EventName", event.EventName);
      setValue("Description", event.Description || "");
      setValue("DiscountValue", event.DiscountValue ?? 0);
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
      const formatted = {
        EventName: data.EventName,
        Description: data.Description || "",
        DiscountValue: data.DiscountValue,
        TimeStart: toISOString(data.TimeStart),
        TimeEnd: toISOString(data.TimeEnd),
      };

      if (mode === "create" && onCreate) {
        await onCreate(formatted);
      } else if (mode === "edit" && event && onUpdate) {
        await onUpdate(event.EventID, formatted);
      }

      reset();
      onOpenChange(false);
    } catch (e) {
      console.error("Submit error:", e);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  const baseInputStyle =
    "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 " +
    "dark:bg-neutral-900 dark:border-neutral-700 dark:text-white " +
    "focus:ring-2 focus:ring-[#ad8d5e] rounded-md";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-[600px] max-h-[90vh] overflow-y-auto
          bg-white border-gray-200
          dark:bg-neutral-900 dark:border-neutral-700
        "
      >
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            {mode === "create"
              ? "Create New Discount Event"
              : "Edit Discount Event"}

            {isActiveEvent && (
              <span className="text-sm font-normal text-orange-500 ml-2">
                (Active Event)
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            {mode === "create"
              ? "Fill in the details to create a new discount event."
              : isActiveEvent
                ? "For active events, you can only modify the end date."
                : "Update the details of the discount event."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Event Name */}
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">
                Event Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("EventName")}
                placeholder="e.g., Black Friday Wine Sale"
                disabled={isActiveEvent}
                className={`${baseInputStyle} ${
                  isActiveEvent ? "opacity-60 cursor-not-allowed" : ""
                } ${errors.EventName ? "border-red-500" : ""}`}
              />
              {errors.EventName && (
                <p className="text-sm text-red-500">
                  {errors.EventName.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">
                Description
              </Label>
              <Textarea
                {...register("Description")}
                placeholder="Describe the discount event..."
                rows={4}
                disabled={isActiveEvent}
                className={`${baseInputStyle} resize-none ${
                  isActiveEvent ? "opacity-60 cursor-not-allowed" : ""
                } ${errors.Description ? "border-red-500" : ""}`}
              />
            </div>

            {/* Discount Value */}
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">
                Discount Value (%) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min={1}
                max={100}
                step={1}
                {...register("DiscountValue", { valueAsNumber: true })}
                disabled={isActiveEvent}
                className={`${baseInputStyle} ${
                  isActiveEvent ? "opacity-60 cursor-not-allowed" : ""
                } ${errors.DiscountValue ? "border-red-500" : ""}`}
              />
            </div>

            {/* Time Start */}
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">
                Start Date & Time <span className="text-red-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                min={minDateTime}
                {...register("TimeStart")}
                disabled={isActiveEvent}
                className={`${baseInputStyle} ${
                  isActiveEvent ? "opacity-60 cursor-not-allowed" : ""
                } ${errors.TimeStart ? "border-red-500" : ""}`}
              />
            </div>

            {/* Time End */}
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">
                End Date & Time <span className="text-red-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                min={minEndDateTime}
                {...register("TimeEnd")}
                className={`${baseInputStyle} ${
                  errors.TimeEnd ? "border-red-500" : ""
                }`}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="
                bg-white border-gray-300 text-gray-700 hover:bg-gray-100
                dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-200 dark:hover:bg-neutral-700
                disabled:opacity-50
              "
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="
                bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white
                dark:bg-[#c7a979] dark:hover:bg-[#b1905a]
                disabled:opacity-50 disabled:cursor-not-allowed
              "
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
