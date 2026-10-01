# Muhammad Noman / KINETIC

**Curiosity, made real.** An original Next.js portfolio with a native WebGL sculpture, morphable geometry, reflective studio materials, art-directed project pages, and a deliberately small interaction layer.

## Honest delivery status

The source and interactive visual preview were created locally. This delivery was **not pushed to GitHub and is not confirmed deployed**. GitHub's connected integration returned `403: Resource not accessible by integration`. The repository's main branch was still `71c66c784f373728508bf3865f292768b33477bd` at inspection.

The authoring environment cannot download npm packages. A real Next production build and framework typecheck therefore could not be completed here. The visual preview renders the same server-component markup without Next's runtime; it must not be mistaken for a tested Next production export. Read `docs/QA.md` for exactly what was tested.

## Local development

Requires Node.js 22+.

```sh
npm install
npm run dev
```

The first install creates `package-lock.json`. Commit that generated lockfile. CI and the publishing script use `npm ci` once it exists. Dependencies start from published Next 16.3 and React 19.2 releases and allow compatible patch updates; the resolved versions must pass verification before deployment.

## Production verification

```sh
npm run verify
npm run preview
```

`verify` runs the real framework typecheck, unit tests, `next build`, and a static-export audit. `preview` serves the verified `out` directory on port 3000. The local preview server is not the Cloudflare runtime.

## Existing Cloudflare Pages project

This is a **static Next.js App Router export**, deliberately preserving the existing repository's `output: 'export'` model.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | repository root (leave blank) |
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node.js | 22 |
| Optional site URL | `NEXT_PUBLIC_SITE_URL=https://www.nomanshafiq.com` |

Do **not** use `.next` as the Pages output, `next start` as a Pages command, `next export`, `next-on-pages`, or a Workers deploy command with this Pages configuration. See `docs/DEPLOYMENT.md` when the dashboard is a Workers project instead.

## Publish the replacement on Windows

Extract this project, then run PowerShell in the extracted folder:

```powershell
.\Publish-Portfolio.ps1 -Push
```

This uses your own authenticated GitHub session, not the connection that returned 403. It clones the requested repository into a fresh temporary folder, preserves `.git` and the repository license, replaces the old website files, installs dependencies, and verifies the build. Only after all checks pass does it commit and push to `main`. It never force-pushes, and stops if remote main changed during verification. No existing local checkout is deleted.

The automatic Cloudflare deploy still depends on the existing Git integration being connected to the correct repository and `main` branch. Compare commit SHAs, not just timestamps.

## The experience

- Original procedural three-dimensional sculpture, not a stock model or CSS cube.
- Connect / Flow / Reimagine morph targets with a real depth buffer and studio-reflection shader.
- Pointer rotation, arrow-key rotation, camera response to scroll, and subtle ambient movement.
- Live project sculptures on desktop; only visible scenes animate.
- Reduced-motion preference, explicit motion control, visibility suspension, and WebGL-unavailable image gallery.
- Native page links and scrolling. No scroll hijacking, fake loading percentage, compulsory audio, or custom cursor.
- Five statically generated project pages and a work index. Home, case studies, contact links, and resume remain usable without JavaScript.
- Page metadata, canonical URLs, Person / WebSite / CreativeWork structured data, sitemap, robots, favicon, and social image.
- No external model, texture, font, or JavaScript CDN is required at runtime. Fonts use the system's Arial / Georgia / monospace stacks.

## Editing

- Profile, experience, projects: `src/data/portfolio.ts`
- Page composition: `src/app/page.tsx`
- Design tokens and breakpoints: `src/app/globals.css`
- Original geometry and GLSL: `public/engine/sculpture.mjs`
- Interaction / lifecycle: `public/engine/experience.mjs`
- Source and design rationale: `docs/CONTENT-SOURCES.md`, `docs/DESIGN-RESEARCH.md`

Experience figures come from the owner's supplied resume and are described as self-reported. Artwork is conceptual, not a screenshot of the products. Search-engine ranking is not guaranteed by the implementation.
