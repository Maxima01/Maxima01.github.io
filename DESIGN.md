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

## Direction

The direction is **split-stage**, seed **688487477**. It retains Epilogue, oxblood, and the existing neutral palette, while separating charcoal reading text from oxblood headings and actions. On this page, Michael's real software interfaces become a persistent project stage beside the account of his work.

The primary interaction is the project stage: its image, title, status, caption, and full-image destination change as the corresponding project enters the reading area. Its project links also jump directly to the matching article. Product facts remain in `PRODUCT.md` and `PROJECT_RESEARCH.md`.

This document describes the implementation in `index.html`, `styles.css`, and `script.js`. It is source-based documentation, not a visual or runtime validation report. The user requested no testing for this revision. The pre-existing stale `.impeccable/design.json` sidecar has not been refreshed and may contradict this document; the current source and this document describe the revised system.

## Color and typography

All page colors use the CSS roles above. Paper is the main reading ground; gray ground distinguishes the software statement, tools disclosure, SheetShift, and Signal Desk. Surface is the deeper neutral used for image backgrounds and filter hover. Charcoal ink carries substantive prose. Muted ink is reserved for secondary status, captions, technology lists, and credits. Oxblood carries headings, links, selected controls, the desktop stage, and contact. Reversed content uses on-accent paper.

The page declares a light color scheme. Surfaces stay flat, with square corners and no shadows or gradients. Project screenshots retain their own interface colors rather than being recolored to match the portfolio.

Epilogue is self-hosted through regular, bold, and black TTF files. The declarations map these to weights 400, 500–700, and 800–900, use `font-display: swap`, and preload black. The font license remains in `assets/fonts/OFL.txt`.

Five scale tokens cover small text, body, lead, headings, and display. Body text uses 1.65 leading. Headings use tight tracking and balanced wrapping; the About and software headings use authored line spans. Display headings use weight 900. Desktop, tablet, and phone rules adjust display sizes to their available reading width. Statuses are not conveyed by color alone.

## Composition and responsive behavior

The static header contains the wordmark and About, Work, Approach, and contact anchors. Its active section receives `aria-current="location"` through intersection observation. There is no mobile menu or sticky header.

At a viewport of at least **1100px wide and 760px tall**, JavaScript and `IntersectionObserver` enable the two-column composition through `.has-preview`. The left stage takes 47% and the right reading area 53%. The stage is sticky at the viewport top, uses `100svh` height with a 620px minimum, and contains the project title/status, an 8:5 screenshot with a direct full-image link, its provenance caption, and a two-column project index. Inline main screenshots are hidden only in this enhanced desktop composition.

On smaller or shorter viewports, and without the script or observer enhancement, the stage stays hidden and each project's original image remains inline. The full-width layout uses image/copy columns until 800px, then stacks them. At 540px and below, the header stacks, navigation remains visible, project statuses move below titles, galleries and detail columns become single columns, and the contact button spans the reading width. The phone gutter is 22px.

The reading sequence remains **About → software statement → Work → Approach → Contact**. Project order remains **Little by Little → SheetShift → Coach JM Prime → Signal Desk**. About now places the primary “Explore my work” action next to the light-mode aside and keeps the full tools and capabilities list in a native, initially closed disclosure.

The common wrapper caps at 1500px and uses the shared gutter. In the enhanced desktop reading column, About, project descriptions, and Approach use a single-column flow; supplementary gallery images sit beside their captions. Without that enhancement, About and Approach use wider two-column compositions. Little by Little and Signal Desk retain their initially open screenshot disclosures; the other project disclosures remain closed initially.

## Components and state

Buttons are flat oxblood rectangles with paper text, a 56px minimum height, 17px × 22px padding, and a 28px label/icon gap. The contact button reverses those colors. Text links have a 44px minimum interaction height. Filters have a 46px minimum height; stage links have a 48px minimum height. Native disclosure summaries have a 62px minimum height and a plus marker that rotates when open.

Filters are hidden until handlers bind. Their counts are derived from project `data-status` values. Selecting a filter updates article visibility, `aria-pressed`, the polite result announcement, and the project stage's link visibility. If filtering hides the currently previewed project, the script requests the first remaining project. Technology stacks are plain informational lists rather than filled tags.

The stage reads its image, alt text, image-link destination and accessible label, title, status, and caption from the existing article. It decodes the incoming image before replacing the visible one and ignores superseded requests. If decoding fails, it keeps the current image. The stage's current project link receives `aria-current="true"`.

The document retains semantic landmarks, one primary heading, a skip link, descriptive image alternatives, native links and disclosures, and visible 3px focus outlines offset by 5px. Focus uses oxblood on light surfaces and paper on the reversed stage/contact surfaces. External links retain `noopener noreferrer`. Required reading content remains visible by default; JavaScript enhances navigation and filtering. Relative asset URLs remain suitable for repository subpaths.

## Motion

The signature movement pairs scrolling project text with a changing image in the pinned stage. A new stage image arrives with a 14px rise and a slight scale over 700ms; the title and caption use separate shorter arrivals. The initial stage image settles over 850ms. These animations use the Web Animations API and are canceled when a new project replaces them.

About's authored heading lines enter over 800ms, with a 90ms offset for the second line. Intersection observation adds one-time content arrivals with a 22px rise and 0/70/140ms staggering. Project and gallery figures use a separate image-settle animation. The software statement repeats the line-entry treatment when it enters view. Opening native disclosures introduces their content over 280ms. Filtering gives the first visible project heading a short arrival.

Controls have transform-based feedback: button/filter presses, directional arrow movement, a stage image action lift, and slight gallery image scaling. Fine-pointer hover also provides simple color or underline state changes. Where CSS view timelines are supported, the contact heading grows subtly from 0.96 to full scale as it enters view.

`prefers-reduced-motion` disables CSS animations, transitions, smooth scrolling, and interactive transform travel. Scripted movement checks the preference before starting; an enabled reduced-motion preference cancels active Web Animations. The stage's content changes and native disclosures remain available without motion. No content depends on a reveal animation for visibility.

## Project facts and imagery

Each project combines a real interface image, a short promise, a description, factual highlights, a technology list, and applicable repository/live links. Status is text, not a color-only badge. Little by Little, SheetShift, and Signal Desk are explicitly in development; Coach JM Prime is client work with a live site. SheetShift credits its collaborator. The Coach repository stays private. Signal Desk's images are labeled as local demo concept views with synthetic data, and its public link is labeled as sign-in. Detail disclosures use native `details`/`summary`; their plus marker rotates when open.

Images link directly to their full-size local files. Main screenshots show a hover/focus affordance; captions explain what each capture represents. No project image is AI-generated or a fictional product interface. This revision reuses the existing project assets and adds no stock or generated imagery.

- `assets/images/writing-desk.png`, `story-library.png`, `chapter-context.png`, and `save-history.png` are unmodified images from [Little by Little's public website assets](https://github.com/Maxima01/Little-By-Little/tree/main/public/website). Exact source links and research context are in `PROJECT_RESEARCH.md`.
- `assets/images/sheetshift.png` is a browser capture of the frontend preview built from [SheetShift's public project source](https://github.com/Maxima01/Sheetshift). The on-page caption explicitly states that conversion runs in the native application. This image is not evidence of a browser-based conversion workflow.
- `assets/favicon.svg` is the portfolio's simple vector favicon. Font files are self-hosted; their license accompanies them.

## Maintenance rules

- Keep reading text in charcoal, secondary notes in muted ink, and headings/actions in oxblood. Use existing token roles instead of isolated color values.
- Keep real images, provenance captions, project status, and destinations together in their articles; the stage derives its content from them.
- Preserve native disclosures, full-image links, keyboard focus, reduced motion, and inline-image fallbacks.
- Keep substantive explanations at body size and maintain the agreed section and project order.
- Do not invent project outcomes, completion claims, credentials, testimonials, or product interfaces. Do not present SheetShift's frontend preview as a browser converter.
- Do not hide required content behind animation or add shadows, gradients, decorative cards, or an additional typeface to this system.
