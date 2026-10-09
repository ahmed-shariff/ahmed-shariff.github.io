---
name: site-repo-structure
description: Navigate and maintain this SvelteKit personal site.
version: 0.1.0
author: emacs
metadata:
  tags: [SvelteKit, Blogging, GitHubPages]
---

# Site repository structure

This skill describes the high-level layout and data flow of the `ahmed-shariff.github.io` personal site. It covers where routes, reusable components, Markdown posts, static assets, and build configuration live. It does not define general SvelteKit practices or replace reading the implementation before making a behavior change. It has no dependency on global skills or agent-specific project tooling.

## When to Use

Use this skill when a request involves:

- finding the route for the home page, post list, post detail, or RSS feed;
- adding or editing a Markdown post;
- changing shared post or site UI;
- changing static assets or deployment behavior;
- understanding how posts are discovered, filtered, sorted, or rendered;
- checking the build or GitHub Pages output.

## Prerequisites

- Node.js and npm installed.
- Dependencies installed with `npm install` in the `ahmed-shariff.github.io` project.
- For deployment, a push to the `master` branch and GitHub Pages enabled for the repository.
- No application credentials are required for local development or the static build.

## How to Run

Work from the root of the `ahmed-shariff.github.io` project. On Windows, invoke commands through the `PowerShell` tool. On Linux, invoke them through the `Bash` tool:

```powershell
npm install
npm run dev
npm run build
npm run preview
```

Use `Read`, `Glob`, and `Grep` to inspect source files before editing. Check component prop contracts and SVG coordinate systems before connecting reusable components. Use `EditBatch` for targeted existing-file changes and `Write` for new files.

## Quick Reference

- `src/routes/(main)/+page.svelte` — home page UI.
- `src/routes/(main)/+page.js` — home page data, split into four publications and four regular posts.
- `src/routes/(main)/posts/+page.svelte` — post archive UI.
- `src/routes/(main)/posts/+page.js` — archive data and tags.
- `src/routes/(main)/post/+page.js` — redirects `/post` to `/posts`.
- `src/routes/(main)/post/[slug]/+page.svelte` — post detail UI.
- `src/routes/(main)/post/[slug]/+page.js` — imports the matching Markdown post and exposes metadata/content.
- `src/routes/(main)/posts.xml/+server.js` — prerendered RSS endpoint.
- `src/routes/(hpui-system)/hpui-systems/` — separate HPUI systems section.
- `src/lib/allPosts.js` — Markdown discovery, publication filtering, date parsing, sorting, and tag collection.
- `src/lib/*.svelte` — shared site and post components.
- `src/lib/icons/` — icon components.
- `src/posts/*.md` — post content and frontmatter metadata.
- `src/posts/assets/` — assets kept with individual posts. Post frontmatter thumbnail paths are relative to this directory, for example `2026-07-03/thumbnail.png`.
- `static/` — files copied directly to the generated site, including PDFs and favicons.
- `public/` — additional public files, including `posts.xml` and images.
- `svelte.config.js` — static adapter and mdsvex configuration.
- `vite.config.js` — SvelteKit and Tailwind Vite plugins. On this Windows setup, the repository may be accessed through a symlink or mapped drive. If Vite returns 403 for `/.svelte-kit/generated/...` or `/src/posts/assets/...`, inspect the resolved project path and configure `server.fs.allow` for the project root in `vite.config.js`.
- `tailwind.config.js` — content scanning, typography, spacing, font sizes, and syntax highlighting.
- `.github/workflows/svelte-gh-pages-deploy.yml` — build and GitHub Pages deployment.
- `build/` — static adapter output; generated, not source.

## Procedure

1. Identify the affected layer.
   - Route behavior belongs under `src/routes/`.
   - Shared presentation belongs under `src/lib/`.
   - Post content belongs under `src/posts/`.
   - Directly served files belong under `static/` or the existing `public/` area, based on the neighboring implementation.
   - Build and deployment behavior belongs in the root configuration files or `.github/workflows/`.

2. For post-list behavior, read `src/lib/allPosts.js` first. It uses `import.meta.glob('../posts/*.md')`, reads each module's `metadata`, derives the date from the first ten characters of the filename, filters unpublished posts outside development, sorts by descending date, and gathers unique non-null tags. If list metadata refers to assets, resolve them in this data layer with a static `import.meta.glob('../posts/assets/**/*', { eager: true, query: '?url', import: 'default' })`; never pass `/src/posts/assets/...` strings to the browser.

3. For a new post, add a file under `src/posts/` whose filename begins with `YYYY-MM-DD`. Follow the metadata keys used by nearby posts, especially `title`, `description`, `tags`, `image`, `ispub`, and `published`. Keep post-specific media under `src/posts/assets/<post-date>/` when that is the existing pattern.

4. For post detail behavior, follow the route parameter flow. `[slug]/+page.js` imports `../../../../posts/${slug}.md`, reads `post.metadata` and `post.default`, derives a display date with `slugToDate`, and returns the content and metadata to `[slug]/+page.svelte`. Reuse the shared asset resolver from `src/lib/allPosts.js` so detail pages and list pages return the same generated thumbnail URL.

5. For home-page changes, preserve the distinction between `meta.ispub` posts and regular posts. The home loader selects up to four of each category after `getAllPosts()` resolves.

6. For archive changes, keep the archive loader's `posts` and `tags` return shape unless the page component changes with it. The archive uses the same central post index as the home page.

7. For RSS changes, update `src/routes/(main)/posts.xml/+server.js`. The endpoint is prerendered, creates a `Feed`, and derives each item from post metadata and the filename-based slug/date. Check URL construction when changing slug handling.

8. For styling changes, inspect `src/app.css`, the relevant component, and `tailwind.config.js`. Tailwind scans `src/**/*.{html,js,svelte,ts}`. Markdown typography and highlighted code styling are configured globally. Define repeated layout values such as postcard widths as named Tailwind theme tokens rather than repeating raw utilities. For related page layouts, use the same responsive structure: a left sidebar with `md:sticky md:top-20` and a main content column. Keep the shared header height fixed when it is sticky so the sidebar does not jump as the page begins scrolling.

9. Run `npm run build` through `PowerShell` on Windows or `Bash` on Linux. The static adapter writes pages and assets to `build/` and uses `404.html` as the fallback. Do not edit generated directories such as `.svelte-kit`, `.next`, or `build/` as source.

10. For deployment changes, inspect the workflow. It installs Node 24, runs `npm install`, runs `npm run build`, uploads `build/`, and deploys with GitHub Pages actions on pushes to `master`.

## Pitfalls

- Filename dates are part of the post index. A malformed or missing `YYYY-MM-DD` prefix breaks date derivation or sorting.
- `published` is treated differently in development and production. Development includes unpublished posts; the production filter keeps posts where `published` is absent or truthy.
- The detail loader's `published` value is computed separately and should not be assumed to match the archive filter without checking the code.
- `meta.ispub` controls the home-page publication grouping. It is not the same flag as `published`.
- `src/posts/assets/` is not included by the post glob. Keep asset changes independent of Markdown module discovery, and use Vite imports or `import.meta.glob` for assets. Frontmatter paths are metadata keys, not browser URLs.
- For Markdown-body images, the existing `<script>` imports from `/src/posts/assets/...` are valid because mdsvex/Vite transforms static imports. Do not copy that browser-facing path into dynamically rendered frontmatter metadata.
- `/post` intentionally redirects to `/posts`; do not add a duplicate archive page without changing that route.
- `src/routes/(main)/posts.xml/+server.js` contains a fixed site URL. Update it deliberately if the canonical domain changes.
- `build/`, `.svelte-kit/`, `.next/`, and `node_modules/` are generated or installed content, not places for source edits.
- The repository contains both `public/` and `static/`. Follow the existing location and verify the resulting URL rather than moving files casually.

## Development-server troubleshooting

If the browser reports 403 responses for generated SvelteKit modules such as `/.svelte-kit/generated/client/nodes/0.js`, or for frontmatter thumbnails under `/src/posts/assets/...`, the issue is usually Vite's filesystem allow-list rejecting the resolved target of a symlinked or mapped project path. Reinstalling packages and deleting generated directories does not change that check. Configure `server.fs.allow` in `vite.config.js` for the project root, then restart Vite. Verify that only one dev server is running before testing the port, since Vite may choose the next port when 5173 is occupied. If an agent starts a server for diagnosis, stop that process when finished.

Do not assume `C:\\...` and `S:\\...` paths are separate checkouts. Ask first or inspect the link/mapping because they may refer to the same project.

## Reusable component notes

`src/lib/PersonalLink.svelte` accepts Simple Icons data objects with `path` and `title`, and it also accepts Svelte icon components. Components passed as icons must render through a dynamic component branch rather than being treated as path data. The local `linkedin.svelte` icon uses a 24 by 24 path and must retain a matching `viewBox="0 0 24 24"`; mismatched SVG coordinate systems make the path appear missing or misplaced.

When a shared component supports multiple input shapes, inspect each caller before changing the component. Preserve the existing Simple Icons path branch while adding component support, and verify with a production build.

## Verification

From the root of the `ahmed-shariff.github.io` project, invoke this through `PowerShell` on Windows or `Bash` on Linux:

```text
npm run build
```

A successful build should complete without errors and produce the static site in `build/`.
