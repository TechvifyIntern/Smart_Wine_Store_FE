import { z } from "zod";

export const profileSchema = z.object({
  UserName: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(50, "Username must not exceed 50 characters.")
    .optional(),
  Email: z.string().email("Invalid email address.").optional(),
  PhoneNumber: z
    .string()
    .regex(/^\+?[0-9\s-]{7,15}$/, "Invalid phone number.")
    .optional(),
  Birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid birthday format (YYYY-MM-DD).")
    .refine((dateStr) => {
      const birthday = new Date(dateStr);
      const today = new Date();
      const age = today.getFullYear() - birthday.getFullYear();
      const hasHadBirthdayThisYear =
        today.getMonth() > birthday.getMonth() ||
        (today.getMonth() === birthday.getMonth() &&
          today.getDate() >= birthday.getDate());
      return hasHadBirthdayThisYear ? age >= 18 : age - 1 >= 18;
    }, "You must be at least 18 years old.")
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
