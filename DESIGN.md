---
name: Michael Don Alaiza — Portfolio
description: A split-stage portfolio pairing real project interfaces with a readable account of the work.
colors:
  paper: "#eeeeec"
  ground: "#e2e2e2"
  surface: "#d6d6d6"
  ink: "#271f20"
  muted: "#6e5e60"
  accent: "#7d0c14"
  on-accent: "#eeeeec"
  header-deep: "#4c0810"
  header-red: "#a52330"
  header-muted: "#f0ced1"
  particle-red: "#ff727e"
  particle-blue: "#70baff"
  particle-purple: "#ce9bff"
typography:
  family: "Epilogue, Arial, sans-serif"
  display: "clamp(3.5rem, 6.5vw, 6rem)"
  heading: "clamp(2rem, 3.1vw, 3rem)"
  lead: "clamp(1.25rem, 1.6vw, 1.5rem)"
  body: "1rem"
  small: "0.875rem"
rounded:
  square: "0px"
spacing:
  gutter: "clamp(24px, 3.3vw, 56px)"
  wrapper-max: "1500px"
motion:
  ease: "cubic-bezier(.16, 1, .3, 1)"
  quick: "180ms"
  settle: "650ms"
---

# Design System: Michael Don Alaiza — Portfolio

## Overview

The direction is **split-stage**, seed **688487477**. It retains Epilogue, oxblood, and the existing neutral palette, while separating charcoal reading text from oxblood headings and actions. On this page, Michael's real software interfaces become a persistent project stage beside the account of his work.

The context panel follows the section being read: About, the everyday-software statement, Work, Approach, or Contact. Within Work, its image, title, status, caption, and full-image destination follow the current project. Its project links jump to the matching article. Product facts remain in `PRODUCT.md` and `PROJECT_RESEARCH.md`.

This document describes the implementation in `index.html`, `styles.css`, and `script.js`; verification scope is recorded in `README.md`. The pre-existing stale `.impeccable/design.json` sidecar has not been refreshed and may contradict this document; the current source and this document describe the revised system. The incumbent token frontmatter is preserved for this extension.

## Colors

All page colors use the CSS roles above. Paper is the main reading ground; gray ground distinguishes the software statement, tools disclosure, SheetShift, and Signal Desk. Surface is the deeper neutral used for image backgrounds and filter hover. Charcoal ink carries substantive prose. Muted ink is reserved for secondary status, captions, technology lists, and credits. Oxblood carries headings, links, selected controls, the desktop panel, and contact. Reversed content uses on-accent paper. The panel's Contact view switches to gray ground with oxblood text beside the reversed contact section.

The page declares a light color scheme. Project screenshots retain their own interface colors rather than being recolored to match the portfolio.

## Typography

Epilogue is self-hosted through regular, bold, and black TTF files. The declarations map these to weights 400, 500–700, and 800–900, use `font-display: swap`, and preload black. The font license remains in `assets/fonts/OFL.txt`.

Five scale tokens cover small text, body, lead, headings, and display. Body text uses 1.65 leading. Headings use tight tracking and balanced wrapping; the About and software headings use authored line spans. Display headings use weight 900. Desktop, tablet, and phone rules adjust display sizes to their available reading width. Statuses are not conveyed by color alone.

## Layout

The full-width static header uses a deep-red-to-oxblood-to-red gradient explicitly requested by the user, with light navigation and a tinted secondary role. A tilted Three.js figure-eight sits beside the wordmark, followed by About, Work, Approach, and contact anchors. Its active section receives `aria-current="location"` from the same reading-position logic as the context panel; the everyday-software statement maps to About. There is no mobile menu or sticky header.

At a viewport of at least **1100px wide and 760px tall**, JavaScript enables the two-column composition through `.panel-open` unless the visitor has hidden the panel. This enhancement does not depend on `IntersectionObserver`. The left panel takes 47% and the right reading area 53%. The panel is sticky at the viewport top, uses `100svh` height with a 620px minimum, and has a fixed toolbar/footer around an independently scrollable content area. Inline main screenshots are hidden only while this desktop panel is open.

On smaller or shorter viewports, without JavaScript, or when the visitor hides the panel, each project's original image remains inline. The profile/toolkit and development map each exist as a single DOM node: JavaScript moves them into the panel when open and returns them to their original native disclosures otherwise. The profile disclosure starts closed; the development map starts open. Without JavaScript, both stay in those inline homes.

The full-width layout uses image/copy columns until 800px, then stacks them. At 540px and below, the header stacks, navigation remains visible, project statuses move below titles, galleries and detail columns become single columns, and the contact button spans the reading width. The phone gutter is 22px.

The reading sequence remains **About → software statement → Work → Approach → Contact**. Project order remains **Little by Little → SheetShift → Coach JM Prime → Signal Desk → Osmanthus**. About places the primary “Explore my work” action next to the light-mode aside.

The common wrapper caps at 1500px and uses the shared gutter; the main reading wrappers cap at 1200px on desktop when the panel is closed. In the enhanced desktop reading column, About, project descriptions, and Approach use a single-column flow; supplementary gallery images sit beside their captions. Without that enhancement, About and Approach use wider two-column compositions. Little by Little and Signal Desk retain their initially open screenshot disclosures; the other project disclosures remain closed initially.

## Elevation & Depth

Body surfaces stay flat, without shadows or gradients. The header is the user-requested exception: a tonal red gradient separates the navigation from the page. Tonal changes separate reading sections and the context panel. Fine rules divide the panel toolbar, footer, and toolkit groups. The image dialog uses a dimmed backdrop and a paper surface to establish modal depth.

## Shapes

Surfaces, photographs, screenshots, and controls have square corners. The development map uses circular numbered markers connected by thin lines, with branches for data, logic, and connections and a return path for new learning.

## Components

### Controls and filtering

Buttons are flat oxblood rectangles with paper text, a 56px minimum height, 17px × 22px padding, and a 28px label/icon gap. The contact button reverses those colors. Text links and panel/dialog controls have a 44px minimum interaction height. Filters have a 46px minimum height; panel links have a 48px minimum height. Native disclosure summaries have a 62px minimum height and a plus marker that rotates when open.

Filters are hidden until handlers bind. Their counts are derived from project `data-status` values. Selecting a filter updates article visibility, `aria-pressed`, the polite result announcement, and the panel's project-link visibility, then recalculates the current reading section and project. Technology stacks are plain informational lists rather than filled tags.

### Context panel

The five views contain the profile and toolkit (About), practical-software principles (everyday), the current project preview and index (Work), the connected development map (Approach), and conversation links (Contact). The current section is selected against a reading line 28% down the viewport; reaching the document bottom selects Contact so a short footer still receives its own panel. Changing views resets the panel's internal scroll position and updates its accessible labels. If keyboard focus is inside a view being replaced, it moves to Hide panel.

Hide panel expands the reading area; Show side panel restores it. The hidden preference is stored under `portfolio-panel-hidden` in `sessionStorage`, with storage failure treated as optional. Focus moves to the corresponding show/hide control, and a closed panel is inert. The layout code compensates for section movement during reflow; browser verification scope is recorded in `README.md`.

The Work view reads its image, alt text, image-link destination and accessible label, title, status, and caption from the existing article. It decodes the incoming image before replacing the visible one and ignores superseded requests. If decoding fails, it keeps the current image. Its current project link receives `aria-current="true"`.

### Image dialog and accessibility

Ordinary screenshot clicks open a native modal `dialog` with the project title, original image, and provenance caption. Close image, Escape, or a click beginning and ending on the surrounding backdrop closes it. Closing restores background scrolling and focus to the opening image link. The close toolbar stays visible while dialog content scrolls. Modified clicks, unsupported dialog browsers, and no-script use retain direct links to the local image files.

The document retains semantic landmarks, one primary heading, a skip link, descriptive image alternatives, native links and disclosures, and visible 3px focus outlines offset by 5px. Focus uses oxblood on light surfaces and paper on reversed surfaces; the panel follows its current text color. External links retain `noopener noreferrer`. Reading content remains available without JavaScript. Relative asset URLs remain suitable for repository subpaths.

### Motion

The signature movement pairs scrolling text with changing context. Panel views enter with an 18px horizontal slide over 420ms; development-map steps rise 10px over 420ms with 45ms staggering. A new Work image rises 12px over 450ms, with 300ms title/caption fades. Hiding or showing the panel moves the reading area over 380ms; reopening adds a 400ms panel arrival. The panel's Contact color change takes 300ms. These scripted animations use the Web Animations API and superseded animations are canceled.

About's authored heading lines enter over 800ms, with a 90ms offset for the second line. Intersection observation adds one-time content arrivals with a 22px rise over the 650ms settle duration; inline main project figures use an 18px rise and slight scale. The software statement repeats the line-entry treatment when it enters view. Opening disclosures and filtering use 240ms fades. The image dialog arrives over 300ms with a 12px rise and slight scale.

Controls have transform-based feedback: button/filter presses, directional arrow movement, a stage image action lift, and slight gallery image scaling. Fine-pointer hover also provides simple color or underline state changes. Where CSS view timelines are supported, the contact heading grows subtly from 0.96 to full scale as it enters view.

`prefers-reduced-motion` disables CSS animations, transitions, and smooth scrolling. Scripted movement checks the preference before starting; enabling reduced motion cancels active Web Animations. The panel's content changes and native disclosures remain available without motion. No content depends on a reveal animation for visibility.

### Project facts and imagery

Each project combines a real interface image, a short promise, a description, factual highlights, a technology list, and applicable repository/live links. Status is text, not a color-only badge. Little by Little, SheetShift, and Signal Desk are explicitly in development; Coach JM Prime is client work with a live site. SheetShift credits its collaborator. The Coach repository stays private. Signal Desk's images are labeled as local demo concept views with synthetic data, and its public link is labeled as sign-in. Detail disclosures use native `details`/`summary`; their plus marker rotates when open.

Images retain links to their full-size local files, enhanced by the in-page dialog. Main screenshots show a hover/focus affordance; captions explain what each capture represents. No project image is AI-generated or a fictional product interface. The profile photograph comes from Michael's public GitHub profile.

- `assets/images/writing-desk.png`, `story-library.png`, `chapter-context.png`, and `save-history.png` are unmodified images from [Little by Little's public website assets](https://github.com/Maxima01/Little-By-Little/tree/main/public/website). Exact source links and research context are in `PROJECT_RESEARCH.md`.
- `assets/images/sheetshift.png` is a browser capture of the frontend preview built from [SheetShift's public project source](https://github.com/Maxima01/Sheetshift). The on-page caption explicitly states that conversion runs in the native application. This image is not evidence of a browser-based conversion workflow.
- `assets/favicon.svg` is the portfolio's simple vector favicon. Font files are self-hosted; their license accompanies them.
- `assets/images/michael-alaiza.jpg` is the public GitHub profile photograph; its source is recorded in `PROJECT_RESEARCH.md`.
- Tool marks use Simple Icons v14 and Devicon. Source attribution and accompanying licenses are in `assets/icons/`; the monochrome marks supplement visible tool names.

## Do's and Don'ts

- Keep reading text in charcoal, secondary notes in muted ink, and headings/actions in oxblood. Use existing token roles instead of isolated color values.
- Keep real images, provenance captions, project status, and destinations together in their articles; the Work view derives its content from them.
- Preserve the single profile/map nodes, native disclosures, full-image links, dialog focus restoration, reduced motion, and inline fallbacks.
- Keep substantive explanations at body size and maintain the agreed section and project order.
- Do not invent project outcomes, completion claims, credentials, testimonials, or product interfaces. Do not present SheetShift's frontend preview as a browser converter.
- Do not hide required content behind animation or add shadows, decorative cards, or an additional typeface to this system. Keep the requested red gradient confined to the header.


## Header and Osmanthus extension — 13 November 2026

This is a refinement of the incumbent split-stage design: retain Epilogue, oxblood, section order, square controls, project images, and reading interactions. The requested red header and animated eight are intentional exceptions to generic gradient and continuous-motion warnings.

Unslop audit: the old header shared its background with the body; the name and navigation lacked a distinct surface; the project count omitted Osmanthus. No replacement visual world is needed.

Direction: a portfolio for clients and hiring managers; practical, curious, exact; local software and visible working interfaces; richness in the real project images and red header; the tilted red/blue eight is Michael's requested signature.

Spacing and layout use an inner 1500px wrapper, a 116px desktop header and a two-row phone header. Light navigation stays visible at all widths with 44px link targets. Color remains within the existing red family; no gradient text, floating navigation, extra badges, or decorative project cards were added. Copy distinguishes implemented Osmanthus features from later work. Existing typography and the reading layout remain intact.

The figure-eight uses a locally vendored Three.js 0.180.0 renderer with a transparent canvas, small spheres, and tapered trails. The two particles briefly mix to purple near the crossing. Clicking the mark pauses or resumes it; its accessible name reflects that action. Reduced motion renders it still. Animation stops when the header is offscreen or the page is hidden, and handles page-cache restore. The inline SVG is the no-script/WebGL fallback. Blue and purple are confined to this requested mark.

Osmanthus is the fifth project and participates in the existing development filter, panel index, preview, and image dialog. Three real desktop captures show the current behavior, timeline, and inspection views. The article labels the preliminary foundation and synthetic sample, with source/build-status links. Rust, Slint, SQLite, regression testing, and local data workflows are supported toolkit additions.

Unslop workflow credit: Damir Sokolovsky (@heydamir), https://heydamir.design/unslop, CC BY 4.0. No generated image or image prompt was used.

Verification: the final build checked 74 local references and five JavaScript files. Browser checks passed for 1440, 768, 390, and 320px layouts; particle movement, pause/resume, reduced motion, WebGL loss, no-script mode, five-project filtering, Osmanthus panel preview, and image dialog. No browser exceptions or failed resources were observed. The broad taste inspector flagged existing panel dividers, closed-disclosure text heuristics, zero CSS motion with the machine's reduced-motion preference, and the expressly requested gradient. These results are not claimed as a clean global style audit. The newer remote README cleanup is preserved.
