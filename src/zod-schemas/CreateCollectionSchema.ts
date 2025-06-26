import { z } from "zod";

export const createCollectionSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  category: z.string().min(1, { message: "Category is required" }),
  author: z.string().min(1, { message: "Auhtor is required" }),
  difficulty: z.enum(["Easy", "Medium", "Hard"], {
    message: "Invalid difficulty Easy | Medium | Hard",
  }),
  language: z.string(),
  status: z.string(),
  tags: z
    .array(z.object({ value: z.string().min(1, "Tag cannot be empty") }))
    .optional(),
});

// Infer the TypeScript type from the Zod schema
export type CreateCollectionSchmea = z.infer<typeof createCollectionSchema>;
