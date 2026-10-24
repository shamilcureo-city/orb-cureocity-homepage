# Homepage asset provenance

## Original Figma assets used in the current design

The original assets below were downloaded or exported on 2026-10-23 through the browser inspector in the user-supplied Figma file, `AwydaKZ3UdxjHtLi1rrhBX`, from the homepage beginning at node `6031:51867`. The Figma connector could not retrieve the view-only file, but the browser's inspect controls provided the source images and frame exports. Browser screenshots in `/private/tmp/orb-ref*.png` were used for visual comparison. The uploaded originals below remain preserved without modification. Versions 5–7 served these originals directly at smaller CSS display sizes; the v8 Orb-only revision introduces separate web-delivery derivatives documented below.

Paths below are relative to the project root. All 17 raster originals are preserved unchanged under `assets/figma-originals/` and copied byte-for-byte into `dist/assets/`. Their total size is 49,922,172 bytes. The logo SVG is unchanged. SHA-256/byte comparisons confirmed the PNG/JPEG copies in `dist/assets/` match the preserved originals. These copies remain available alongside the new derivatives; the table below records original-file provenance and dimensions.

Dimensions below show the original and preserved PNG/JPEG-copy pixel dimensions; the SVG dimensions are its declared view box. All original raster files were opened for visual inspection, and both original and served dimensions were checked.

| Preserved original | Served asset | Dimensions: original → served | Figma node | Source and use |
| --- | --- | --- | --- | --- |
| `dist/assets/figma-logo.svg` | Unchanged SVG | 178 × 36 | `6120:105584` | Exported `Logo SVG` brand lockup. |
| `assets/figma-originals/figma-gradient.png` | `dist/assets/figma-gradient.png` | 1760 × 2352 (unchanged) | `6129:106084` | Original navy-to-white background artwork. |
| `assets/figma-originals/figma-hero-phone.png` | `dist/assets/figma-hero-phone.png` | 390 × 794 (unchanged file) | `6117:105402` | Original `Mask group 1` handset frame, rendered at 350px wide on desktop, 300px on mobile and 280px on the narrowest screens. An HTML screen overlay displays the supplied conversation and today's focus sharply. The separate accessible replay dialog is retained. |
| `assets/figma-originals/figma-report-phone.png` | `dist/assets/figma-report-phone.png` | 2014 × 4096 (unchanged) | `6129:105847` | Original Biomarkers product preview. |
| `assets/figma-originals/figma-daily-phone.png` | `dist/assets/figma-daily-phone.png` | 450 × 920 (unchanged) | `6129:105879` | Original Readiness product preview. |
| `assets/figma-originals/figma-food-phone.png` | `dist/assets/figma-food-phone.png` | 450 × 920 (unchanged) | `6129:105866` | Original meal-scanning product preview. |
| `assets/figma-originals/figma-meal-phone.png` | `dist/assets/figma-meal-phone.png` | 450 × 920 (unchanged) | `6129:105951` | Original meal-plan product preview. |
| `assets/figma-originals/figma-workout-phone.png` | `dist/assets/figma-workout-phone.png` | 450 × 920 (unchanged) | `6129:105964` | Original mobility-check product preview. |
| `assets/figma-originals/figma-cycle-phone.png` | `dist/assets/figma-cycle-phone.png` | 1560 × 3174 (unchanged) | `6129:105861` | Original cycle-tracker product preview. |
| `assets/figma-originals/figma-voice-orb.png` | `dist/assets/figma-voice-orb.png` | 964 × 964 (unchanged) | `6129:105933` | Original coral orb artwork, source layer `Nonpar 1`. |
| `assets/figma-originals/figma-device-panel.png` | `dist/assets/figma-device-panel.png` | 1034 × 682 (unchanged) | `6129:105896` | Exported `Frame 2147228737` supported-device brand panel. |
| `assets/figma-originals/figma-blueprint.png` | `dist/assets/figma-blueprint.png` | 704 × 950 (unchanged) | `6129:105973` | `Frame 2147228770`, exported at 2× its 352 × 475 frame size. |
| `assets/figma-originals/figma-weight.jpg` | `dist/assets/figma-weight.jpg` | 736 × 1104 (unchanged) | `6129:105993` | Original woman-holding-jeans care-programme artwork. |
| `assets/figma-originals/figma-glucose.jpg` | `dist/assets/figma-glucose.jpg` | 736 × 736 (unchanged) | `6129:105999` | Original athlete with an upper-arm wearable; source layer references Whoop. Its appearance alone does not establish that it is a glucose sensor. |
| `assets/figma-originals/figma-glp.jpg` | `dist/assets/figma-glp.jpg` | 735 × 490 (unchanged) | `6129:106005` | Original GLP-1-labelled injection-pen artwork. The image alone does not establish prescription status. |
| `assets/figma-originals/figma-longevity.png` | `dist/assets/figma-longevity.png` | 3840 × 2160 (unchanged) | `6129:106011` | Original wide training-scene artwork with a projected body graphic. |
| `assets/figma-originals/figma-gym.png` | `dist/assets/figma-gym.png` | 896 × 1200 (unchanged) | `6095:104999` | Original warm wooden gym artwork with rowers and exercise bikes. |
| `assets/figma-originals/figma-guide.png` | `dist/assets/figma-guide.png` | 3058 × 4096 (unchanged) | `6129:105812` | Original split wearable-band and ring artwork for the guides area. |

These files are reused from the design supplied by the user. This record documents their source, not their ownership or licence. It does not verify the pictured facility as a real Cureocity location, the images as photographs, device compatibility, clinical claims, or product availability. The six feature-phone screens remain illustrative source artwork. The hero instead displays the supplied revised conversation and today's-focus content as HTML over the source screen area, leaving the original handset frame visible and the source file unchanged. The hero and retained replay dialog identify the conversation as an illustrative example.

`dist/compact.css` controls the smaller upper-page composition and sharp HTML hero screen. `dist/compact-lower.css` controls smaller lower-page typography, spacing, cards and artwork. These CSS adjustments change display dimensions only; they do not alter any original image bytes.

## V8 web-delivery derivatives

Created on 2026-10-24 for the Orb-only download journey. These are delivery copies of the supplied artwork, not newly generated or retouched images. Original PNG files and the preserved source copies remain byte-for-byte unchanged. Each derivative uses lossless WebP encoding; the report and cycle phones are resized to 700 pixels wide and the voice Orb to 720 pixels wide before encoding. The hero, food, meal, workout and daily phones retain their native dimensions, as does the gradient. No sharpening, cropping, compositing, recolouring or background removal is applied.

| Original delivery copy | Web delivery derivative | Pixel dimensions | File size | Reduction |
| --- | --- | --- | --- | --- |
| `dist/assets/figma-hero-phone.png` | `dist/assets/web/figma-hero-phone.webp` | 390 × 794 → 390 × 794 | 248.1 → 157.3 KiB | 36.6% |
| `dist/assets/figma-food-phone.png` | `dist/assets/web/figma-food-phone.webp` | 450 × 920 → 450 × 920 | 679.9 → 437.4 KiB | 35.7% |
| `dist/assets/figma-meal-phone.png` | `dist/assets/web/figma-meal-phone.webp` | 450 × 920 → 450 × 920 | 261.1 → 165.2 KiB | 36.7% |
| `dist/assets/figma-workout-phone.png` | `dist/assets/web/figma-workout-phone.webp` | 450 × 920 → 450 × 920 | 270.7 → 168.7 KiB | 37.7% |
| `dist/assets/figma-daily-phone.png` | `dist/assets/web/figma-daily-phone.webp` | 450 × 920 → 450 × 920 | 176.9 → 105.7 KiB | 40.3% |
| `dist/assets/figma-cycle-phone.png` | `dist/assets/web/figma-cycle-phone.webp` | 1560 × 3174 → 700 × 1424 | 2099.3 → 319.7 KiB | 84.8% |
| `dist/assets/figma-report-phone.png` | `dist/assets/web/figma-report-phone.webp` | 2014 × 4096 → 700 × 1424 | 7079.2 → 536.5 KiB | 92.4% |
| `dist/assets/figma-voice-orb.png` | `dist/assets/web/figma-voice-orb.webp` | 964 × 964 → 720 × 720 | 1731.9 → 750.2 KiB | 56.7% |
| `dist/assets/figma-gradient.png` | `dist/assets/web/figma-gradient.webp` | 1760 × 2352 → 1760 × 2352 | 3477.1 → 2860.8 KiB | 17.7% |

Together these nine files decrease from 16,408,736 bytes to 5,633,684 bytes (65.7% smaller). This describes the selected asset payload only, not a measured page-load speed. The native-size conversions were decoded and checked: every visible pixel and alpha value matched the original. Resized derivatives were decoded and their dimensions and alpha channels verified. Source hashes, dimensions and byte sizes are recorded in `dist/assets/web/manifest.json`.

## V7 source illustrations and motion

Two decorative source illustrations are authored in `parts/main.html` using HTML, CSS and inline SVG. A layered report folio carries labels for blood reports, health history and everyday habits. An open wave field with a fine circular rim is captioned with sleep, activity and meal sources. The navy and icy-blue illustrations contain no real measurements, patient data or live integrations; their rules and waves are schematic marks. `dist/graphics.css`, loaded after the compact stylesheets and before motion styles, places them on either side of the desktop phone and in a compact two-column composition beneath it at widths of 900 pixels and below. Two fine desktop connector paths are also authored SVG. These illustrations replace the six matching v6 signal cards. They do not replace or modify any original raster files or the sharp HTML conversation inside the original handset frame, which remains 350 pixels wide on desktop.

The original coral voice-Orb artwork is retained, with a decorative waveform and glow supplied by HTML/CSS. `dist/motion.js` and `dist/motion.css` introduce the source illustrations with a small vertical settle, trace the wave field once, briefly illuminate its rim and send one light packet along each desktop connection. These finite hero sequences finish within 2.4 seconds and do not continuously float, rotate or flash. The existing product-phone settling, slight pointer-hover/focus lift, and voice-Orb waveform response remain. Motion respects reduced-motion preferences and cancels when the tab is hidden; the static artwork and content remain visible.

## Superseded generated replacements

Before the browser inspector source downloads became available, the two replacement illustrations below were generated on 2026-10-23 with the built-in `image_gen.imagegen` tool. They remain documented for provenance and are superseded by the corresponding `figma-` source assets. No external image API or CLI fallback was used.

The browser screenshot `/private/tmp/orb-ref-care-hub.png` was visually inspected as a style reference; it was not sent as an image-generation input or used as an edit target.

| Legacy asset | Dimensions | Original intended use |
| --- | --- | --- |
| `assets/gym.png` | 1086 × 1448 | Generated illustrative gym setting; not a depiction of a verified Cureocity facility. |
| `assets/blueprint.png` | 1086 × 1448 | Generated conceptual health-assessment overview. |

### Gym prompt

```text
Use case: photorealistic-natural.
Asset type: portrait website image for a health and fitness hub section; an illustrative setting, not a depiction of a real named clinic.
Primary request: a photorealistic warm, dim, modern gym interior, wooden slatted ceiling with long elegant warm white strip lights, benches and organized dumbbells, no people and no logo.
Composition: vertical portrait 3:4 architectural photograph from eye level, enough floor and ceiling visible to feel like a complete space; weight benches and free weights in foreground, mirror wall and equipment in the background. Refined, atmospheric, believable proportions.
Lighting: subdued warm golden lighting and soft reflections, deep rich wood brown, charcoal black equipment, a little warm sunlight entering from the left. Calm premium editorial photography.
Constraints: no words, no typography, no logos, no watermarks, no people, no human reflections. Do not create a website layout, frame, border or captions; output only the full-bleed gym photograph.
```

Original generated output: `/Users/mohammedshamil/.codex/generated_images/01a166e3-775f-7c72-8477-666e9c979bfa/exec-3f5944ba-ba2b-4191-a234-df7f3c1832a2.png`.

### Blueprint prompt

```text
Use case: stylized-concept.
Asset type: portrait website illustration representing a personal health assessment overview.
Primary request: sophisticated minimal pale icy blue 3D healthcare overview: a subtle translucent human outline on a luminous blue glass panel, a stethoscope, a wearable and a small plate of food arranged around its edges.
Composition: vertical portrait 3:4. A single upright translucent frosted glass panel is the central subject, viewed almost straight-on with subtle perspective, carrying only a softly glowing simplified full-body human silhouette and a few tiny abstract circular marks. A dark blue stethoscope rests near the upper left, a discreet dark blue smartwatch near lower right, a small plate of colorful vegetables near lower left, arranged with balanced negative space. Soft pale blue misty studio backdrop.
Style: premium clean 3D still life, cool ice-blue palette, soft luminous glass, gentle shadows, refined restrained detail, airy light background. Match the feel of a polished health and wellness homepage illustration.
Constraints: no text, no words, no labels, no logos, no watermark, no diagnoses, no disease markers, no medical claims, no anatomical cutaway, no visible organs. Do not create a website layout, frame, border or captions; output only the illustration.
```

Original generated output: `/Users/mohammedshamil/.codex/generated_images/01a166e3-775f-7c72-8477-666e9c979bfa/exec-446915f3-833d-4343-b721-59ca6c884015.png`.

The generated source outputs were copied into the project and left intact at their original locations. The original Figma files remain untouched in `dist/assets/` and `assets/figma-originals/`. The unchanged logo SVG is used directly, while the v8 delivery derivatives below preserve the original artwork at sizes appropriate to the page.


## V9 product detail and wearable-owner story

The original wearable lifestyle photograph `dist/assets/figma-guide.png` is now used in the Orb value section. Its derivative `dist/assets/web/figma-guide.webp` is 900×1205 pixels, 975,882 bytes, a lossless WebP encoding after proportional Lanczos resizing from the unchanged 3058×4096, 21,187,705-byte PNG. Original hash and delivery dimensions are recorded in the manifest. CSS crops its composition responsively. The artwork is not regenerated.

New HTML/CSS illustrations explain preferences and equipment informing plans, a food log moving into the daily record, report sources/history, glucose context without numeric readings, and dietitian plan-to-follow-up continuity. They are labelled illustrative; they contain no live personal records or fabricated clinical outcomes. Existing original phones and the coral Orb artwork are reused.

## V10 connected-care concept

The new supplied Orb Product and Website Brief is the narrative source. The current page uses the unchanged logo, navy-to-white gradient, hero handset, coral Orb, meal-plan phone and mobility-check phone. Other historical assets remain preserved but are no longer necessarily displayed. The hero contains newly authored sharp HTML showing a fictional daily plan, logs and upcoming review. Further HTML/CSS visuals demonstrate context flowing into the day, verification of an original report, source-aware historical/partial/missing data and permission-controlled summaries. No new raster assets or AI-generated replacement imagery were created in v10. Demonstration screens are concepts, not verified live-product screenshots.

## V11 sales narrative and annual offer

The original logo, gradient, hero handset, meal-plan phone, mobility-check phone and coral Orb are reused. No raster asset was changed. The hero uses newly authored HTML for a practical lunch, a workout and feedback. The meal phone retains the original handset and meal choices; a responsive HTML overlay replaces visibility of inconsistent numerical targets in the old concept artwork with non-numeric illustrative planning content. It is labelled as an illustrative app concept. The weekly board and care journey are HTML/CSS illustrations with fictional content, not verified released product screens.

## V12 comprehensive product presentation

No raster files were generated or changed for v12. The original gradient, logo, hero/meal/food/workout/cycle handsets, coral Orb, wearable lifestyle image and hub illustration are reused. The centre hero uses the existing handset with sharp HTML Intelligence and Today panels; its side graphics are the original food and mobility handsets. Centre widths are 320px desktop, 300px mobile and 280px narrow. The meal overlay covers inconsistent legacy nutritional numbers; cycle overlays use 25 October, an estimated next period on 29 October, and four days remaining. Original pixels remain intact beneath these HTML overlays. The Health Vault document stack, dated insight charts, journal, connected-care workflow, Blueprint and family-sharing illustration are authored in HTML/CSS/SVG and explicitly fictional. No competitor artwork or proof is used.
