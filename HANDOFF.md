# Orb annotated correction release

## Action and voice cleanup — 4 November 2026

Six audit fixes are implemented:

1. The former “Ask Orb anything” care misroute now opens its own clearly scripted Orb conversation, with a separate `orbUrl` configuration for future app access.
2. Each doctor’s “Learn more” opens that doctor’s approved name, role and portrait. Care exploration remains a separate action; no biography, qualification or consultation availability was invented.
3. Fitness copy accurately describes the optional browser speech-recognition trial and typed fallback, with page-local review only.
4. Ambiguous workout words (multiple exercises, competing quantities or spoken corrections) leave no misleading review draft. The transcript remains editable; normal single-exercise conjunctions and supported spoken numbers still work.
5. Health Vault and feature panels show relevant illustrative screens or explanations. Personal-record and plan CTAs now describe an example. If a feature app URL is later configured, the example remains local and a separate “Open in Orb” link appears. Missing app access is explicitly stated.
6. The ten illustrated capability tiles and five Pro summary items reference a shared catalogue. The unused `enquiryUrl` was removed. Validation separates action wiring from destination availability and allows a genuinely approved future configuration to pass the release guard.

`npm run build`, `npm run check`, configuration/release-gate regression tests, voice parser and simulated-recognition tests, and `git diff --check` pass. Build output contains 67 displayed assets. Local headless Chrome checked all 24 action types, 23 tab states and six viewport sizes (360 × 800, 390 × 844, 768 × 1024, 1024 × 768, 1512 × 982 and 1728 × 1117). No page/dialog horizontal overflow or JavaScript errors were found. Original preview images load, both doctor profiles identify the correct person, dialog focus wraps and returns, Escape/mobile navigation work, and reduced-motion videos remain paused. Typed voice input, rejection of both audited ambiguous phrases, and recovery after correction pass in-browser. Representative desktop/mobile screenshots and browser results are retained outside the published checkout in `orb-homepage/evidence/functional-cleanup/`.

No live microphone/provider session, account access, payment or booking was tested. Twenty-three required destinations remain unconfigured. Commercial release also requires the existing feature, entitlement, tax and integration approvals. The shared catalogue does not establish paid inclusions. This remains a publicly shareable design preview; publishing and GitHub synchronization are verified separately in the release response.

## MacBook responsive pass — 3 November 2026

The owner reported that the 16:9 monitor composition looked correct but the 16-inch MacBook layout did not. At desktop widths on taller displays, the hero now keeps its wide-screen framing instead of stretching its video to the entire viewport height. Its height can still grow to accommodate copy. The existing 16:9 monitor layout and original assets are preserved.

Feature cards use content-driven grid tracks at 601–1100px so copy and original phone artwork remain separate, with a safe minimum illustration area on mobile. At 601–900px, care choices become horizontal rows, the two approved doctors stack, and Pro/starting-point content has a readable column width. These replace conflicting rules that forced three care cards into a narrow window.

`npm run build`, `npm run check`, simulated voice lifecycle checks and `git diff --check` pass. With the owner's approval, local headless Chrome at device scale factor 2 checked 21 viewport combinations from 360px to 1920px, including 1440 × 810, 1440 × 900, 1512 × 982, 1536 × 960, 1728 × 1019 and 1728 × 1117. No horizontal page overflow, overlapping feature copy/artwork, clipped card actions or header collisions were found. Six feature tabs and their original images, arrow-key tab navigation, download dialog, Escape/focus return, responsive menu closure and reduced-motion video pause passed. Screenshots were visually reviewed and retained outside the checkout in `orb-homepage/evidence/macbook-responsive/`.

This is viewport emulation in Chrome, not a physical MacBook or Safari test. The existing public Sites project and sharing audience are retained; publication is confirmed separately by the deployment result.

## Current editor-feedback pass — 2 November 2026

The supplied `Orb_Website_Annotated_Editor_Feedback.pdf` requests thirteen changes. This pass restores source artwork and uncropped media in the marked areas while preserving the established hero, approved ₹7,999 annual preview price, integrations and action behavior. The prior compact-layout measurements below are historical and must not be reported as measurements of this new pass.

| Item | Requested correction | Current implementation checkpoint |
| --- | --- | --- |
| 1 | Original hero-strip icons and alignment | Four original Figma SVG exports installed; alignment, padding and text baselines updated. |
| 2 | Original Free and Pro phone artwork | Original image assets replace recreated HTML phones in both introductory cards. |
| 3 | Full diet and fitness videos | Matching natural 3:4 media areas replace clipped fixed-height rendering and preserve both complete videos. |
| 4 | Connected-health height and numbered controls | Height and numbered-control alignment, gaps and copy spacing restored. |
| 5 | Actual carousel screens, no captions, bottom alignment | Exact expanded daily-insights handset exported from node `6680:1738`; other five matching originals retained. Captions removed and all artwork bottom-aligned. |
| 6 | Uncropped doctor-led panel | Natural portrait aspect ratio, larger media and centered copy alignment implemented. |
| 7 | Complete Health Vault hero phone | Full 403 × 823 original exported from Figma node `6655:1445`; content-driven stage prevents crop. |
| 8 | Report sizing and original review state | Redacted report fills its panel without a separate caption. Review tab uses the original 377 × 483 `Group 2085666068 3` variant. |
| 9 | Voice first, review after transcription | Review form hidden initially and revealed after captured transcription or intentional typed-entry parsing. |
| 10 | Two static doctor profiles | Two-profile layout implemented without doctor pause or carousel controls. |
| 11 | Three support-card graphics fill their area | All three graphics widened and aligned to their card bottoms. |
| 12 | Center fitness phone in second food/movement card | Second-card fitness handset centered within its card. |
| 13 | Final CTA phone framing | Original phone aligned within its own layout column with intended framing. |

All thirteen requested implementation changes and the required original-asset replacements are present in source. This is an implementation record, not a deployment claim.

### Verification and publication for this pass

The integrated build packages 67 displayed assets. `npm run check`, `node tests/voice-trial.test.mjs` and `git diff --check` pass. Browser geometry checks at 360, 390, 600, 601, 758, 768, 900, 901, 1024, 1440 and 1728 px found no horizontal page overflow. Both free-offer videos retain their native 3:4 ratio with contain fitting. Desktop, tablet and mobile visual inspections cover the original intro/carousel artwork, complete Vault phone and both tab states, static doctors, support graphics, fitness centering and final banner.

All six feature tabs load their original images with no phone captions. Vault arrow-key navigation exposes the matching panel with a visible focus outline. Mobile navigation closes with Escape and restores focus. Global motion pause stops every video; visible videos play muted without player controls. The voice review form starts hidden, deliberate typed input parses Bench press / 40 kg / 10 reps / 1 set correctly, and review reports only a page-local result. Simulated speech lifecycle tests pass; no real microphone or external speech-provider session was run. OS reduced-motion emulation was not changed; the existing CSS and JavaScript preference handling is retained.

Representative screenshots are stored outside the publishing checkout in `orb-homepage/evidence/editor-feedback/`. The same public Sites project is retained. The deployment result and source SHA are recorded in the release response; this document does not pre-claim publication. Original embedded Figma sample text is retained for requested design fidelity and remains illustrative; commercial destinations and entitlement confirmations described below remain open.

## Previous release record

Updated 30 October 2026. This release applies the owner's nine annotated screenshots to the existing Orb preview. It preserves the same Sites project and public sharing audience; deployment status must be verified from the Sites deployment result.

## Design reference and assets

The authoritative source is the supplied Website Design page, node `6031:51867`, in Client App V3. Its updated desktop **Home Page** is node `6621:58204`. Figma connector access required edit permission and was unavailable; visible Figma inspection, original exports and the supplied graphics bundle are the sources for this implementation. No matching updated mobile frame was established; mobile behavior adapts the desktop composition.

The six feature-carousel visuals and Health Vault handset now use original supplied app images rather than recreated UI. Original Pro feature icons are exported from the same Figma frame. Health Vault includes the original transparent document animation. `ASSETS.md` documents provenance and the permanently raster-redacted report, which replaces the generated table while preserving the original report layout. The raw identifiable report is excluded.

Original screen content is retained at the owner's explicit request and labelled illustrative. Embedded example scores, values and dates do not prove clinical validity, release status or plan eligibility. The separate CGM demonstration continues to use one coherent synthetic dataset: 26 October 2026, 06:00–18:00, mg/dL values 92, 96, 108, 118, 112, 101, 97; average 103.4, minimum 92, maximum 118, with no clinical threshold bands.

## Layout corrections

- Hero fills the viewport, with content-safe mobile sizing.
- Header playback control is removed. The brand and Get Orb action scroll with the page; only the navigation capsule remains fixed. Mobile navigation retains keyboard/focus handling.
- Trust points beneath the hero use a more restrained treatment.
- Pro eyebrow is centered with the headline and price block.
- Dr. Vijesh Vijayan's portrait is reframed to show his complete head. The original Figma quote is restored in italic double quotation marks, with the owner-requested “(Medical Director)” title.
- Blueprint previous/next arrows sit at the sides of the media area.
- The professionals section's Next arrow is removed. The owner confirmed the complete lineup on 30 October 2026: Dr Lubna Ali and Dr Vijesh Vijayan only. No additional professional profiles or portraits are required.

The existing compact typography, cards and footer remain. Layout sizing is CSS-based rather than browser zoom or whole-page scaling.

## Smaller sections below the hero

The owner requested a more compact scale below the hero. The full-viewport hero and floating navigation stay at their established size. Body sections now use smaller headings, shorter cards and media, tighter section spacing and a 1040px content limit. At 700–900px, care choices and member portraits share a row, while pricing and starting-point cards use two columns. Main body copy remains 16–17px, with controls at least 44px high.

At the current 758px-wide preview, the page decreased from 19,973px to 14,909px (about 25%). The free-offer section decreased from 1262px to 939px. Browser checks at 360, 390, 600, 601, 640, 641, 699, 700, 758, 900, 901, 1024, 1440 and 1728px found no horizontal page overflow. The hero remained one viewport tall. Build and content/asset checks passed.

## Real voice trial

The old simulated voice block is removed. `parts/voice.html`, `voice.js` and `voice.css` provide an actual browser-managed speech-recognition trial with an intentional Start action, microphone permission, a visible countdown and up to 60 seconds of cumulative listening during one page visit. Start/stop attempts share the same remaining-time budget.

The transcript and parsed exercise, weight, repetitions and sets can be reviewed and edited. A reviewed entry remains on this page; it is not saved to an Orb account. Orb does not upload or persist audio. The browser may send audio to its speech provider, which the interface explains before starting. Unsupported browsers provide typed entry and an honest availability message. Denial, unavailable microphone, recognition errors, time expiry and page hiding have explicit handling.

This limited website trial is separate from paid app entitlements. Parser/state checks do not establish real microphone recognition quality. Genuine microphone testing, browser/provider compatibility and physical-device testing must be reported separately from build and UI checks.

## Motion and accessibility

Ambient videos play muted and inline while in view, and pause offscreen, in hidden panels, behind dialogs, when the page hides or motion is paused/reduced. Carousels rotate only when visible and appropriate, with progress indicators and labelled controls; interaction pauses rotation. Original Health Vault animation participates in the same system. The footer global motion control remains available after removal of the header playback control.

Section and slide entrances use restrained opacity and small translations. Keyboard navigation, visible focus, inactive-slide isolation, dialog focus return and reduced-motion behavior remain required. Microphone access never starts from scrolling or autoplay.

## Commercial and destination confirmations

The user-approved price remains **₹7,999/year**, equivalent to **₹666.58/month, billed annually**. No monthly payment option is advertised. One shared configuration controls displayed pricing.

Still pending for a commercial release:

1. Verified app-store destinations and free diet/fitness entry URLs and account requirements.
2. Free/Pro entitlements, final tax/billing terms, supported devices/CGM inputs and available markets.
3. Care, Blueprint and hub service/package details and booking destinations.
4. Approved privacy, terms, data-request, help, contact and professional destinations; released sharing controls.
5. Final member-photo usage approval. The two-professional lineup is confirmed.

Missing destinations open specific preview information panels. They do not falsely claim account creation, payment, assessment completion or booking. `mode: design-preview` remains; `ORB_PUBLIC_BUILD=1` is a commercial-release guard, not the visitor-sharing setting. Actual public preview access is controlled by Sites, with `audience` in the content configuration descriptive only.

## Verification and publication

The integrated `npm run build`, `npm run check` and whitespace checks passed. All 71 local runtime files (including 60 displayed assets) returned HTTP 200/206. Browser checks at 360, 390, 768, 900, 901, 1024, 1440 and 1728 px found no page overflow. Tablet arrow bounds were corrected and rechecked. The hero measured one viewport, only the navigation capsule stayed fixed, and the original Health Vault animation played muted without controls. All six original feature images and ten icon exports loaded. Feature and report tabs passed keyboard checks; the mobile menu closed with Escape and restored visible focus across the desktop breakpoint. The global motion control stopped all videos.

A typed workout phrase parsed and reviewed correctly without an account-save claim. Simulated speech lifecycle and parser regression checks passed, including the cumulative 60-second limit, denial, timeout, late callbacks, page hiding and manual fallback. No live microphone or external speech-provider session was run. Representative screenshots are retained outside the publishing checkout under `orb-homepage/evidence/annotations/`. Existing earlier screenshots predate these corrections.

Only referenced deployment media is copied into `dist/assets`; use build output for the current count. Local review screenshots, full Figma exports, raw unused graphics and the identifiable source report remain excluded. Keep GitHub source, Sites source commit and deployed archive aligned, and confirm the returned live URL and public access after deployment.
