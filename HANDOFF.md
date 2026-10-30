# Orb annotated correction release

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
- The professionals section's Next arrow is removed. Additional professional profiles still require supplied names, roles and approved portraits; no identities are invented.

The existing compact typography, cards and footer remain. Layout sizing is CSS-based rather than browser zoom or whole-page scaling.

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
5. Approved details/assets for additional professionals, and final member-photo usage approval.

Missing destinations open specific preview information panels. They do not falsely claim account creation, payment, assessment completion or booking. `mode: design-preview` remains; `ORB_PUBLIC_BUILD=1` is a commercial-release guard, not the visitor-sharing setting. Actual public preview access is controlled by Sites, with `audience` in the content configuration descriptive only.

## Verification and publication

The integrated `npm run build`, `npm run check` and whitespace checks passed. All 71 local runtime files (including 60 displayed assets) returned HTTP 200/206. Browser checks at 360, 390, 768, 900, 901, 1024, 1440 and 1728 px found no page overflow. Tablet arrow bounds were corrected and rechecked. The hero measured one viewport, only the navigation capsule stayed fixed, and the original Health Vault animation played muted without controls. All six original feature images and ten icon exports loaded. Feature and report tabs passed keyboard checks; the mobile menu closed with Escape and restored visible focus across the desktop breakpoint. The global motion control stopped all videos.

A typed workout phrase parsed and reviewed correctly without an account-save claim. Simulated speech lifecycle and parser regression checks passed, including the cumulative 60-second limit, denial, timeout, late callbacks, page hiding and manual fallback. No live microphone or external speech-provider session was run. Representative screenshots are retained outside the publishing checkout under `orb-homepage/evidence/annotations/`. Existing earlier screenshots predate these corrections.

Only referenced deployment media is copied into `dist/assets`; use build output for the current count. Local review screenshots, full Figma exports, raw unused graphics and the identifiable source report remain excluded. Keep GitHub source, Sites source commit and deployed archive aligned, and confirm the returned live URL and public access after deployment.
