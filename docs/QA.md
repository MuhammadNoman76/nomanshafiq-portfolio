# Verification record - 28 September 2026

## What passed

- 13 Node unit/source tests: procedural geometry topology, unit normals, index bounds, distinct shape targets, finite values, static-export configuration, local assets, motion/fallback handling, and invalid mesh sizes.
- 31 browser layout checks: homepage at 320, 375, 390, 600, 768, 1024, 1280, 1440, 1920, and 2560 pixels; the work index, five project pages, and 404 at 320, 768, and 1440 pixels. One H1 per page and no horizontal document overflow in these checks.
- 26 browser interaction/fallback checks: shape gallery changes, pressed states and captions, motion controls, clipboard fallback, resume asset, protected external links, skip navigation, identity schema, repeated initialization, mobile menu/Escape/focus, reduced motion, no-JavaScript content, and JavaScript error checks.
- 7 additional downloadable-preview checks: case navigation, embedded images, next project, return to home/work, interaction reinitialization, and error checks.
- 12 TypeScript/TSX files passed syntax transpilation. This is not a full semantic/framework typecheck.
- 8 original scene configurations rendered using native OpenGL (Mesa llvmpipe), using the implementation's GLSL calculations and mesh math. The browser GLSL precision line was removed and a desktop GLSL version was added for native validation.
- Four current screenshots captured: desktop, mobile, complete homepage, and a project page. All scroll-reveal sections were visible in the complete homepage capture.

See the machine-readable reports in `docs/qa-results/`.

## What was not verified

**A real Next.js production build and a full Next/React typecheck have not run.**

A genuine dependency-install attempt failed in the execution environment:

```
npm error code EAI_AGAIN
npm error syscall getaddrinfo
npm error request to https://registry.npmjs.org/@types%2fnode failed
```

The visual preview was generated from the real TypeScript server-component source through a small JSX serializer. The real CSS and enhancement JavaScript were used. It is not a `next build` export or a substitute for one. Its offline router exists only in the downloadable HTML, not in production source.

**This environment's browser returned no WebGL context.** Browser checks exercised the real fallback path. Native OpenGL rendering confirms the geometry and shader calculations render, but does not establish browser GPU compatibility, frame rate, or performance across devices. The screenshots show the original pre-rendered fallback artwork. On a capable browser the production engine attempts the live WebGL scene, with static fallback on failure.

No Lighthouse score, Core Web Vitals result, WCAG certification, search ranking, or cross-browser certification is claimed.

## Deployment state

No repository update or Cloudflare deployment was completed. The connected GitHub write returned `403 Resource not accessible by integration`. The observed `main` commit was `71c66c784f373728508bf3865f292768b33477bd`.

Cloudflare build logs were not available. No separate Cloudflare build failure has been diagnosed.

Before publishing, run the real dependency install and `npm run verify`. `Publish-Portfolio.ps1 -Push` enforces those checks before committing to and pushing the requested `main` branch. Its PowerShell execution and Git push were not run in this environment.
