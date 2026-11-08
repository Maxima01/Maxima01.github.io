# Michael Don Alaiza — portfolio

A static portfolio for selected projects, their technology and development highlights, and Michael's approach to building software. Plain HTML, CSS, and JavaScript keep the site portable and easy to maintain. There are no runtime dependencies, API keys, or server functions.

## Local preview

Use Node.js 22 or newer. No package installation is required.

```sh
npm run dev
```

Open the printed URL, normally `http://127.0.0.1:4173/`. Stop the server with Ctrl+C. If the port is busy, run `npm run dev -- --port 4174`.

```sh
npm run check
npm run build
npm run preview
```

`check` verifies metadata, local references, image alt attributes, anchor targets, and JavaScript syntax. It does not contact external project URLs or replace browser accessibility checks. `build` runs those checks and writes only the public site files into `dist/`; it replaces the previous generated `dist/` directory. `preview` serves that output.

To check repository-path hosting locally:

```sh
npm run preview -- --base /portfolio --port 4174
```

Then open `http://127.0.0.1:4174/portfolio/`. Keep asset URLs relative so the same files work under either `/` or `/repository-name/`.

## Edit the portfolio

- `index.html` contains the biography, project descriptions, technology lists, contact links, and screenshot markup.
- `styles.css` contains the visual system and responsive layouts.
- `script.js` contains the small progressive enhancements.
- `assets/` contains the locally hosted images and fonts. Use descriptive filenames and meaningful `alt` text when adding project screenshots.

Update project status, links, and screenshot descriptions together. Keep claims tied to actual project capabilities; label unfinished work clearly. The site does not fetch repository content at runtime, so visitors are not affected by GitHub API limits.

The project set is Little by Little, SheetShift, Coach JM Prime, and Signal Desk. The first two software tools and Signal Desk are labeled in development. Coach JM Prime is client work with a live website; its source is private. Signal Desk's public link leads to protected sign-in, while its gallery shows actual screens from the local demo with synthetic market data. Project details are grounded in their source material; the approach section reflects Michael's supplied description. `PROJECT_RESEARCH.md` records sources and screenshot provenance. Epilogue is self-hosted under the SIL Open Font License in `assets/fonts/OFL.txt`.

Project filters are a progressive enhancement: without JavaScript, every project remains visible. Image links and expandable details use native browser behavior. Animation is disabled when reduced motion is requested. Local browser verification covered 1440, 768, 390, and 320 pixel widths, filters, detail toggles, keyboard entry, image loading, and the no-JavaScript fallback.

## Deploy to GitHub Pages

The deployment workflow is prepared. A GitHub repository and a live Pages deployment have **not** been created as part of this setup.

1. Create the destination repository on GitHub and push this source to its `main` branch. Use `Maxima01.github.io` for the profile-site URL, or another name for a project-site URL.
2. In the repository, open **Settings → Pages → Build and deployment** and select **GitHub Actions** as the source.
3. Open **Actions → Deploy portfolio to GitHub Pages → Run workflow**, or push a change to `main`.
4. Open the deployed URL shown in the successful workflow's `github-pages` environment.

The workflow validates the source, builds `dist/`, uploads that folder, and deploys it. Research notes, development scripts, and repository metadata are excluded from the published artifact. No install step is needed.

The workflow uses GitHub's official Pages actions and a token supplied automatically by GitHub Actions. Refer to [GitHub's custom workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). The Node action is documented in [actions/setup-node](https://github.com/actions/setup-node).

If your default branch uses a different name, update the `push.branches` list in `.github/workflows/pages.yml`. If a deployment is waiting for review, inspect the repository's `github-pages` environment protection rules.
