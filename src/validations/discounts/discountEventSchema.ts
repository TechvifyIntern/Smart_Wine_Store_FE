import * as z from "zod";

/**
 * Discount Event Form Validation Schema
 * 
 * Validates discount event form data including:
 * - Event name (required, 2-100 chars)
 * - Description (optional, max 500 chars)
 * - Discount value (1-100%)
 * - Start/End times (required, must be in future, end must be after start)
 */

// Helper function to check if a date is in the past
const isPastDate = (dateString: string): boolean => {
    const selectedDate = new Date(dateString);
    const now = new Date();
    return selectedDate < now;
};

// Base schema for create mode
export const discountEventSchema = z.object({
    EventName: z
        .string()
        .min(2, "Event name must be at least 2 characters")
        .max(100, "Event name must be at most 100 characters"),
    Description: z
        .string()
        .max(500, "Description must be at most 500 characters")
        .optional()
        .or(z.literal("")),
    DiscountValue: z
        .number({
            required_error: "Discount value is required",
            invalid_type_error: "Discount value must be a number",
        })
        .min(1, "Discount value must be at least 1%")
        .max(100, "Discount value must be at most 100%"),
    TimeStart: z
        .string()
        .min(1, "Start time is required")
        .refine(
            (dateString) => !isPastDate(dateString),
            {
                message: "Start time cannot be in the past",
            }
        ),
    TimeEnd: z
        .string()
        .min(1, "End time is required")
        .refine(
            (dateString) => !isPastDate(dateString),
            {
                message: "End time cannot be in the past",
            }
        ),
}).refine(
    (data) => {
        // Ensure TimeEnd is after TimeStart
        const start = new Date(data.TimeStart);
        const end = new Date(data.TimeEnd);
        return end > start;
    },
    {
        message: "End time must be after start time",
        path: ["TimeEnd"],
    }
);

// Schema for editing Active events (only end date validation)
export const discountEventEditActiveSchema = z.object({
    EventName: z
        .string()
        .min(2, "Event name must be at least 2 characters")
        .max(100, "Event name must be at most 100 characters"),
    Description: z
        .string()
        .max(500, "Description must be at most 500 characters")
        .optional()
        .or(z.literal("")),
    DiscountValue: z
        .number({
            required_error: "Discount value is required",
            invalid_type_error: "Discount value must be a number",
        })
        .min(1, "Discount value must be at least 1%")
        .max(100, "Discount value must be at most 100%"),
    TimeStart: z.string().min(1, "Start time is required"),
    TimeEnd: z
        .string()
        .min(1, "End time is required")
        .refine(
            (dateString) => !isPastDate(dateString),
            {
                message: "End time must be in the future",
            }
        ),
}).refine(
    (data) => {
        // Ensure TimeEnd is after TimeStart
        const start = new Date(data.TimeStart);
        const end = new Date(data.TimeEnd);
        return end > start;
    },
    {
        message: "End time must be after start time",
        path: ["TimeEnd"],
    }
);

export type DiscountEventFormData = z.infer<typeof discountEventSchema>;
