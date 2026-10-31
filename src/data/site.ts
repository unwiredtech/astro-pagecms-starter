// Validates src/data/site.json (edited in PageCMS) at build time. Mirrors "site" in .pages.yml.
import { z } from 'astro/zod';
import rawSite from './site.json';

// Only site-relative paths, anchors, https and mailto links. Blocks javascript: and data: URLs.
const SAFE_HREF = /^(\/(?![/\\])|#|https:\/\/|mailto:)/;
// Browsers ignore tabs/newlines and treat "\" as "/", so "/\evil.com" would leave the site.
const HAS_SPACE_OR_BACKSLASH = /[\s\\]/;

const siteSchema = z.object({
  name: z.string(),
  // PageCMS deletes a list key when the editor empties it, so a missing nav means "no links".
  nav: z
    .array(
      z.object({
        label: z.string(),
        href: z
          .string()
          .regex(SAFE_HREF, 'Link must start with /, #, https:// or mailto:')
          .refine(
            (href) => !HAS_SPACE_OR_BACKSLASH.test(href),
            'Link must not contain spaces or \\',
          ),
      }),
    )
    .default([]),
});

const result = siteSchema.safeParse(rawSite);
if (!result.success) {
  throw new Error(`src/data/site.json is invalid:\n${z.prettifyError(result.error)}`);
}

export const site = result.data;
