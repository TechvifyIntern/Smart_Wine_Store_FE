import z from "zod";

export const ShippingSchema = z.object({
  userName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(3, "Please enter a shipping address"),
  city: z
    .string()
    .min(3, "Format: Ward, District, Province")
    .refine((v) => v.includes(","), {
      message: "Please use format: Ward, District, Province",
    }),
  phone: z
    .string()
    .min(7, "Phone is too short")
    .regex(/^\+?\d[\d\s\-()]{5,}$/, "Invalid phone number"),
});

export type ShippingFormValues = z.infer<typeof ShippingSchema>;
