<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# nomanshafiq.com: notes for coding agents

Muhammad Noman's portfolio and blog: Next.js static export (`output: 'export'`, trailing slashes) deployed to Cloudflare Pages from `main`. A push to `main` publishes the live site within about a minute.

## Checks
- `npm run verify` runs typecheck, tests (`tests/*.test.mjs`), `next build` and `scripts/check-export.mjs`. It must pass before every commit.
- `check-export.mjs` lists the indexable pages and key assets, and fails on any file over 25 MiB (the Cloudflare Pages limit). Installers are therefore hosted on GitHub, not here.
- Local preview: `$env:PORT='4317'; node scripts/serve.mjs out` (supports byte ranges for video).
- Phone QA: headless Edge won't go below a 504 px viewport, so screenshot a same-origin iframe harness (`out/__qa.html` with a 390 px iframe) and delete it afterwards.

## Content
- Field notes:
  - `/blog/jev-urdu-benchmarks/`
  - `/blog/pawsip/`
  - `/blog/vibeplayer/`
  - `/blog/trove/`
  - `/blog/stagecraft/` (first on the blog index)
- Download pages: `/pawsip/`, `/vibeplayer/`, `/trove/` and `/stagecraft/`.
- App data: `src/data/pawsip.ts`, `src/data/vibeplayer.ts`, `src/data/trove.ts`, `src/data/stagecraft.ts`, and the shared types in `src/data/windows.ts`. The Windows download picker is `src/components/WindowsDownload.tsx`, with a thin client wrapper per app.
- VibePlayer's auto-update feed: `public/updates/vibeplayer.json`. It must match `src/data/vibeplayer.ts` (a test enforces this). The VibePlayer app reads it, so a release means: push the installers to the VibePlayer repo first, then update both files here and push. PawSip (`public/updates/pawsip.json`), Trove (`public/updates/trove.json`, read by `src/Trove/Services/Updater.cs`) and Stagecraft (`public/updates/stagecraft.json`, read by `src/Stagecraft/Services/Updater.cs`) work the same way.
- Trove's images are real screenshots (PrintWindow captures of Trove's own windows, with demo files); see `docs/TROVE-CONTENT.md`. Its launch video (`public/media/trove-launch.*`) recreates the app's interface, and its caption says so.
- Stagecraft's images are real screenshots too (its own off-screen capture mode, with the sample decks); see `docs/STAGECRAFT-CONTENT.md`. Its version, installers, feature lists and test figures all live in `src/data/stagecraft.ts`. The article has a marked place for a launch video that isn't rendered yet.
- When adding a page, also update `src/app/sitemap.ts`, `public/llms.txt`, `scripts/check-export.mjs` and the tests, and add an evidence doc in `docs/`.
- Honesty rules:
  - Claims must match the app's source code.
  - Recreated UI images are labelled as recreations, not screenshots.
  - Big Buck Bunny footage is credited (© 2008 Blender Foundation, CC BY 3.0).
  - Untested builds (ARM64 hardware, real Windows 7/8.1 machines) are stated.

## Git and writing rules
- Commit as `Muhammad Noman <muhammadnomanshafiq76@gmail.com>`, in the conventional style (`feat: …`, `fix: …`).
- Never add AI attribution: no `Co-Authored-By` trailer and no "Generated with …" line.
- Don't mention AI in commits or site copy about the tools themselves.
- Read and write files as UTF-8 (Edit/Write tools or Node). PowerShell `Get-Content`/`Set-Content` without `-Encoding` corrupts characters such as · — ›.
