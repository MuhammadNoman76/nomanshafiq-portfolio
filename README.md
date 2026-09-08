# Muhammad Noman — Portfolio V6 Signature Lab

A premium editorial portfolio built with Next.js 16.3.4, React 19.2.8, TypeScript, the App Router, CSS/SVG artwork, and crawlable project case-study routes. V6 adds a distinctive interactive "Build Lab" with collectible engineering objects while keeping the reading hierarchy intentionally calm.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production

```bash
npm run build
npm start
```

A production `Dockerfile` is included for Azure Container Apps or any container platform.

## Deploying on Cloudflare Pages

1. In Cloudflare Dashboard, go to **Compute (Workers & Pages)** > **Create** > **Pages** > **Connect to Git**.
2. Select your repository `MuhammadNoman76/nomanshafiq-portfolio`.
3. Configure the build settings:
   - **Framework preset**: `Next.js (Static HTML Export)`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/`
4. In **Environment variables**, make sure Node.js 22 is set (already configured via `.nvmrc`):
   - `NODE_VERSION`: `22`
5. Click **Save and Deploy**.


## V6 signature design

- Interactive Agent Core specimen with animated system graph
- LangVoice-inspired translucent Voice Capsule
- Custom AI Systems microchip with live LED details
- Karachi Origin Pass with Urdu typography and skyline geometry
- Hero signal cassette and agent badge as signature edge objects
- Glass/foil materials, micro-shadows, animated light sweeps, and pointer tilt
- Concentrated object zones so the design feels surprising without becoming messy
- Reduced-motion support for all decorative animation
- CSS/SVG/vector-first rendering for crisp Retina and 4K output

## SEO features

- Keyword-focused but human-written title and description
- Canonical URL support
- Googlebot indexing directives
- Generated `robots.txt`
- Generated sitemap including every project case study
- Person, WebSite, ProfilePage, ItemList, CreativeWork, and Breadcrumb JSON-LD
- Crawlable `/work/[slug]` project pages with unique metadata
- Dynamic Open Graph image
- Twitter/X large-card metadata
- `llms.txt` for AI-facing site discovery
- `en-PK` locale and Karachi geo metadata
- Search Console verification env support
- Semantic headings and visible DOM text rather than canvas-only content

## Search Console

1. Deploy the site on the final domain.
2. Make sure the homepage returns HTTP 200 publicly.
3. Add the domain to Google Search Console.
4. Put the verification token in `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
5. Submit `https://www.thenoman.online/sitemap.xml`.
6. Request indexing for the homepage and the strongest project case studies.

SEO can improve discoverability and click-through rate, but no implementation can guarantee a specific Google ranking. Useful content, reputation, links, crawlability, site reliability, and competition also matter.

## Main content

Portfolio copy and project information live in:

`src/data/portfolio.ts`

## Main routes

- `/`
- `/work/langvoice`
- `/work/resumeworld`
- `/work/metamod`
- `/work/reelsbuilder`
- `/work/lughaat`
- `/sitemap.xml`
- `/robots.txt`
- `/manifest.webmanifest`
- `/llms.txt`
- `/api/health`
