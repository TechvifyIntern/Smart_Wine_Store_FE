"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Percent, Edit2, Save, Trash2 } from "lucide-react";
import { DiscountEvent } from "@/data/discount_event";
import discountEventsRepository from "@/api/discountEventsRepository";
import PageHeader from "@/components/discount-events/PageHeader";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  discountEventEditActiveSchema,
  type DiscountEventFormData,
} from "@/validations/discounts/discountEventSchema";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = parseInt(params.id as string);

  // State management
  const [event, setEvent] = useState<DiscountEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch event data from API
  useEffect(() => {
    const loadEvent = async () => {
      try {
        setIsLoading(true);
        const response = await discountEventsRepository.getDiscountEvents();
        if (response.success && response.data) {
          const foundEvent = (response.data as any[]).find(
            (e: any) => e.DiscountEventID === eventId
          );
          setEvent(foundEvent || null);
        }
      } catch (error) {
        console.error("Error loading event:", error);
        toast.error("Failed to load event data");
      } finally {
        setIsLoading(false);
      }
    };
    loadEvent();
  }, [eventId]);

  // Form management
  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    getValues,
  } = useForm<DiscountEventFormData>({
    resolver: zodResolver(discountEventEditActiveSchema),
  });

  // Initialize form when event changes or edit mode toggles
  useEffect(() => {
    if (event && isEditing) {
      setValue("EventName", event.EventName);
      setValue("Description", event.Description || "");
      setValue("DiscountValue", event.DiscountValue ?? 0);
      setValue("TimeStart", event.TimeStart);
      setValue("TimeEnd", event.TimeEnd);
    }
  }, [event, isEditing, setValue]);

  // Check event status and determine button visibility
  const currentDate = new Date();
  const isExpired = event ? new Date(event.TimeEnd) < currentDate : false;
  const isActive =
    event && !isExpired && currentDate >= new Date(event.TimeStart);
  const canEdit = event && !isExpired;
  const canDelete = event && !isExpired && !isActive; // Only show delete for scheduled events

  // Event handlers
  const handleEditToggle = () => {
    if (isEditing) {
      // Switching to save mode
      setShowSaveDialog(true);
    } else {
      // Switching to edit mode
      setIsEditing(true);
    }
  };

  const handleSaveConfirm = async () => {
    if (!event) return;

    try {
      const formData = getValues();

      const response = await discountEventsRepository.updateDiscountEvent(
        event.DiscountEventID,
        {
          EventName: formData.EventName,
          DiscountPercentage: formData.DiscountValue,
          StartDate: formData.TimeStart,
          EndDate: formData.TimeEnd,
          Description: formData.Description,
          isActive: true,
        }
      );

      if (response.success) {
        // Update local state with the response data
        if (response.data) {
          setEvent(response.data as any);
        }

        setIsEditing(false);
        setShowSaveDialog(false);
        reset();

        toast.success(
          `Event "${formData.EventName}" has been updated successfully.`
        );
      } else {
        toast.error(response.message || "Failed to update event");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to update event. Please try again.");
    }
  };

  const handleSaveCancel = () => {
    setShowSaveDialog(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (!event || !canDelete) return;

    // TODO: Implement DELETE API call
    // await discountEventsRepository.deleteDiscountEvent(event.DiscountEventID);

    setShowDeleteDialog(false);

    toast.success(`Event "${event.EventName}" has been deleted successfully.`);

    // Navigate back to events page
    router.push("/admin/discounts/events");
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Event Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The requested discount event could not be found.
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (isExpiredValue: boolean) => {
    return isExpiredValue
      ? "text-red-600 bg-red-50 border-red-200"
      : "text-green-600 bg-green-50 border-green-200";
  };

  return (
    <div>
      <PageHeader title="Event Detail" icon={Percent} iconColor="text-black" />

      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-[#ad8d5e] to-[#8b735e] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Percent className="w-8 h-8 text-[#ad8d5e]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Event Details</h1>
                <p className="text-white/90">
                  Detailed information for{" "}
                  <span className="font-medium">{event.EventName}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canEdit && (
                <Button
                  onClick={handleEditToggle}
                  disabled={isSubmitting}
                  className="bg-white text-[#ad8d5e] hover:bg-gray-50 border border-white/20"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              )}
              {isEditing && (
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  disabled={isSubmitting}
                  className="bg-transparent text-white border-white/20 hover:bg-white/10"
                >
                  Cancel
                </Button>
              )}
              {canDelete && (
                <Button
                  onClick={handleDeleteClick}
                  disabled={isSubmitting || isEditing}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-8">
            {/* Event Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-blue-100 dark:border-slate-600">
              <div className="flex items-center gap-2 mb-6">
                <Percent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Event Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      #
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                      Event ID
                    </p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      #{event.DiscountEventID}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                    <Percent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                      Event Name
                    </p>
                    {isEditing ? (
                      <div>
                        <Input
                          {...register("EventName")}
                          className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.EventName ? "border-red-500" : ""}`}
                        />
                        {errors.EventName && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.EventName.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900 dark:text-slate-100">
                        {event.EventName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600 md:col-span-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                    <Percent className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                      Description
                    </p>
                    {isEditing ? (
                      <div>
                        <Textarea
                          {...register("Description")}
                          rows={3}
                          className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.Description ? "border-red-500" : ""}`}
                        />
                        {errors.Description && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.Description.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900 dark:text-slate-100">
                        {event.Description || "No description provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Discount & Timing Card */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-green-100 dark:border-slate-600">
              <div className="flex items-center gap-2 mb-6">
                <Percent className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Discount & Timing
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
                    <Percent className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                      Discount Value
                    </p>
                    {isEditing ? (
                      <div>
                        <Input
                          {...register("DiscountValue", {
                            valueAsNumber: true,
                          })}
                          type="number"
                          min="1"
                          max="100"
                          className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.DiscountValue ? "border-red-500" : ""}`}
                        />
                        {errors.DiscountValue && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.DiscountValue.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="font-bold text-orange-600 dark:text-orange-400 text-lg">
                        {event.DiscountValue}%
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                    <Percent className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                      Start Time
                    </p>
                    {isEditing ? (
                      <div>
                        <Input
                          {...register("TimeStart")}
                          type="datetime-local"
                          className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.TimeStart ? "border-red-500" : ""}`}
                        />
                        {errors.TimeStart && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.TimeStart.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900 dark:text-slate-100">
                        {formatDateTime(event.TimeStart)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
                    <Percent className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                      End Time
                    </p>
                    {isEditing ? (
                      <div>
                        <Input
                          {...register("TimeEnd")}
                          type="datetime-local"
                          className={`bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 border-gray-300 dark:border-slate-500 ${errors.TimeEnd ? "border-red-500" : ""}`}
                        />
                        {errors.TimeEnd && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.TimeEnd.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="font-medium text-gray-900 dark:text-slate-100">
                        {formatDateTime(event.TimeEnd)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Percent className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                      Status
                    </p>
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(isExpired)}`}
                    >
                      {isExpired ? "Expired" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-slate-100 dark:border-slate-600">
              <div className="flex items-center gap-2 mb-6">
                <Percent className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Metadata
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                    <Percent className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                      Created At
                    </p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {formatDateTime(event.CreatedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-700/60 rounded-lg border border-white/80 dark:border-slate-600">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                    <Percent className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                      Updated At
                    </p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {event.UpdatedAt
                        ? formatDateTime(event.UpdatedAt)
                        : formatDateTime(event.CreatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-slate-100">
              Confirm Save Changes
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-slate-400">
              Are you sure you want to save the changes to this discount event?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleSaveCancel}
              className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSaveConfirm}
              disabled={isSubmitting}
              className="bg-[#ad8d5e] hover:bg-[#8c6b3e] text-white"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-slate-100">
              Confirm Delete Event
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-slate-400">
              Are you sure you want to delete the discount event{" "}
              <strong className="text-gray-900 dark:text-slate-100">
                &quot;{event.EventName}&quot;
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleDeleteCancel}
              className="bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
