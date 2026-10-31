// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrefixHashLinks from './src/lib/rehype-prefix-hash-links.mjs';

// Static output: PageCMS commits content to Git, the host rebuilds on push.
export default defineConfig({
  site: 'https://example.com', // set the real domain per project
  integrations: [sitemap()],
  markdown: {
    // Shiki writes inline styles that the sanitizer strips; turn it off rather than ship broken colors.
    syntaxHighlight: false,
    processor: unified({
      // The sanitizer adds the "user-content-" id prefix itself; don't let remark-rehype add it twice.
      remarkRehype: { clobberPrefix: '' },
      // CMS editors can type raw HTML. Parse it (raw), give headings ids (slug), then strip scripts,
      // event handlers and javascript: links and prefix every id (sanitize). Order matters.
      rehypePlugins: [rehypeRaw, rehypeSlug, rehypeSanitize, rehypePrefixHashLinks],
    }),
  },
  security: {
    // Adds a Content-Security-Policy meta tag with hashes for Astro's own scripts.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      // View transitions inject <style> tags at runtime that Astro can't hash. Inline styles can't
      // run code, so allow them; scripts stay locked to 'self' plus Astro's hashes.
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
  // No inline <style> blocks, so Astro adds no style hashes (a hash would cancel 'unsafe-inline').
  build: { inlineStylesheets: 'never' },
});
