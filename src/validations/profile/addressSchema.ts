import { z } from "zod";

export const addAddressSchema = z.object({
  StreetAddress: z
    .string()
    .min(1, "Street Address is required")
    .max(500, "Street Address must be less than 500 characters"),
  Ward: z
    .string()
    .min(1, "Ward is required")
    .max(100, "Ward must be less than 100 characters"),
  Province: z
    .string()
    .min(1, "Province is required")
    .max(100, "Province must be less than 100 characters"),
  IsDefault: z.boolean().optional().default(false),
});

export const editAddressSchema = z.object({
  StreetAddress: z
    .string()
    .min(1, "Street Address is required")
    .max(500, "Street Address must be less than 500 characters"),
  Ward: z
    .string()
    .min(1, "Ward is required")
    .max(100, "Ward must be less than 100 characters"),
  Province: z
    .string()
    .min(1, "Province is required")
    .max(100, "Province must be less than 100 characters"),
  IsDefault: z.boolean().optional().default(false),
});

export type AddAddressFormData = z.infer<typeof addAddressSchema>;
export type EditAddressFormData = z.infer<typeof editAddressSchema>;
