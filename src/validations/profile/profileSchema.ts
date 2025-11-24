import { z } from "zod";

export const profileSchema = z.object({
  UserName: z.string().min(3, "Username must be at least 3 characters.").max(50, "Username must not exceed 50 characters.").optional(),
  Email: z.string().email("Invalid email address.").optional(),
  PhoneNumber: z.string().regex(/^\+?[0-9\s-]{7,15}$/, "Invalid phone number.").optional(),
  Birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid birthday format (YYYY-MM-DD).").optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
