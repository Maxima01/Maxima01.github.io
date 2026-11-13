# Portfolio content research

Verified on 8 November 2026 from the user's public GitHub repositories. No private repositories were inspected. Descriptions below summarize repository documentation; no claims about adoption, users, benchmarks, or sole authorship were inferred.

## Michael Don Alaiza / Maxima01

Public profile: <https://github.com/Maxima01>
Source: <https://github.com/Maxima01/Maxima01/blob/main/README.md>

Rechecked through the GitHub connector on 9 November 2026 for the context-panel update: full name, public handle, IT graduation class of 2025, local-first focus, QA, and learning interests. The brief history summarizes these public facts without inventing employment or dates. The public profile photo was downloaded without editing from <https://avatars.githubusercontent.com/u/101929703?v=4&s=320> to `assets/images/michael-alaiza.jpg`. No private contact details were added.

The tool logos were downloaded on 9 November 2026 from Simple Icons v14 and Devicon. `assets/icons/ATTRIBUTION.md` records their sources, and both libraries' licenses are included alongside the assets. The page renders the logos in monochrome through CSS and retains visible tool names. It makes no runtime requests to GitHub or icon CDNs.

- Self-description: aspiring software developer, systems engineer, AI native development.
- Builds practical, local-first software focused on web development, cross-platform experiences, and thoughtful quality assurance.
- Interested in turning everyday problems into useful, private, straightforward tools.
- Works with TypeScript, JavaScript, and React Native; profile stack also includes React, HTML, CSS, and Git.
- Reports experience in QA testing and quality-focused development.
- Information Technology graduate, class of 2025.
- Currently learning Rust, Python, and C# (avoid presenting these as equal proficiency to the main stack).
- Public personal detail: develops in light mode.
- LinkedIn: <https://www.linkedin.com/in/michael-don-alaiza-b566ab263/>
- Discord profile: <https://discord.com/users/413614576672964608>

### Profile update on 9 November 2026

The public Maxima01 profile and `Maxima01/Maxima01` README were rechecked through the GitHub connector. They support the Information Technology graduate, class of 2025, biography used in the profile panel. No additional private biography was inferred.

The public profile photograph is hosted locally as `assets/images/michael-alaiza.jpg`, from <https://avatars.githubusercontent.com/u/101929703?v=4&s=320>. The toolkit's brand marks come from Simple Icons v14 and Devicon; source attribution and included licenses are documented in `assets/icons/ATTRIBUTION.md`.

### Evidence-supported development approach

Suggested editorial summary: "I turn everyday problems into useful software, keep local workflows first, and treat testing and recovery as part of the product."

This is a synthesis, not a verbatim personal quote. The local-first and QA focus are explicit in the profile. Shared engines, clear limits, recoverable state, and documented validation are visible in the featured repositories. Do not claim a specific AI development workflow beyond the profile's stated interest without the user's confirmation.

## Little by Little

Repository: <https://github.com/Maxima01/Little-By-Little>
Public deployed URL recorded in repository metadata: <https://little-by-little-delta.vercel.app>
The deployment URL was obtained from the repository's homepage field; the running site was not tested in this research task.

**Suggested description:** An offline-first writing workspace that keeps manuscripts, characters, world-building notes, and research together.

**Verified stack:** TypeScript, React Native, React, Expo, Electron, AsyncStorage, optional Supabase cloud saves. Builds for web and desktop; the shared project also runs on mobile, with some mobile file actions unavailable.

**Highlights:**

- Rich-text story, chapter, and scene organization.
- Character profiles, linked world-building notes, art references, research, and a project style guide.
- Local proofreading and prose analysis, word-count goals, version recovery.
- Export to PDF, EPUB, Word, Markdown, plain text, and HTML.
- Local autosave, portable workspace backups, automatic desktop backups.
- Optional account-based cloud saves; whole-workspace conflict resolution is explicit rather than automatic manuscript merging.

**Status evidence:** Public active repository, package version 0.1.1, pushed 7 November 2026. No published GitHub releases at time of inspection. A working preview / in-development label is supported; "finished" or "production ready" is not established. Keep cloud sync optional and do not claim end-to-end encryption.

Sources:

- <https://github.com/Maxima01/Little-By-Little/blob/main/README.md>
- <https://github.com/Maxima01/Little-By-Little/blob/main/package.json>
- <https://api.github.com/repos/Maxima01/Little-By-Little>
- <https://github.com/Maxima01/Little-By-Little/releases>

### Screenshots downloaded for the portfolio

All four images are existing project screenshots from the user's public repository. No simulated interface images were made. They are stored unmodified under `assets/images/`:

| Local file | Public source |
| --- | --- |
| `assets/images/writing-desk.png` | <https://github.com/Maxima01/Little-By-Little/blob/main/public/website/writing-desk.png> |
| `assets/images/story-library.png` | <https://github.com/Maxima01/Little-By-Little/blob/main/public/website/story-library.png> |
| `assets/images/chapter-context.png` | <https://github.com/Maxima01/Little-By-Little/blob/main/public/website/chapter-context.png> |
| `assets/images/save-history.png` | <https://github.com/Maxima01/Little-By-Little/blob/main/public/website/save-history.png> |

`writing-desk.png` was visually inspected: a genuine 1440×900 app view with a manuscript editor, story navigation, chapter context, and local-save controls. The other three were downloaded successfully but not visually inspected by this research agent.

## SheetShift

Repository: <https://github.com/Maxima01/Sheetshift>
No deployed website or public installer release was found. Repository homepage is empty, Pages is disabled, and the releases list is empty.

**Suggested description:** A local document-to-Excel converter with a native desktop interface and a scriptable command-line tool sharing one Rust conversion engine.

**Verified stack:** Rust, Tauri 2, React 19, TypeScript, Vite, SQLite.

**Highlights:**

- Local conversion with no conversion server or document uploads.
- Batch processing with individual file results and warnings; unique output names prevent overwrites.
- Review and edit worksheet cells and sheet names before export.
- Reconstruct ruled PDF tables using text positions and cell geometry; select page ranges.
- Optional Format Protection preserves an unchanged XLSX package.
- Desktop and CLI share the same engine, preferences, accepted terms, and SQLite history.
- CLI supports machine-readable JSON and meaningful failure codes for scripting.
- Documented regression tests, CLI workflow tests, formatting/lint checks, and known limitations.

**Status evidence:** Public active repository, last push 22 October 2026. Public profile calls it version 0.1.1, but package.json says 0.1.0; omit a version to avoid inconsistency. README calls for native testing, signing, packaging verification, and release work before public distribution. Label "In development" / "Desktop + CLI". Repository description says "Co-developed with glavin"; preserve collaborative attribution if stating authorship.

**Documented next work:** Parser isolation and cancellation, expanded document regression fixtures, optional local OCR, stronger borderless PDF table handling, native distribution/accessibility validation. These are documented priorities, not a claim the user is currently implementing every item.

**Imagery:** No app screenshots in the public tree. Available icon: <https://github.com/Maxima01/Sheetshift/blob/main/app-icon.svg>. `src-tauri/icons/` contains raster app icons. Do not present an invented UI as a screenshot.

**Portfolio capture:** `assets/images/sheetshift.png` was subsequently captured at 1440 × 900 from the unmodified public `main` frontend on 8 November 2026. The app's browser-preview mode uses an empty conversion queue and never runs the native conversion backend. The visible portfolio caption identifies that limitation. No CSS edits, mock conversion results, or user documents were used. The source was obtained from <https://github.com/Maxima01/Sheetshift>; the extended capture record is `.research/sheetshift-provenance.md`.

Sources:

- <https://github.com/Maxima01/Sheetshift/blob/main/README.md>
- <https://github.com/Maxima01/Sheetshift/blob/main/package.json>
- <https://github.com/Maxima01/Sheetshift/blob/main/docs/GAPS.md>
- <https://api.github.com/repos/Maxima01/Sheetshift>
- <https://github.com/Maxima01/Sheetshift/releases>

## CC15 Password Manager

Repository: <https://github.com/Maxima01/CC15_Password_Manager>

**Verified purpose:** A CRUD password manager using Python.
**Verified stack:** Python, Tkinter/ttk, PyMySQL, MySQL.
**Visible functionality:** View/search account records, add/update/delete accounts, password generation. Source imports a custom encryption module; do not make security or encryption-strength claims.

**Status and attribution:** Archived public fork of <https://github.com/GeorgeJoseMontano/CC15_Password_Manager>, last pushed May 2022. User-specific contribution is unverified. If shown, call it an archived collaborative/learning project or archived fork, and credit the original repository. It should not be a primary "built by me" showcase until contribution is clarified.

No README, deployed URL, app screenshot, or release found. Only image is `photos/default.png`, which should not be assumed to be a screenshot.

Sources:

- <https://api.github.com/repos/Maxima01/CC15_Password_Manager>
- <https://github.com/Maxima01/CC15_Password_Manager/blob/main/password_manager.py>

## Recommended initial content selection

Feature Little by Little and SheetShift with both marked as ongoing projects / working software in development. The portfolio itself may be a third current project once implemented. Use the four real Little by Little screenshots for a useful product gallery, not four different project claims. A completed-project filter should be empty or omitted until a completed project is confirmed; archived status alone is not evidence of completion.

## Added on 8 November 2026

### Coach JM Prime

User-supplied live site: <https://coachjmprimefitness.md01.workers.dev/>. It returned HTTP 200 and was captured in a browser at 1440 × 900. The full-page capture is `assets/images/coach-jm-prime.png`; its first viewport is `assets/images/coach-jm-prime-overview.png`. Both were captured from the live site without modifying its page or imagery. The supplied local source is `C:\Users\AlaizaCorp\Documents\ChatGPT\Project_ Portfolio Website for Mike (Gym guy)\mike-fitness`. The authenticated GitHub repository `Maxima01/coach-jm-prime-portfolio` is private, so the portfolio links to the live site only.

The site's README confirms static HTML generation with CSS, vanilla JavaScript, and a Node.js build, no runtime backend. The live address uses Cloudflare's workers.dev domain. The client's own photographs and words, a dated photo comparison, video highlights, static fallbacks, and direct social contact paths are documented in the source README and visible on the public page. Public-launch approval and search indexing are distinct from having a live URL; the portfolio calls this client work and does not claim client results.

### Signal Desk

User-supplied public sign-in: <https://signal-desk-nopklsq.netlify.app/>. It returned HTTP 200. Its public page requires a provisioned account and authenticator; the full research workspace is not publicly available without one.

User-supplied local source: `C:\Users\AlaizaCorp\Documents\ChatGPT\No Name just yet`. The local README and package.json confirm a cross-market research workspace for web, iOS, and Android, built with TypeScript, React Native, Expo, Supabase Auth, PostgreSQL, Edge Functions, and Netlify web hosting. The project remains in development; initial account onboarding and complete live acceptance are pending. The code's explicit local demo mode uses synthetic prices, charts, headlines, and attention scores and never requests live credentials or market services.

For truthful full-concept previews, `EXPO_PUBLIC_DEMO=true` was set in the temporary demo process environment without changing the project's files or reading its ignored `.env` contents. The existing Vite demo served on loopback. `assets/images/signal-desk-overview.png`, `signal-desk-markets.png`, `signal-desk-trends.png`, `signal-desk-rumor.png`, and `signal-desk-watchlist.png` are unmodified 1440 × 900 browser screenshots of five real demo views. No financial figures from them are presented as live data. The local demo server is stopped after capture.


## Osmanthus — checked 13 November 2026

Public repository: https://github.com/Maxima01/osmanthus
Public README: https://github.com/Maxima01/osmanthus/blob/main/README.md
Build status: https://github.com/Maxima01/osmanthus/blob/main/docs/BUILD_STATUS.md
Local checkout: `../Project_ Osmanthus`, clean at commit `405a816` (preliminary build). The public README was verified through the GitHub connector during this update.

The README and build status establish recording replay, stable process identities, evidence-linked persistence review, bounded static SHA-256/PE/URL inspection, SQLite history, a Slint desktop, a shared backend and CLI, and 12 recorded passing tests. These are a preliminary foundation, not live host monitoring. ETW collection, hardened service transport, quarantine, isolated execution, and distribution remain later work. The toolkit additions reflect this actual implementation. The portfolio does not imply production security expertise or malware verdicts.

Screenshot provenance: `tmp/qa/behavior.ppm`, `timeline.ppm`, and `inspection.ppm` from that checkout's desktop rendering verification. Converted losslessly to `assets/images/osmanthus-{behavior,timeline,inspection}.png`, each 1180 by 820. The synthetic provenance and collectors-offline labels remain visible; no UI or data was invented. The inspection fixture is from the local project test, not a visitor's file.

Header asset: Three.js 0.180.0 `build/three.module.min.js` and `build/three.core.min.js`, copied from the versioned npm package via jsDelivr into `assets/vendor/three/`, with the upstream MIT license. Vendoring removes the runtime CDN requirement. The custom mark is decorative and is not an atomic-physics simulation.
