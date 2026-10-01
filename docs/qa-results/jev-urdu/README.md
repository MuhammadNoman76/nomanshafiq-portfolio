# Jev-Urdu launch verification — 1 October 2026

The new blog and archive were checked using the actual Next.js 16.3.8 production export, served by `npm run preview`. This record supplements the historical QA document; these screenshots are not from the older JSX preview serializer.

- `npm run verify` passed: semantic TypeScript check, all 16 Node tests, genuine production build, and export checks for 9 indexable pages plus discovery files and local assets.
- The final CSS refinement was rebuilt, typechecked by Next, and export-checked again. Next's required `react-jsx` configuration and generated development type include are retained in the source configuration.
- 22 browser check groups passed in Chromium: homepage, blog archive and article at 320, 375, 390, 768 and 1440 pixels; both explorers' controls; metric direction and exact displayed values; model visibility and empty state; accessible tables; metadata and downloads; mobile navigation; no-JavaScript article/default charts; reduced-motion preference; and no browser JavaScript errors. The detailed record is `browser-checks.json`.
- A separate design agent inspected fresh desktop, tablet and mobile pages. The initial review's chart-text finding was fixed with 12px model labels/values, 11–12px explanatory text, readable table data and stacked mobile bars. A fresh second review passed all four design criteria and found no material outstanding issues. Table scrolling remains inside its container at 320 and 375 pixels.
- The 32 published local accuracy summaries were checked against saved prediction records. This is an audit of the recorded benchmark run, not a newly executed GPU/model benchmark. Three regression tests preserve the published metric values, paired comparisons and separate API sample counts.

The screenshots capture the real exported article and charts. The imagegen cover and social card are conceptual launch artwork; the quantitative charts use the recorded JSON values. Wider-language quality, single-request latency, Lighthouse scores and formal accessibility certification are not asserted.

The LinkedIn draft is in `docs/launch/jev-urdu-linkedin.txt` with accompanying editorial notes in the Markdown file. It has not been posted to LinkedIn.
