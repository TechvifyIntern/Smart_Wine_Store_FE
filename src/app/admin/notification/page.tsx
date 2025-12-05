"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createNotificationSchema,
  type CreateNotificationFormData,
} from "@/validations/notifications/notificationSchema";
import { useToast } from "@/hooks/use-toast";
import { CreateNotificationResponse } from "@/api/notificationsRepository";
import notificationsRepository from "@/api/notificationsRepository";
import userManagementRepository from "@/api/userManagementRepository";
import PageHeader from "@/components/discount-events/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { Check, X, Users, Bell, Calendar, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const notificationTypes = [
  { value: "general", label: "General" },
  { value: "discount-event", label: "Discount Event" },
  { value: "promotion", label: "Promotion" },
  { value: "system", label: "System" },
  { value: "order-status-update", label: "Order Status Update" },
];

const sendOptions = [
  { value: "IMMEDIATE", label: "Send Immediately" },
  { value: "SCHEDULED", label: "Schedule for later" },
];

const targetTypes = [
  { value: "ALL", label: "All Users" },
  { value: "USER", label: "Specific Users" },
];

export default function NotificationPage() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    control,
  } = useForm<CreateNotificationFormData>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      title: "",
      content: "",
      linkURL: "",
      notificationType: "general",
      targetType: "ALL",
      sendOption: "IMMEDIATE",
      targetUserIds: [],
      scheduledAt: "",
    },
  });

  const targetType = watch("targetType");
  const sendOption = watch("sendOption");

  // Fetch users for selection when targetType = "USER"
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [hasFetchedUsers, setHasFetchedUsers] = useState(false);
  const [openUserPicker, setOpenUserPicker] = useState(false);

  useEffect(() => {
    if (targetType === "USER" && !hasFetchedUsers) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const response = await userManagementRepository.getUsers({
            page: 1,
            pageSize: 100,
            sortBy: "createdAt",
            sortOrder: "desc",
          });

          if (response.data) {
            setAvailableUsers(response.data);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoadingUsers(false);
          setHasFetchedUsers(true);
        }
      };

      fetchUsers();
    }
  }, [targetType, hasFetchedUsers]);

  const onSubmit = async (data: CreateNotificationFormData) => {
    try {
      const response: CreateNotificationResponse =
        await notificationsRepository.createNotification(data);

      if (response.success) {
        // Reset form immediately on success
        reset();

        // CASE 1: Scheduled for the future
        // We use the form data to check this, as the stats won't exist yet
        if (data.sendOption === "SCHEDULED") {
          toast({
            title: "📅 Notification Scheduled",
            description: (
              <div className="mt-2 space-y-1">
                <p>Your notification has been queued successfully.</p>
                <p className="text-muted-foreground text-xs">
                  Scheduled for: {new Date(data.scheduledAt!).toLocaleString()}
                </p>
              </div>
            ),
            variant: "default",
            duration: 5000,
          });
          return; // Exit early
        }

        // CASE 2: Sent Immediately (Job Processed)
        // We check if we actually have delivery stats
        if (response.deliveryStatus) {
          const { sent, pendingOffline, failed } = response.deliveryStatus;
          const total = sent + pendingOffline + failed;

          let title = "Notification Sent";
          let variant: "default" | "destructive" = "default";

          // Determine Title & Variant based on success rate
          if (failed > 0 && sent === 0) {
            title = "❌ Delivery Failed";
            variant = "destructive";
          } else if (failed > 0) {
            title = "⚠️ Completed with Errors";
            variant = "destructive"; // Warning state often uses destructive or a custom yellow
          } else {
            title = "✅ Delivered Successfully";
          }

          toast({
            title: title,
            // Use JSX for clean formatting
            description: (
              <div className="mt-2 flex flex-col gap-1 text-sm">
                <p className="font-semibold">Delivery Summary:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Total Targets: {total}</li>
                  <li className="text-green-600">Delivered: {sent}</li>
                  {pendingOffline > 0 && (
                    <li className="text-amber-600">
                      Pending (Offline): {pendingOffline}
                    </li>
                  )}
                  {failed > 0 && (
                    <li className="text-red-600">Failed: {failed}</li>
                  )}
                </ul>
              </div>
            ),
            variant: variant,
            duration: 7000,
          });
        } else {
          // CASE 3: Sent, but no detailed stats returned
          toast({
            title: "Notification Sent",
            description: "The notification request was accepted.",
            duration: 3000,
          });
        }
      } else {
        // Handle API returning success: false
        toast({
          title: "Creation Failed",
          description: "The server could not create the notification.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error creating notification:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to connect to the server.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader title="Create Notification" icon={Bell} />

      <div className="bg-card text-card-foreground border rounded-xl shadow-sm">
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* --- SECTION 1: BASIC INFO --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Ex: Super Sale 50% Off"
                  {...register("title")}
                  className={cn(
                    "h-10", // Match select height
                    errors.title && "border-red-500 focus-visible:ring-red-500",
                    "dark:border-white/20"
                  )}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Notification Type
                </Label>
                <Select
                  value={watch("notificationType")}
                  onValueChange={(value) =>
                    setValue("notificationType", value, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger
                    className={cn(
                      "h-10",
                      errors.notificationType && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                  <SelectContent>
                    {notificationTypes.map((typeOption) => (
                      <SelectItem
                        key={typeOption.value}
                        value={typeOption.value}
                      >
                        {typeOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.notificationType && (
                  <p className="text-sm text-red-500">
                    {errors.notificationType.message}
                  </p>
                )}
              </div>
            </div>

            {/* --- SECTION 2: CONTENT --- */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                Content <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Enter your message here..."
                {...register("content")}
                rows={5}
                className={cn(
                  "resize-none dark:border-white/20",
                  errors.content && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {errors.content && (
                <p className="text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>

            {/* --- SECTION 3: LINK & TARGET --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Link URL (Optional)
                </Label>
                <Input
                  placeholder="https://example.com/promotion"
                  {...register("linkURL")}
                  className={cn(
                    errors.linkURL && "border-red-500",
                    "dark:border-white/20"
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  User will be redirected here when tapping the notification.
                </p>
                {errors.linkURL && (
                  <p className="text-sm text-red-500">
                    {errors.linkURL.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Target Audience <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={targetType}
                  onValueChange={(value) =>
                    setValue("targetType", value as "ALL" | "USER")
                  }
                  className="flex gap-6 pt-2"
                >
                  {targetTypes.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="text-primary border-primary focus:ring-primary"
                      />
                      <Label
                        htmlFor={option.value}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.targetType && (
                  <p className="text-sm text-red-500">
                    {errors.targetType.message}
                  </p>
                )}
              </div>
            </div>

            {/* --- SECTION 4: USER SELECTION (Enhanced Command + Popover) --- */}
            {targetType === "USER" && (
              <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">
                    Select Users <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    {(watch("targetUserIds") || []).length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-primary">
                          Selected: {(watch("targetUserIds") || []).length}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setValue("targetUserIds", [])}
                          className="text-xs h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Clear All
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {loadingUsers ? (
                  <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">
                    Loading users list...
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Popover
                      open={openUserPicker}
                      onOpenChange={setOpenUserPicker}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openUserPicker}
                          className="w-full justify-between h-10 px-3"
                        >
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 opacity-50" />
                            {(watch("targetUserIds") || []).length > 0
                              ? `${(watch("targetUserIds") || []).length} users selected`
                              : "Click to select users..."}
                          </div>
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="max-w-[900px] p-0"
                        align="start"
                      >
                        <Command className="max-w-[900px]">
                          <CommandInput
                            placeholder="Search users by name or email..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No users found.</CommandEmpty>
                            {availableUsers.map((user) => {
                              const isSelected =
                                watch("targetUserIds")?.includes(user.UserID) ||
                                false;
                              return (
                                <CommandItem
                                  key={user.UserID}
                                  value={`${user.UserName} ${user.Email}`}
                                  onSelect={() => {
                                    const currentIds =
                                      watch("targetUserIds") || [];
                                    if (isSelected) {
                                      // Remove user
                                      setValue(
                                        "targetUserIds",
                                        currentIds.filter(
                                          (id) => id !== user.UserID
                                        )
                                      );
                                    } else {
                                      // Add user
                                      setValue("targetUserIds", [
                                        ...currentIds,
                                        user.UserID,
                                      ]);
                                    }
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      isSelected ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                      {user.UserName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {user.Email}
                                    </span>
                                  </div>
                                </CommandItem>
                              );
                            })}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Show selected users count and preview */}
                    {(watch("targetUserIds") || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50">
                        {availableUsers
                          .filter((user) =>
                            (watch("targetUserIds") || []).includes(user.UserID)
                          )
                          .slice(0, 5) // Show only first 5 selected users
                          .map((user) => (
                            <div
                              key={user.UserID}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {user.UserName}
                              <button
                                type="button"
                                onClick={() => {
                                  const currentIds =
                                    watch("targetUserIds") || [];
                                  setValue(
                                    "targetUserIds",
                                    currentIds.filter(
                                      (id) => id !== user.UserID
                                    )
                                  );
                                }}
                                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        {(watch("targetUserIds") || []).length > 5 && (
                          <span className="text-xs text-muted-foreground px-2 py-1">
                            +{(watch("targetUserIds") || []).length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {errors.targetUserIds && (
                  <p className="text-sm text-red-500">
                    {errors.targetUserIds.message}
                  </p>
                )}
              </div>
            )}

            {/* --- SECTION 5: SEND OPTIONS (Refactored Layout) --- */}
            <div className="p-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Cột Trái: Chọn Kiểu Gửi */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Send Option <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={sendOption}
                    onValueChange={(value) =>
                      setValue("sendOption", value as "IMMEDIATE" | "SCHEDULED")
                    }
                    className="space-y-3 pt-1"
                  >
                    {sendOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`send-${option.value}`}
                          className="text-primary border-primary focus:ring-primary"
                        />
                        <Label
                          htmlFor={`send-${option.value}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.sendOption && (
                    <p className="text-sm text-red-500">
                      {errors.sendOption.message}
                    </p>
                  )}
                </div>

                {/* Cột Phải: Chọn Ngày (Chỉ hiện khi chọn Schedule) */}
                {sendOption === "SCHEDULED" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Scheduled Date & Time{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="datetime-local"
                      {...register("scheduledAt")}
                      className={cn(
                        "bg-background",
                        errors.scheduledAt &&
                          "border-red-500 focus-visible:ring-red-500"
                      )}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    {errors.scheduledAt && (
                      <p className="text-sm text-red-500">
                        {errors.scheduledAt.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto min-w-[200px] bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? "Creating..." : "Create Notification"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
