import { z } from "zod";
export const userSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must not exceed 50 characters.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.enum(["Admin", "Author", "Reviewer"], {
    message: "Please select a valid role.",
  }),
  password: z
    .string()
    .min(6, { message: "Password should contain at least 6 characters" }),
});
