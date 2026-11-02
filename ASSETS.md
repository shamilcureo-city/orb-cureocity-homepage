# Asset provenance

The current preview follows the supplied Website Design page in [Client App V3](https://www.figma.com/design/AwydaKZ3UdxjHtLi1rrhBX/Client-App-V3?node-id=6031-51867). The desktop source is **Home Page**, node `6621:58204`, on page `6031:51867`. The owner's annotated screenshots dated 30 October 2026 and editor-feedback PDF supplied on 2 November 2026 request restoration of original app artwork rather than recreated screen contents.

`build.mjs` copies only media referenced by the assembled HTML and CSS into `dist/assets`. Its output reports the actual packaged count. Source inventory totals are not a reliable runtime count, because unused comparison derivatives can remain outside `dist`. Full Figma exports, local review screenshots and the raw identifiable laboratory report are not deployment assets.

## Original app artwork

These files in `assets/original/` come from the owner's `Website Graphics 2.zip` bundle or direct exports of the approved Figma artwork. Bundle originals are copied byte-for-byte; direct exports are identified below. Their natural proportions are retained in the page.

| Display | Original filename | Native dimensions |
| --- | --- | --- |
| Daily insights, expanded state | `daily-insight-phone.png` | 364 × 587 |
| Food and nutrition | `Frame 2147228749 1.png` | 345 × 566 |
| Training | `Group 2085666069 1.png` | 376 × 566 |
| Cycle and journal | `Cycle Tracker 1.png` | 373 × 566 |
| Biological age | `bioage 1.png` | 366 × 566 |
| Care and assessment | `Frame 2147228989.png` | 481 × 566 |
| Free-card Health Vault crop | `Group 2085666068 1.png` | 366 × 566 |
| Complete Health Vault hero | `health-vault-complete.png` | 403 × 823 |
| Health Vault review tab | `health-vault-review.png` | 377 × 483 |
| Introductory Pro conversation | `intro-pro-phone.png` | 390 × 794 |

The original screens are identified as illustrative designs in their accessible image descriptions and surrounding product context. Captions beneath phone artwork are removed where requested by the annotated editor feedback. Their embedded example dates, values, scores and statements are retained for the requested visual fidelity; they are not evidence of clinical validity, release status or commercial entitlement.

## Original icons and motion

The ten Pro feature icons use original exports from the same Figma Home Page (`6621:58204`, page `6031:51867`). Their actual local filenames are referenced in `parts/features.html`; retain the exported geometry rather than replacing them with generic symbols. The four hero-strip symbols are direct original SVG exports at `assets/original/icons/trust-doctor.svg`, `trust-heart.svg`, `trust-family.svg` and `trust-check.svg`; `parts/hero.html` uses them instead of the former generic line icons.

The Health Vault backdrop uses the supplied `assets/supplied/health-documents-transparent.webm`, 1920 × 1080, with the existing extracted `assets/optimized/health-documents-poster.webp` as its static state. This is the original animation of generic health documents. It follows the site's viewport-aware muted playback and reduced-motion behavior.

The voice-section lifestyle footage is the exact video downloaded from Figma node `6655:1467`, retained at `assets/supplied/voice-figma-6655-1467.mp4`. Its SHA-256 is `6f48dc75b4eb219cb0f7d004ad2262ab101f2203c36706a1d57e4a0106f1933e`. The poster is `assets/optimized/voice-reference-poster.webp`.

Other supplied videos, professional/member portraits, original brand marks and approved optimized derivatives retain their existing call sites. Names, endorsements, professional roles or service availability must not be inferred from imagery alone.

## Permanently redacted original report

`assets/original/health-report-redacted.png` is a new 633 × 565 raster derived deterministically from the supplied report using Swift/CoreGraphics. It retains the original card silhouette, laboratory branding, table layout and report values. It is a redacted source sample, not a newly fabricated clinical record.

The derivative permanently removes the patient name, demographic and patient-ID fields, sample-location and collection/registration details, QR code, barcode, laboratory contact numbers, email/address and the bottom interpretation. The removed pixels are replaced with white, with restrained “Redacted sample” wording in the patient strip. Redaction is baked into the PNG; no original data is hidden behind CSS, SVG layers or browser overlays. The output was written as a fresh raster without source metadata and visually inspected.

The raw report is excluded from the repository and served assets. The derivative retains the baked-in “Redacted sample” text and an accessible image description identifying it as a redacted sample. The separate caption underneath is removed to match the editor feedback; its original proportions are preserved.

Public access to this repository does not grant rights to reuse Cureocity branding or supplied imagery.

## Editor-feedback asset update — 2 November 2026

The owner supplied `Orb_Website_Annotated_Editor_Feedback.pdf`, containing thirteen numbered corrections across eight annotated screenshot pages. The complete Health Vault hero handset was exported directly from Figma node `6655:1445` in the same approved homepage. `assets/original/health-vault-complete.png` is 403 × 823 pixels and includes the device's complete bottom edge. It replaces the previously cropped bundle image in the hero only; the cropped original remains appropriate in the introductory Free card.

`assets/original/intro-pro-phone.png` is the original 390 × 794 conversation handset, reused from the earlier standalone Figma export. The Free and Pro introduction cards now use original image assets instead of recreated HTML phones.

The doctor-led feature uses the existing upright `assets/optimized/vijesh-portrait.webp` at its natural 1733 × 2600 proportion, without a CSS cover crop. The permanently redacted report remains the only report sample served.

The expanded daily-insights handset is now the exact 364 × 587 original export `assets/original/daily-insight-phone.png`, from Figma node `6680:1738`. It replaces the previously used daily-dashboard state; the other five carousel screens retain their matching supplied originals. All six artwork captions have been removed as requested and the images meet their card bottoms.

The “For your review” state now uses `assets/original/health-vault-review.png`, 377 × 483 pixels, matching the original `Group 2085666068 3` variant. The four hero-strip SVG exports, expanded daily-insights screen, complete Vault handset and Vault review state are all wired into the source. No exact-asset export remains pending for the thirteen requested corrections. Browser verification and publication are recorded separately in `HANDOFF.md`.
