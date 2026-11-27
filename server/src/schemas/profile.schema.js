import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z
    .object({
      displayName: z
        .string()
        .trim()
        .min(1, "Display name cannot be empty")
        .max(50, "Display name cannot exceed 50 characters")
        .optional(),

      bio: z
        .string()
        .trim()
        .max(150, "Bio cannnot exceed 150 characters")
        .optional(),
    })
    .strict()
    .refine((data) => object.keys(data).length > 0, {
      message: "At least on field is required",
    }),
});
