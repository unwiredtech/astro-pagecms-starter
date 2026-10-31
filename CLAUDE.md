# {{PROJECT_NAME}}

{{PROJECT_SUMMARY}}

## Stack

- **Astro** (static output) with **view transitions** (`<ClientRouter />` in `src/layouts/Base.astro`).
- **PageCMS** edits content through GitHub. Config: `.pages.yml`. Media goes to `public/media`.
- **Motion** (`motion`) for simple entrance and hover animation.
- **GSAP + ScrollTrigger** for scroll-linked effects only, loaded on demand.
- No UI framework (React, Vue) unless a page truly needs client state. Ask first.

## Commands

| Command          | What it does                                                                      |
| ---------------- | --------------------------------------------------------------------------------- |
| `npm run dev`    | Dev server (agents: `npx astro dev --background`, stop with `npx astro dev stop`) |
| `npm run check`  | Type check (`astro check`), ESLint, Prettier check                                |
| `npm run format` | Prettier write                                                                    |
| `npm run build`  | Static build into `dist/`                                                         |
| `npm test`       | Unit tests in `src/lib/` (`node --test`)                                          |
| `npm run verify` | `check` + `test` + `build`. Run before calling any change done                    |

## Where things live

- `src/content/pages/*.md`: one file per page. `index.md` is `/`, `about.md` is `/about/`.
- `src/data/site.json`: site name and navigation (PageCMS "Site settings"), validated by `src/data/site.ts`.
- `src/content.config.ts`: Zod schema for content. **Must match `.pages.yml` field for field.**
  Change both in the same edit, or PageCMS saves content the build rejects.
- `src/pages/[...slug].astro`: renders every page from the collection.
- `src/components/`: one component per section type.
- `src/scripts/effects.ts`: starts and stops all effects on `astro:page-load` / `astro:before-swap`.

## Effects: which tool to use

Pick the first that works:

1. **CSS** (transitions, `:hover`, `@keyframes`): no JS needed.
2. **View transitions**: page-to-page movement. `transition:name` on matching elements
   across pages, `transition:animate` for the swap. `transition:persist` for things that
   must survive navigation (header, audio).
3. **Motion**: add `data-reveal` to fade/slide something in on scroll (`src/scripts/reveal.ts`).
   New entrance styles go in that file.
4. **GSAP + ScrollTrigger**: only for scrub, pin, or timelines tied to scroll position.
   Add a named effect to `scrollEffects` in `src/scripts/scroll.ts` and use
   `data-scroll="<name>"`. GSAP is only downloaded on pages that use it.

Rules for every effect:

- Respect `prefers-reduced-motion`: content must be fully visible and usable without animation.
- Every effect started on `astro:page-load` must be cleaned up on `astro:before-swap`
  (Motion: call the stop function; GSAP: `gsap.context(...).revert()`). Otherwise effects
  leak or double up after client-side navigation.
- Never put scripts that need re-running in `is:inline` tags without thinking about view
  transitions. Bundled `<script>` tags run once; hook into `astro:page-load` instead.
- Animate `transform` and `opacity` only. No layout properties.

## Content and security

- CMS content is untrusted. Markdown goes through raw → slug → `rehype-sanitize` → hash-link fix
  (`astro.config.mjs`); never remove the sanitizer or put a plugin after it that adds HTML.
  Ids in content get a `user-content-` prefix, so layout ids like `#main` can't be hijacked. Render other fields as text. No `set:html` on CMS fields.
- Validate every CMS value at build time: pages in `src/content.config.ts`, site settings in
  `src/data/site.ts` (links must start with `/`, `#`, `https://` or `mailto:`; images must be in `/media`).
- CSP is on (`security.csp` in `astro.config.mjs`): scripts only from `'self'` plus Astro's
  hashes. Inline styles are allowed because view transitions inject `<style>` tags Astro can't
  hash; that only works while `build.inlineStylesheets` is `'never'`, so leave it. New
  third-party scripts go into the CSP config, not around it.

## Converting an existing site

{{SOURCE_SITE}}

Per page: list its sections, map each to a component (reuse before adding), add any new
fields to **both** `.pages.yml` and `src/content.config.ts`, move the copy into
`src/content/pages/<slug>.md`, download images into `public/media/`, then compare the
build with the original side by side. Keep URLs the same as the old site, or add redirects.

## Deploy

{{DEPLOY}}

The host must send these headers (a `<meta>` CSP can't block framing): `Strict-Transport-Security: max-age=31536000; includeSubDomains`,
`X-Content-Type-Options: nosniff`, `Content-Security-Policy: frame-ancestors 'none'` site-wide (a stricter header CSP would block the hashed inline scripts and view-transition styles), plus `Content-Security-Policy: default-src 'none'; img-src 'self'; sandbox` on `/media/*` only,
`Referrer-Policy: strict-origin-when-cross-origin`. HTTPS only, TLS 1.2 or later.

## Done means

`npm run verify` passes, the page was checked in a browser (including reduced motion and a
client-side navigation away and back), `bug-tester` and `security-reviewer` agents pass,
and the graph is updated with `/graphify . --update`.
