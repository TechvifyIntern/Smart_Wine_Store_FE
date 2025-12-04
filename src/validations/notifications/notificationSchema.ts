import { z } from "zod";

export const createNotificationSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be less than 200 characters"),
    content: z
      .string()
      .min(1, "Content is required")
      .max(1000, "Content must be less than 1000 characters"),
    linkURL: z.string().url("Invalid URL format").optional().or(z.literal("")),
    notificationType: z.string().min(1, "Notification type is required"),
    targetType: z.enum(["ALL", "USER"], {
      required_error: "Target type is required",
    }),
    sendOption: z.enum(["IMMEDIATE", "SCHEDULED"], {
      required_error: "Send option is required",
    }),
    targetUserIds: z.array(z.number()).optional(),
    scheduledAt: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.targetType === "USER") {
        return data.targetUserIds && data.targetUserIds.length > 0;
      }
      return true;
    },
    {
      message:
        "At least one user must be selected when targeting specific users",
      path: ["targetUserIds"],
    }
  )
  .refine(
    (data) => {
      if (data.sendOption === "SCHEDULED") {
        return data.scheduledAt && data.scheduledAt.trim().length > 0;
      }
      return true;
    },
    {
      message: "Scheduled time is required when send option is scheduled",
      path: ["scheduledAt"],
    }
  );

export type CreateNotificationFormData = z.infer<
  typeof createNotificationSchema
>;
