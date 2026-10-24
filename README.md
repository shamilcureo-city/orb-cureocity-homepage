# Orb comprehensive homepage

A standalone, owner-private website concept based on **Cureocity_Orb_Product_and_Website_Brief.pdf**, separate from Cureocity Mind. The page makes the breadth of Orb visible through original product artwork, readable interface illustrations and practical examples. Conversion remains Get Orb → download → choose a subscription in the app.

## Current experience — v14

1. Original navy-to-white hero, three original handset images, sharp Orb Intelligence and daily-plan previews.
2. Free diet-plan and AI fitness-assessment offers, with mockup buttons pending the owner’s live URLs.
3. A layered product panorama with eight-feature navigation and four illustrated visitor-priority paths: understand my day, make food work, build fitness and connected care.
4. Detailed nutrition planning, meal logging and weekly feedback, with familiar-food and preparation-time examples.
5. Workout planning, movement assessment, session logging and a finite voice-log demonstration.
6. A visible Health Vault: originals, review of extracted information, history and permission-based sharing.
7. Interactive sleep/recovery, activity/stress, health-trend and glucose illustrations, with sources, dates, gaps and interpretation boundaries.
8. Original cycle-tracking handset, coherent date overlays and a personal journal illustration.
9. A three-stage interactive week: plan, adapt an office lunch, carry feedback forward.
10. Optional connected care, distinct professional roles, app-led/online/hybrid routes, Blueprint and consent-based Family Circle.
11. An interactive connections console with a source network, CGM default view, supported wearables/apps, reports, daily inputs and no-wearable path.
12. A cinematic AI assessment/trainer showcase using the original training-lab artwork, movement traces, keyboard tabs and finite replay.
13. Confirmed annual offer: ₹7,500/year; ₹625 monthly equivalent, billed annually. Professional care is separate. Eleven FAQs and comprehensive footer navigation.

Final app inclusions and released features remain unconfirmed. No competitor exclusivity, clinical outcomes, fabricated testimonials, trial, discount or automatic treatment changes are claimed. Bevel's official website was reviewed for breadth and product visibility; its assets, copy and customer proof were not reused.

## Build and preview

```sh
npm run build
npm run check
npm run dev
```

Node 20+; local preview http://127.0.0.1:4178. `build.mjs` assembles HTML and generates `dist/config.js` from `site-content.json`. Price slots are generated from the confirmed annual price. CSS/JS/assets are served from `dist`.

## Active files

- `parts/head.html`: metadata, navigation, icons and imports.
- `parts/main.html`: original hero with two sharp interface previews.
- `parts/feature-atlas.html`, `dist/feature-atlas.css/js`: layered product panorama and feature navigation.
- `parts/priority-studio.html`, `dist/priority-studio.css/js`: four distinct priority illustrations.
- `dist/complete.css/js`: responsive foundation, priority tab behavior and persistent navigation. The historical complete-overview partial is no longer assembled.
- `dist/mesh-orb.css/js`: original mesh Orb presentation in voice logging and closing CTA; viewport-aware breathing and pause controls.
- `parts/complete-routine.html`, `dist/complete-routine.css/js`: nutrition and training; `parts/voice-routine.html` retains the voice logging section.
- `parts/complete-health.html`, `dist/complete-health.css/js`: records, contextual insights, cycle and journal.
- `parts/value-week.html`, `dist/value-week.css/js`: interactive practical week.
- `parts/complete-care.html`, `dist/complete-care.css/js`: care, assessments and family.
- `parts/value-offer.html`, `dist/value-offer.css/js`: annual offer, FAQs, final action and footer.
- `parts/free-tools.html`, `dist/free-tools.css`: free offer cards and supporting entry points.
- `parts/ai-fitness.html`, `dist/ai-fitness.css/js`: AI fitness showcase.
- `parts/connected-orb.html`, `dist/connected-orb.css/js`: source network, CGM and other source panels, original trust content.
- `dist/premium-motion.css/js`: finite document, phone, chart and care-journey motion.
- `parts/foot.html`: shared dialog and mobile Get Orb bar.
- `dist/journey.css/js`: daily-screen styles, sticky CTA and configured policy destinations.
- `dist/app.js`: destination dialogs and navigation. Unused legacy handlers remain inert.
- `dist/motion.css`: retained reduced-motion styling. Legacy base, fidelity and value-product files remain in source history but are no longer loaded.

## Original artwork

Original PNG/JPEG/SVG files are unchanged. Existing WebP derivatives preserve the supplied artwork at web-appropriate sizes. The centre hero handset is 320px desktop, 300px mobile and 280px on narrow phones. Hero content is sharp HTML. HTML overlays cover inconsistent legacy meal numbers and cycle dates without modifying the image files. The Health Vault uses an original HTML document illustration rather than the old clinical-score screenshot. See `ASSETS.md`.

## Interaction boundaries

All demonstrations are local and fictional. The website does not connect health sources, upload records, share information, book appointments, run live AI or process subscriptions. The office-lunch choice only changes the displayed example; the next-week proposal is a draft. The voice example does not use a microphone and confirms only an illustrative entry. No entered information is persisted or transmitted.

Tabs support keyboard arrows, Home and End. Feature panels stay visible without JavaScript, except the alternate hero view whose information is also presented elsewhere. Native disclosures work without script. Introductory motion is finite. The owner-requested mesh Orb breathing loops only on screen, pauses on hidden documents, and offers Pause/Resume controls. All new motion respects reduced-motion settings. The mobile Get Orb bar hides at the final download section. Persistent navigation provides shortcuts through the complete page.

## Release and destinations

The user confirmed ₹7,500/year on 24 October 2026. Final paid inclusions, release status, tax treatment, renewal and cancellation terms remain unconfirmed. `site-content.json` records feature release/claim status. Publishing this website concept does not verify the app's availability. `ORB_PUBLIC_BUILD=1` fails until featured claims and essential destinations are confirmed.

The owner confirmed both free tools are live and explicitly requested mockup buttons until their URLs are supplied. Set `freeDietPlanUrl` and `freeFitnessAssessmentUrl` in `site-content.json` to approved HTTPS links and rebuild. No lead form or collection is present.

App Store and Google Play URLs were explicitly deferred. Download buttons therefore open a store-selection dialog with disabled unconfigured links. Enquiry, privacy, terms, support, data-request and professional URLs are also pending. Add approved HTTPS destinations, rebuild and verify the actual journey before public use.

## Hosting

The existing Sites identity remains in `.openai/hosting.json`. Publish exact pushed source with its matching static archive, preserving owner-private access. Browser QA verifies this website's layout and interactions, not app release, clinical effectiveness or paid conversion.
