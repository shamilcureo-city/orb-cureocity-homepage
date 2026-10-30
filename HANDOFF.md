# Orb homepage — new Figma implementation

Updated 30 October 2026. Local preview: http://127.0.0.1:4183/

Latest revision adds scroll-triggered silent video playback, automatic carousel rotation, expanded motion and equal compact footer columns at the user's request. See the Motion section for behavior. Local review evidence is not part of this source export.

## Comfortable viewing scale revision

At the user's request, the Figma composition now uses a smaller web scale: 16px base text, 1120px content maximum, mostly44–48px desktop section headings, 16–18px body text and44–48px controls. Hero height at1440px fell from808px to640px; feature cards from631px to500px desktop and780px to630px mobile. Phone previews, portraits, free-entry cards, Blueprint, pricing, FAQs and section gaps were adjusted together. No browser zoom or whole-page scaling is applied. All seven carousels and the commercial configuration remain intact.

The measured1440px page height decreased from22,843px to17,815px (about22%). Mobile cards use separate content/image rows; meal/workout previews follow their copy in normal flow. Mobile Blueprint diagrams use readable stacked content instead of squeezing text into small fixed panels. Build/check passed. Browser checks covered all six feature slides at360,390,600,601,768,900,901,1024,1440 and1728px, plus card actions across the page and all Blueprint stages at360,768 and1440px. A mobile grid inheritance issue found during QA was fixed and retested. Screenshots and observations were retained locally.

## Design source

The user supplied the Website Design page URL with node 6031:51867. In the signed-in Figma browser, the updated desktop frame is **Home Page**, node 6621:58204,1728×24075. The full-resolution design export is retained locally and excluded from this repository.

The connector's create_session and get_design_context calls require edit access and were rejected. Implementation used the visible Figma properties, browser export and the user's Website Graphics 2.zip. This is browser-verified design implementation, not a successful connector import. Mobile layouts were adapted from the updated desktop composition; no matching updated mobile frame was established.

## Implemented

- Full-width lifestyle video hero and floating capsule navigation, matching the new composition.
- Free/Pro phone cards; two free-entry video cards; three independently illustrated connected-information scenes, including the restored daily-plan kitchen and professional-support sofa scenes.
- Six real feature slides with matching Figma artwork and adjacent-card previews, professional portrait, ten-item feature overview, corrected Health Vault and voice example.
- Blueprint online/centre modes with five sliding stages each, supplied assessment/consultation/nutrition videos, sliding doctor profiles and three support choices.
- Family Circle, five-image Pro gallery, food/movement cards, supplied member portraits, nine FAQs, final banner and footer.
- Native responsive HTML/CSS, interactive controls, keyboard tabs, dialog focus handling, Escape, menu breakpoint reset and visible focus.
- Seven independent carousel tracks contain 29 real slides across connected information, features, both Blueprint modes, doctors, Pro and members. Arrows, labelled tabs, thumbnails, pointer dragging and keyboard controls share the same state. Inactive slides are inert; inactive videos pause.
- Source bundle safely extracted; images optimized to WebP. Build packages only 44 referenced assets. Unused identifiable reports and contradictory graphics are excluded from dist. The voice-section still now comes from the exact Figma video layer 6655:1467; the original video is now used for the scrolling voice-section scene.

## Commercial and destination confirmations

**₹7,999/year was explicitly confirmed by the user on29 October 2026.** One configuration controls every price. Equivalent to ₹666.58/month, billed annually; no monthly payment plan is advertised.

Still pending before a public release:

1. Verified App Store/Google Play links and actual free diet/fitness entry URLs/account requirements.
2. Pro entitlements and Free-versus-Pro distinctions, including biological age, training, deeper insights and CGM analysis; final tax/billing terms.
3. Supported device/CGM models, data types, markets and availability.
4. Care/Blueprint/hub booking destinations, service availability and package details.
5. Approved privacy/terms/data-request/help/contact/professional destinations and released sharing controls.
6. Final approval of supplied professional role wording and member-photo usage. No member names, quotes, outcomes or counts were invented.

Actions with missing destinations open distinct informational preview panels. They do not submit data, create accounts, perform assessments, record audio, save workouts or claim successful booking. Public build remains blocked until the configuration is approved. Publishing the source to GitHub does not approve these pending items or deploy the website.

## Intentional differences from flawed reference examples

- The₹20,000 comparative-value claim and unverified professional quote were omitted.
- Phone previews use corrected synthetic examples: morning time/greeting, distinct daily actions, meaningful record counts, coherent meal estimates, workout-log labelling and cycle estimates.
- The report sample is fictitious, with no identifiers, contacts, QR or barcode.
- CGM uses one seven-point dataset,26 October 2026,06:00–18:00,mg/dL:92,96,108,118,112,101,97. Average103.4,min92,max118; no clinical bands.
- Blueprint shows history,reports,movement and consultations leading to findings,priorities and next steps, never face scanning as organ assessment.
- Added annual billing language, explicit illustrative captions, accessible controls and small contrast improvements.

## Motion

The user requested automatic media and slides on30 October2026, superseding the earlier no-auto-rotation direction. All12 videos now play muted, inline and looping when at least20% visible, and pause offscreen, in hidden slides/tabs, behind dialogs, on page hiding or when motion is reduced. Native player controls and per-video play/pause overlays are removed. The exact voice-section source footage now plays behind the explicit simulated workout example.

Seven carousel tracks advance every6.5–10seconds while visible; tracks with all cards already visible remain still. Progress lines indicate the next transition. Rotation pauses for hover, keyboard focus, dragging, an expanded detail, dialogs, offscreen content or reduced motion. Manual arrows/tabs/dragging remain available. Each slider has a pause toggle, plus synchronized global controls in the sticky header and footer. Explicit resume works while the slider toggle retains keyboard focus. Automatic transitions do not announce continually to screen readers.

Section reveals use480–560ms opacity/14–20px movement with short card staggering. Slide copy enters in a450ms stagger; media crossfades, carousel tracks slide460ms, the last-to-first reset uses a350ms fade, and button arrows/cards have subtle hover feedback. Motion respects both the operating-system setting and the site pause controls. No autoplay audio or microphone request is introduced.

The footer now uses a compact brand plus three equal desktop navigation columns; tablets keep three equal columns below the brand, and mobile groups use two equal link columns. All existing destinations are preserved.

## Validation and evidence

`npm run build` and `npm run check` passed after the slider revision. Browser checks covered 360,390,768,900,901,1024,1440 and1728px: all48 feature-slide/width combinations, all10 Blueprint stages, all4 Pro thumbnails, lower carousels on mobile, keyboard endpoints and visible focus, pointer dragging, inactive-video pause and reduced motion. Additional mobile copy/visual spacing checks covered360,374,375,390 and600px. No page overflow, clipped main feature actions, visible broken images or console warnings/errors observed. Physical-device touch testing remains unperformed; drag behavior was exercised in the browser at mobile and desktop viewport sizes.

Screenshots, browser logs and full Figma exports are retained locally rather than published with the source. Earlier implementation history remains available in Git.

## GitHub source export

The repository contains the current source, generated preview and exactly 44 displayed assets. Unused raw graphics, identifiable source reports and local review evidence are excluded. The store badges use rounded edge clipping to remove the unwanted white border visible in the supplied artwork. Export validation rebuilds and checks the project, then compares the generated files byte-for-byte with the current local preview.
