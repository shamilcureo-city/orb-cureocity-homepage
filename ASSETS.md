# Homepage asset provenance

## Original Figma assets used in the current design

The original assets below were downloaded or exported on 2026-10-23 through the browser inspector in the user-supplied Figma file, `AwydaKZ3UdxjHtLi1rrhBX`, from the homepage beginning at node `6031:51867`. The Figma connector could not retrieve the view-only file, but the browser's inspect controls provided the source images and frame exports. Browser screenshots in `/private/tmp/orb-ref*.png` were used for visual comparison; the website now serves the untouched uploaded originals listed below, without resizing or lossy conversion.

Paths below are relative to the project root. All 17 raster originals are preserved unchanged under `assets/figma-originals/` and copied byte-for-byte into `dist/assets/`. Their total size is 49,922,172 bytes. The logo SVG is also served unchanged. SHA-256/byte comparisons confirmed all served rasters match the preserved originals. Earlier WebP derivatives have been superseded.

Dimensions below show the original and served pixel dimensions; the SVG dimensions are its declared view box. All original raster files were opened for visual inspection, and both original and served dimensions were checked.

| Preserved original | Served asset | Dimensions: original → served | Figma node | Source and use |
| --- | --- | --- | --- | --- |
| `dist/assets/figma-logo.svg` | Unchanged SVG | 178 × 36 | `6120:105584` | Exported `Logo SVG` brand lockup. |
| `assets/figma-originals/figma-gradient.png` | `dist/assets/figma-gradient.png` | 1760 × 2352 (unchanged) | `6129:106084` | Original navy-to-white background artwork. |
| `assets/figma-originals/figma-hero-phone.png` | `dist/assets/figma-hero-phone.png` | 390 × 794 (unchanged) | `6117:105402` | Original `Mask group 1` handset, displayed untouched. Revised conversation copy is in a separate accessible demo dialog. |
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

These files are reused from the design supplied by the user. This record documents their source, not their ownership or licence. It does not verify the pictured facility as a real Cureocity location, the images as photographs, device compatibility, clinical claims, or product availability. Phone screens are illustrative source artwork; the revised conversation and today's-focus content are implemented in a separate HTML dialog and identified as an illustrative example.

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

The generated source outputs were copied into the project and left intact at their original locations. The current homepage serves untouched Figma originals and the unchanged logo SVG from `dist/assets/`; source copies also remain in `assets/figma-originals/`.

