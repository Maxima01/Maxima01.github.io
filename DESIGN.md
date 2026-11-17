---
name: Michael Don Alaiza — Portfolio
description: A split-stage portfolio pairing real project interfaces with a readable account of the work.
colors:
  paper: "#eeeeec"
  ground: "#e2e2e2"
  surface: "#d6d6d6"
  ink: "#271f20"
  muted: "#68575a"
  accent: "#7d0c14"
  on-accent: "#eeeeec"
  header-deep: "#4c0810"
  header-red: "#a52330"
  header-muted: "#f0ced1"
  particle-red: "#ff727e"
  particle-blue: "#70baff"
  particle-purple: "#ce9bff"
  room-ground: "#11100f"
  room-muted: "#c8c3c3"
  room-panel: "#302e2e"
  room-panel-lit: "#514b42"
  room-lever: "#8b8484"
  room-lever-lit: "#eeeeec"
  room-beam: "#e0cfaa"
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
---

# Design System: Michael Don Alaiza — Portfolio

## Overview

The direction is **split-stage**, seed **688487477**. It retains Epilogue, oxblood, and the existing neutral palette, while separating charcoal reading text from oxblood headings and actions. On this page, Michael's real software interfaces become a persistent project stage beside the account of his work.

The context panel follows the section being read: About, the everyday-software statement, Work, Approach, or Contact. Within Work, its image, title, status, caption, and full-image destination follow the current project. Its project links jump to the matching article. Product facts remain in `PRODUCT.md` and `PROJECT_RESEARCH.md`.

This document describes the implementation in `index.html`, `styles.css`, and `script.js`; verification scope is recorded in `README.md`. The pre-existing stale `.impeccable/design.json` sidecar has not been refreshed and may contradict this document; the current source and this document describe the revised system. The incumbent token frontmatter is preserved for this extension.

## Colors

All page colors use the CSS roles above. Paper is the main reading ground; gray ground distinguishes the software statement, tools disclosure, SheetShift, and Signal Desk. Surface is the deeper neutral used for image backgrounds and filter hover. Charcoal ink carries substantive prose. Muted ink is reserved for secondary status, captions, technology lists, and credits. Oxblood carries headings, links, selected controls, the desktop panel, and contact. Reversed content uses on-accent paper. The panel's Contact view switches to gray ground with oxblood text beside the reversed contact section.

The page declares a light color scheme. Project screenshots retain their own interface colors rather than being recolored to match the portfolio.

The entry room uses scoped `room-*` tokens for its near-black ground, switch surfaces, muted copy, and warm light. These stay inside the introduction and do not change the reading palette. On supported mobile browsers, the browser chrome follows the room ground while the intro is open, then returns to the portfolio theme color when it closes. Edge-to-edge viewports keep the intro, header, page gutters, desktop context panel and reopen control, contact footer, and image viewer clear of display cutouts and home indicators.

## Typography

Epilogue is self-hosted through regular, bold, and black TTF files mapped to their static weights 400, 700, and 900. The faces use `font-display: swap`; black is preloaded for the main display heading, and bold for the intro name. The font license remains in `assets/fonts/OFL.txt`.

Five scale tokens cover small text, body, lead, headings, and display. Body text uses 1.65 leading. Headings use tight tracking and balanced wrapping; the About and software headings use authored line spans. Display headings use weight 900. Desktop, tablet, and phone rules adjust display sizes to their available reading width. Statuses are not conveyed by color alone.

## Layout

The full-width static header uses a deep-red-to-oxblood-to-red gradient explicitly requested by the user, with light navigation and a tinted secondary role. A tilted Three.js figure-eight sits beside the wordmark, followed by About, Work, Approach, and contact anchors. Its active section receives `aria-current="location"` from the same reading-position logic as the context panel; the everyday-software statement maps to About. The current link gets a 2px underline that reveals from the left; hover and keyboard focus use the same cue. At 620px and below, the header stacks and its navigation wraps when narrow viewports or enlarged text need more room, keeping every destination visible. There is no mobile menu or sticky header.

At a viewport of at least **1100px wide and 760px tall**, JavaScript enables the two-column composition through `.panel-open` unless the visitor has hidden the panel. This enhancement does not depend on `IntersectionObserver`. The left panel takes 42% and the right reading area 58%. The panel is sticky at the viewport top, uses `100vh` with a `100svh` override and a 620px minimum, and has a fixed toolbar/footer around an independently scrollable content area. Inline main screenshots are hidden only while this desktop panel is open.

On smaller or shorter viewports, without JavaScript, or when the visitor hides the panel, each project's original image remains inline. The profile/toolkit and development map each exist as a single DOM node: JavaScript moves them into the panel when open and returns them to their original native disclosures otherwise. The profile disclosure starts closed; the development map starts open. Without JavaScript, both stay in those inline homes. On a direct section URL, the target is realigned after the initial panel layout change so the reflow does not leave the visitor between sections.

The full-width layout uses image/copy columns until 800px, then stacks them. At 620px and below, the header stacks while keeping navigation visible. At 540px and below, project statuses move below titles, galleries and detail columns become single columns, and the contact button spans the reading width. The phone gutter is 22px.

The reading sequence remains **About → software statement → Work → Approach → Contact**. Project order remains **Little by Little → SheetShift → Coach JM Prime → Signal Desk → Osmanthus**. About places the primary “Explore my work” action next to the light-mode aside.

The common wrapper caps at 1500px and uses the shared gutter; the main reading wrappers cap at 1200px on desktop when the panel is closed. In the enhanced desktop reading column, About, project descriptions, and Approach use a single-column flow; supplementary gallery images sit beside their captions. Without that enhancement, About and Approach use wider two-column compositions. Little by Little and Signal Desk retain their initially open screenshot disclosures; the other project disclosures remain closed initially.

## Elevation & Depth

Body surfaces stay flat, without shadows or gradients. The header is the user-requested exception: a tonal red gradient separates the navigation from the page. Tonal changes separate reading sections and the context panel. Fine rules divide the panel toolbar, footer, and toolkit groups. The image dialog uses a dimmed backdrop and a paper surface to establish modal depth.

## Shapes

Surfaces, photographs, screenshots, and controls have square corners. The development map uses circular numbered markers connected by thin lines, with branches for data, logic, and connections and a return path for new learning.

## Components

### Controls and filtering

Buttons are flat oxblood rectangles with paper text, a 56px minimum height, 17px × 22px padding, and a 28px label/icon gap. The contact button reverses those colors. Text links and panel/dialog controls have a 44px minimum interaction height. Filters have a 46px minimum height; panel links have a 48px minimum height. Native disclosure summaries have a 62px minimum height and a plus marker that rotates when open. Their content uses a short row and opacity transition in both directions while preserving native disclosure behavior.

Filters are hidden until handlers bind. Their counts are derived from project `data-status` values. Selecting a filter updates `aria-pressed`, shows and announces the selected category and result count, and updates the panel's project-link visibility before recalculating the current reading section and project. The public-links filter includes pages and sign-in destinations, not only finished live sites. Departing articles fade out before being hidden; `inert` removes them from keyboard and assistive-technology navigation as the exit starts. Newly available articles ease in with a slight rise. Selected filter colors transition with the reading-stage project index; press feedback stays subtle and consistent. Technology stacks are plain informational lists rather than filled tags.

### Context panel

The five views contain the profile and toolkit (About), practical-software principles (everyday), the current project preview and index (Work), the connected development map (Approach), and conversation links (Contact). The current section is selected against a reading line 28% down the viewport; reaching the document bottom selects Contact so a short footer still receives its own panel. Changing views resets the panel's internal scroll position and updates its accessible labels. If keyboard focus is inside a view being replaced, it moves to Hide panel.

Hide panel expands the reading area; Show side panel restores it. The hidden preference is stored under `portfolio-panel-hidden` in `sessionStorage`, with storage failure treated as optional. Focus moves to the corresponding show/hide control, and a closed panel is inert. If a resize hides the currently focused panel control, focus moves to the main reading area; opening the panel from its reopen control moves focus to Hide panel. The layout code compensates for section movement during reflow; browser verification scope is recorded in `README.md`.

The Work view reads its image, alt text, image-link destination and accessible label, title, status, and caption from the existing article. It decodes the incoming image before replacing the visible one and ignores superseded requests. If decoding fails, it keeps the current image. Its current project link receives `aria-current="location"`. The 1180×820 Osmanthus screenshots keep their native ratio in the article, gallery, and context panel so the complete desktop interface, including its status strip, stays visible. During ratio-changing handoffs, the outgoing screenshot uses a contained fit so it remains complete while the new preview arrives.

### Image dialog and accessibility

Ordinary screenshot clicks open a native modal `dialog` with the project title, original image, and provenance caption. The clicked image appears immediately while the viewer confirms the full image, avoiding a blank opening frame; source dimensions reserve its aspect ratio to prevent a layout jump. A failed image decode replaces the broken image with a recovery message while gallery navigation remains available. While a new gallery image is preparing, the counter shows its loading state and the current image remains in place; assistive technology hears the pending state immediately, then the image or recovery message when ready. Previous and Next buttons, Left and Right Arrow keys, or a horizontal touch swipe cycle through available screenshots with a brief image crossfade. On touch screens, vertical scrolling and pinch zoom remain available. Close image, Escape, or a tap/click beginning and ending on the surrounding backdrop shares a short exit motion. Closing restores background scrolling and focus to the opening image link, a visible equivalent when responsive layout hides it, or the main content as a final fallback. The close toolbar stays visible while dialog content scrolls. Modified clicks, unsupported dialog browsers, and no-script use retain direct links to the local image files.

The document retains semantic landmarks, one primary heading, a skip link, descriptive image alternatives, native links and disclosures, and visible 3px focus outlines offset by 5px on controls and keyboard-scroll regions. The programmatically focused main landmark does not draw a perimeter around the entire reading page. When the single profile or map moves into a hidden panel view during a responsive change, focus returns to the main reading area. Focus uses oxblood on light surfaces and paper on reversed surfaces; the panel follows its current text color. Links opening a new tab announce that behavior to screen readers and retain `noopener noreferrer`. Reading content remains available without JavaScript. Relative asset URLs remain suitable for repository subpaths.

### Motion

The signature movement pairs scrolling text with changing context. Panel views enter with an 18px horizontal slide over 420ms; development-map steps rise 10px over 420ms with 45ms staggering. A new Work image rises 12px over 450ms, with 300ms title/caption fades. Hiding or showing the panel moves the reading area over 380ms; reopening adds a 400ms panel arrival. The panel's Contact color change takes 300ms. These scripted animations use the Web Animations API and superseded animations are canceled.

After the intro closes, About's authored heading lines enter when they reach the viewport, over 800ms with a 90ms offset for the second line. The software statement repeats this line-entry treatment once; project copy and figures stay still as visitors scroll so the case studies remain easy to scan. The approach connector draws once, while panel views, project handoffs, and the image dialog retain motion that explains a state change. Native disclosures open and close through a 240ms grid-row transition and a 180ms opacity fade; project filtering eases new articles in over 220ms and fades departing articles over 160ms. The image dialog arrives over 300ms with a 12px rise and slight scale, then leaves over 210ms through the close button, Escape, or backdrop.

Controls have transform-based feedback: button/filter presses, directional arrow movement, a stage image action lift, and slight gallery image scaling. Fine-pointer hover also provides simple color or underline state changes, while filters, project links, toolbar buttons, and intro links ease between color states. Where CSS view timelines are supported, the contact heading grows subtly from 0.96 to full scale as it enters view.

`prefers-reduced-motion` stops CSS keyframes, travel, scale, and smooth scrolling while retaining brief color and opacity feedback. Scripted movement checks the preference before starting; enabling reduced motion cancels active Web Animations. Scroll reveals disconnect while reduced motion is active and resume only for sections not yet revealed if it is turned off. Forced-colors mode uses system-color focus rings, control borders, and underlines to preserve selected and current states. The panel's content changes and native disclosures remain available without motion. No content depends on a reveal animation for visibility.

### Project facts and imagery

Each project combines a real interface image, a short promise, a description, factual highlights, a technology list, and applicable repository/live links. Status is text, not a color-only badge. Little by Little, SheetShift, and Signal Desk are explicitly in development; Coach JM Prime is client work with a live site. SheetShift credits its collaborator. The Coach repository stays private. Signal Desk's images are labeled as local demo concept views with synthetic data, and its public link is labeled as sign-in. Internal links reveal a project hidden by filtering before navigating to it. Detail disclosures use native `details`/`summary`; their plus marker rotates when open.

Images retain links to their full-size local files, enhanced by the in-page dialog. Main screenshots show a hover/focus affordance on desktop; on narrow or touch layouts, the full-image action sits below each screenshot so it remains discoverable without hover. The About preview links directly to Little by Little, with its project action shown on hover/focus and below the image on touch layouts. Captions explain what each capture represents. Tall full-page captures open in a bounded, keyboard-focusable scroll region with contained scroll chaining; each newly loaded image starts at its top. No project image is AI-generated or a fictional product interface. The profile photograph comes from Michael's public GitHub profile.

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

Spacing and layout use an inner 1500px wrapper, a 116px desktop header and a compact two-row header on narrow viewports. Light navigation stays visible at all widths with 44px link targets. Color remains within the existing red family; no gradient text, floating navigation, extra badges, or decorative project cards were added. Copy distinguishes implemented Osmanthus features from later work. Existing typography and the reading layout remain intact.

The figure-eight uses a locally vendored Three.js 0.180.0 renderer with a transparent canvas, small spheres, and tapered trails. The two particles briefly mix to purple near the crossing. Its module waits until after the intro is dismissed or bypassed and the header is near the viewport, then uses `requestIdleCallback` with a 1.2-second bound, or a short timeout fallback, so deep links avoid loading an offscreen effect and the first reveal keeps priority. Under reduced motion, the inline SVG remains visible without initializing the renderer; pending setup is canceled, module evaluation rechecks the preference before creating WebGL, and turning motion back on after entry schedules it when the header is near view. The first canvas frame and inline SVG crossfade; if WebGL is unavailable or lost, the static SVG remains visible. Clicking the mark pauses or resumes it; its accessible name stays stable, with the pressed state indicating whether it is playing. Animation stops when the header is offscreen or the page is hidden, and handles page-cache restore. Blue and purple are confined to this requested mark.

Osmanthus is the fifth project and participates in the existing development filter, panel index, preview, and image dialog. Three real desktop captures show the current behavior, timeline, and inspection views. The article labels the preliminary foundation and synthetic sample, with source/build-status links. Rust, Slint, SQLite, regression testing, and local data workflows are supported toolkit additions.

Unslop workflow credit: Damir Sokolovsky (@heydamir), https://heydamir.design/unslop, CC BY 4.0. No generated image or image prompt was used.

Verification: the final build checked 74 local references and five JavaScript files. Browser checks passed for 1440, 768, 390, and 320px layouts; particle movement, pause/resume, reduced motion, WebGL loss, no-script mode, five-project filtering, Osmanthus panel preview, and image dialog. No browser exceptions or failed resources were observed. The broad taste inspector flagged existing panel dividers, closed-disclosure text heuristics, zero CSS motion with the machine's reduced-motion preference, and the expressly requested gradient. These results are not claimed as a clean global style audit. The newer remote README cleanup is preserved.

## Entry and case-study refinement — 16 November 2026

The first visit in a browser tab opens on a dark room scene with a quiet field of drifting Three.js dust when motion is allowed. The atmosphere caps its full-screen rendering at 30 frames per second to keep the ambient movement light on GPU work. The two local Three.js module files total about 720 KB. The intro effect import waits for browser idle time, with a 600ms maximum and a 120ms timeout fallback, to prioritize the initial render; a pending request is canceled if the visitor skips or turns on reduced motion before it starts. The header mark lazily loads the same modules later when motion is allowed, so this defers the shared work rather than removing it from motion-enabled visits. The atmosphere loads only while the intro is shown and motion is allowed, so direct section links, repeat visits, and reduced-motion sessions skip its setup. Once the intro closes, its renderer, geometry, and materials are disposed so the reading experience no longer retains the scene's GPU resources. If reduced motion changes while an import is pending, module entry points recheck the preference before creating WebGL; turning motion off while the intro is open cancels a pending idle request, while turning it on later schedules the atmosphere then. The header mark also keeps its inline SVG and skips Three.js setup under reduced motion, then loads if motion is turned back on after entry. The accessible switch first lights the room and reveals Michael's name and existing introduction in a short stagger; its next press dims the light, then fades into the portfolio. Each switch press plays a short, quietly synthesized mechanical click directly from the light switch action. The click uses a brief filtered-noise transient, starts only in response to the visitor's switch press, and is skipped silently if Web Audio is unavailable. The portrait uses a warm, flat frame instead of a colored halo. The Skip intro button shows an Esc key cue and exposes Escape as its keyboard shortcut; direct section links bypass the intro, and a session marker prevents it from repeating after entry. If JavaScript is unavailable, the intro stays hidden and the portfolio remains readable.

The full-screen intro is announced as a modal dialog with a short instruction; Tab stays among its available controls until the visitor enters or skips.

At short mobile heights, the intro switches to a compact side-by-side layout so the name, light switch, and skip action stay visible without competing for the same space. Below 371px wide, the portrait yields to a single-column name and introduction so the short-height controls do not force the name to wrap awkwardly.

The intro also compacts on short landscape displays. Its controls stay anchored inside the viewport, and narrower landscape widths reserve a separate column for the controls to keep them clear of the introduction.

Unrelated wandering cat drawings have been removed so the real project images and writing carry the visual interest. The switch sound belongs to the intro and its audio context closes after the visitor enters the portfolio.

Native profile, project, and approach disclosures now ease their content open and closed through a short grid-row and opacity transition. Their native `<details>` controls remain usable without JavaScript.

The About heading now states the work directly, and the real Little by Little writing desk appears in the opening section for phone visitors. The five case studies carry compact role, decision, and evidence notes drawn from the existing project record. The repeated process list is replaced by an Osmanthus example about stable process identities and evidence links.

The desktop split is 42/58 and the fixed panel uses the existing neutral ground; its content scrolls independently without pulling the reading page along. The requested red header, contact field, and figure-eight remain. Switching project previews crossfades the real screenshot and its title, status, and caption with a short vertical movement. The approach connector draws once before a single staggered entrance for its steps. Both interactions honor reduced motion. The image viewer fits landscape screenshots to the viewport and gives tall full-page captures a bounded, keyboard-focusable scroll region.

No new contact details or résumé file were present in the project, so contact continues to use the existing LinkedIn, GitHub, and Discord destinations. No new images or invented outcome claims were added.

## Case-study scannability — 16 November 2026

Removed the repeated role, decision, and evidence rows from each project. Those facts remain in the introductions, highlights, screenshot captions, credits, and existing build disclosures; this shortens the reading path and removes the repeated template from the work section.

## CSS capability fallbacks — 16 November 2026

Added `vh` fallbacks before `svh` for the intro layout, compact controls, sticky panel, and image viewer so older browsers retain their viewport sizing while current mobile browsers keep the safer small-viewport behavior. Added solid-color fallbacks before `color-mix()` for the toolbar hover, development-map branch, and image-dialog backdrop.

## Motion rendering budget — 16 November 2026

The header's figure-eight mark now caps rendering at 30 frames per second, matching the intro atmosphere's budget and avoiding full-refresh-rate WebGL work for a small decorative control. Both effects allow half a millisecond of frame-timestamp tolerance so rounding on a 30 Hz display does not drop alternate frames.

## Typography loading — 16 November 2026

Preload Epilogue's regular weight alongside bold and black because it styles the intro controls and body text from the first render, reducing the fallback-font swap on initial display.

## Intro sound timing — 16 November 2026

Schedule the synthesized switch click after a suspended audio context resumes. A pending click is discarded if the intro is skipped before audio becomes available; the click tied to the second switch press may finish during the transition.

## Intro switch sound — 16 November 2026

Remove the separate sound control and play a quiet, filtered-noise mechanical click directly from each light-switch press. If Web Audio is unavailable, the switch still works silently.

## Preview image fallback — 16 November 2026

If a project preview fails to decode, keep the project title and details in sync, replace the broken image with a clear status, and link to the matching case study. Mark the preview figure busy while an image is preparing, show a brief loading layer over the current image, and clear the state if its project is filtered away. If the failed preview held keyboard focus, move focus to its case-study recovery link.

## Back-to-top focus — 16 November 2026

Make the header programmatically focusable so the footer's Back to top link returns both scroll position and keyboard context to the start of the page, matching the existing skip-link behavior. A compact focus ring on the wordmark makes that return visible without outlining the full header.

## Intro copy — 16 November 2026

Give the light-switch intro its own focus line about how Michael approaches a problem, keeping it distinct from the main portfolio headline while preserving the same accessible text for screen readers.
