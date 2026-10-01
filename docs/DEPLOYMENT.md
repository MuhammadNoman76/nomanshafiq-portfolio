# Deployment: diagnose the real failing stage

## What was observed

The connected GitHub integration rejected a file-write attempt with HTTP 403 (`Resource not accessible by integration`). The main branch inspected was `71c66c784f373728508bf3865f292768b33477bd`. The combined-status read returned no entries. These observations do not provide access to Cloudflare's internal build logs.

A downloadable ZIP does not modify the remote repository. A screenshot is not a production deployment. This delivery is not claimed deployed.

## If the website still shows the old version

1. Check the commit shown in the GitHub main branch. The new `package.json` name is `noman-kinetic-portfolio`, and the new engine is `public/engine/sculpture.mjs`.
2. Check the repository and production branch connected to the existing Cloudflare project. The intended repository is `MuhammadNoman76/nomanshafiq-portfolio` and the branch is `main`.
3. Compare the latest production deployment's SHA with GitHub's SHA. Different SHAs mean the new commit is not what the domain is serving.
4. If the SHAs match but the build failed, inspect the **first substantive error** in the build log. The final `exit code 1` is not the root cause.
5. If the matching build succeeded, check the domain points to that production deployment. Check in a private browser tab to distinguish a cached page from a routing problem.

No claim is made that a specific Cloudflare build failure has been diagnosed without its log.

## Cloudflare Pages / static export

Use `npm run build` and publish **out**. The Next configuration already sets `output: 'export'`. Every dynamic project route has `generateStaticParams`, and sitemap, robots, and manifest explicitly force static output. There are no server actions, middleware, dynamic API routes, or runtime environment lookups requiring a server.

Node 22 is declared in `.nvmrc`. The root directory is the repository root. Use the `Next.js (Static HTML Export)` preset, not an SSR or OpenNext preset. Keep the existing production domain association.

## Cloudflare Workers is a different deployment product

If the dashboard asks for a Workers deploy command and not a Pages build-output directory, do not enter `out` into a Workers SSR preset. A Worker hosting a static asset directory and an SSR Next runtime require different configurations. This source does not silently add a Worker or create a replacement Cloudflare project.

Either keep the existing Pages static-export route, or explicitly choose and configure an appropriate Workers deployment after confirming which project currently owns the domain. The Pages instructions above do not claim to fix a Worker deployment.

## Rollback

The publishing script creates a normal Git commit and preserves history. If the change must be rolled back, revert that replacement commit and push the revert to main. Do not force-push or erase repository history.

## References inspected

- https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
- https://developers.cloudflare.com/pages/framework-guides/nextjs/
- https://nextjs.org/docs/app/guides/static-exports
