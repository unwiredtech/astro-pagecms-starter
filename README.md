# Astro + PageCMS starter

Static Astro site with content edited in [PageCMS](https://pagescms.org), plus:

- **View transitions** between pages (`<ClientRouter />`)
- **Motion** reveal-on-scroll: add `data-reveal` to any element
- **GSAP + ScrollTrigger**, downloaded only on pages that use `data-scroll="<effect>"`
- Reduced-motion support, and effects cleaned up on every page change
- Sanitized Markdown, build-time validation of all CMS content, and a Content-Security-Policy
- ESLint, Prettier, `astro check` and unit tests in one command: `npm run verify`

## Start a new site

```bash
gh repo create my-site --private --template <owner>/astro-pagecms-starter --clone
cd my-site
npm ci
npm run verify
npm run dev
```

Then:

1. Set `name` in `package.json` and `src/data/site.json`, and `site` in `astro.config.mjs`.
2. Fill the `{{PLACEHOLDERS}}` in `CLAUDE.md` (project summary, source site, deploy target).
3. Connect the repo in PageCMS. It reads `.pages.yml`.

## Where things live

| Path                     | What                                                                    |
| ------------------------ | ----------------------------------------------------------------------- |
| `src/content/pages/*.md` | One file per page (`index.md` is `/`)                                   |
| `src/data/site.json`     | Site name and navigation, validated by `src/data/site.ts`               |
| `src/content.config.ts`  | Page schema. Must match `.pages.yml` field for field                    |
| `src/scripts/`           | `effects.ts` (lifecycle), `reveal.ts` (Motion), `scroll.ts` (GSAP)      |
| `CLAUDE.md`              | Rules for which effect tool to use, content security and deploy headers |

## Deploy

Any static host: build with `npm run build` and publish `dist/`. The host should rebuild on every
push, since PageCMS saves content as Git commits. The security headers the host must send are
listed in `CLAUDE.md`.
