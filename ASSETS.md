# Asset provenance

The current preview follows the supplied Website Design page in [Client App V3](https://www.figma.com/design/AwydaKZ3UdxjHtLi1rrhBX/Client-App-V3?node-id=6031-51867). The desktop source is **Home Page**, node `6621:58204`, on page `6031:51867`. The owner's annotated screenshots dated 30 October 2026 request restoration of original app artwork rather than recreated screen contents.

`build.mjs` copies only media referenced by the assembled HTML and CSS into `dist/assets`. Its output reports the actual packaged count. Source inventory totals are not a reliable runtime count, because unused comparison derivatives can remain outside `dist`. Full Figma exports, local review screenshots and the raw identifiable laboratory report are not deployment assets.

## Original app artwork

These files in `assets/original/` are copied byte-for-byte from the owner's `Website Graphics 2.zip` bundle. Their natural proportions are retained in the page.

| Display | Original filename | Native dimensions |
| --- | --- | --- |
| Daily insights | `Group 2085666071 1.png` | 347 × 538 |
| Food and nutrition | `Frame 2147228749 1.png` | 345 × 566 |
| Training | `Group 2085666069 1.png` | 376 × 566 |
| Cycle and journal | `Cycle Tracker 1.png` | 373 × 566 |
| Biological age | `bioage 1.png` | 366 × 566 |
| Care and assessment | `Frame 2147228989.png` | 481 × 566 |
| Health Vault | `Group 2085666068 1.png` | 366 × 566 |

The original screens are explicitly labelled as illustrative designs. Their embedded example dates, values, scores and statements are retained for the requested visual fidelity; they are not evidence of clinical validity, release status or commercial entitlement.

## Original icons and motion

The ten Pro feature icons use original exports from the same Figma Home Page (`6621:58204`, page `6031:51867`). Their actual local filenames are referenced in `parts/features.html`; retain the exported geometry rather than replacing them with generic symbols.

The Health Vault backdrop uses the supplied `assets/supplied/health-documents-transparent.webm`, 1920 × 1080, with the existing extracted `assets/optimized/health-documents-poster.webp` as its static state. This is the original animation of generic health documents. It follows the site's viewport-aware muted playback and reduced-motion behavior.

The voice-section lifestyle footage is the exact video downloaded from Figma node `6655:1467`, retained at `assets/supplied/voice-figma-6655-1467.mp4`. Its SHA-256 is `6f48dc75b4eb219cb0f7d004ad2262ab101f2203c36706a1d57e4a0106f1933e`. The poster is `assets/optimized/voice-reference-poster.webp`.

Other supplied videos, professional/member portraits, original brand marks and approved optimized derivatives retain their existing call sites. Names, endorsements, professional roles or service availability must not be inferred from imagery alone.

## Permanently redacted original report

`assets/original/health-report-redacted.png` is a new 633 × 565 raster derived deterministically from the supplied report using Swift/CoreGraphics. It retains the original card silhouette, laboratory branding, table layout and report values. It is a redacted source sample, not a newly fabricated clinical record.

The derivative permanently removes the patient name, demographic and patient-ID fields, sample-location and collection/registration details, QR code, barcode, laboratory contact numbers, email/address and the bottom interpretation. The removed pixels are replaced with white, with restrained “Redacted sample” wording in the patient strip. Redaction is baked into the PNG; no original data is hidden behind CSS, SVG layers or browser overlays. The output was written as a fresh raster without source metadata and visually inspected.

The raw report is excluded from the repository and served assets. The page labels the derivative “Redacted report sample” and preserves its original proportions.

Public access to this repository does not grant rights to reuse Cureocity branding or supplied imagery.
