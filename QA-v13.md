# V13 verification — 24 October 2026

## Scope

- Preserves v12 content and visual direction. Adds free diet-plan and fitness-assessment entry points, AI fitness assessment/trainer showcase, supported CGM/device/data connection console and finite product-specific motion.
- Owner confirmed the two tools are live and explicitly requested mockup buttons pending URLs. No forms, collection, camera requests, live AI or fake tool results were added.
- Annual price remains ₹7,500; ₹625 monthly equivalent billed annually. Care remains separate.
- Existing voice content and trust content were moved without changing their text.

## Checks

- Build and JavaScript syntax checks passed. Assembled HTML: 117 unique IDs, zero duplicate IDs, missing fragment targets or missing local assets.
- Public build still rejects unconfirmed claims and missing destinations, now including both free-tool URLs. The normal private build is intact.
- At 320, 390, 768, 1024 and 1280 pixels, document width equals viewport width. New copy panels, tabs and hero actions have no internal horizontal overflow.
- Visually inspected desktop free-offer cards, AI assessment/trainer stage and CGM console; also inspected mobile AI fitness and connected-information layouts.
- Both free buttons open the correct mockup dialog. Escape closes it. Nutrition navigation closes it and focuses the target heading. Supporting text contrast was corrected.
- AI tabs switch assessment/trainer content, with Home-key navigation. Connection tabs passed arrow, End and source-node selection checks. CGM is the default panel.
- Traversed the page and loaded the wearable tab: all images complete with nonzero natural dimensions. Browser warning/error log is empty.
- Motion is finite. Reduced-motion and hidden-document cancellation paths were reviewed in source; browser-level reduced-motion emulation was not available.
- Original raster files are unchanged. The original motion-lab illustration has a proportional lossless WebP delivery derivative for the new showcase.

## Proof captures

Saved outside the source directory: orb-v13-free-tools.png, orb-v13-ai-fitness.png, orb-v13-connections.png, orb-v13-full-homepage.png.

## Limits

Website layout and local demonstration checks do not verify the external free tools, released app features, exact integration compatibility or sales uplift. App Store, Google Play, free-tool and other destination URLs remain pending. No leads are collected in the mockup. Existing owner-private audience is retained.
