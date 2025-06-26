import { z } from "zod";

export const contentSchema = z.object({
  collectionId: z.string(),
  name: z.string().min(1, "Name is required"),
  contentType: z.string().min(1, "Content type is required"),
  contentSourceData: z.array(
    z.object({
      language: z.string().min(1, "Language is required"),
      audioUrl: z.string().optional(),
      text: z.string().min(1, "Text is required"),
    })
  ),
  publisher: z.string().min(1, "publisher is required"),
  language: z.string().min(1, "Language is required"),
  tags: z
    .array(z.object({ value: z.string().min(1, "Tag cannot be empty") }))
    .optional(),
});

export type ContentFormType = z.infer<typeof contentSchema>;
