import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Mirrors the "pages" collection in .pages.yml. Change both together.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    sections: z
      .array(
        z
          .object({
            heading: z.string().optional(),
            text: z.string().optional(),
            // PageCMS uploads to /media; anything else is an outside URL or a typo.
            image: z
              .string()
              .regex(/^\/media\//, 'Image must be uploaded to /media')
              .optional(),
            imageAlt: z.string().optional(),
          })
          .refine((section) => !section.image || section.imageAlt?.trim(), {
            message: 'Add alt text for the image (describe it, or write "decorative")',
            path: ['imageAlt'],
          }),
      )
      .default([]),
  }),
});

export const collections = { pages };
