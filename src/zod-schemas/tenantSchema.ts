import { z } from "zod";
export const tenantSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must not exceed 50 characters.",
    }),
  description: z
    .string()
    .min(2, {
      message: "Description is required.",
    })
    .max(50, {
      message: "Name must not exceed 50 characters.",
    }),
});
