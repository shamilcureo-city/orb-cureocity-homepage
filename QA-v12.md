# V12 verification — 24 October 2026

## Product and content

- Reviewed the supplied Orb Product and Website Brief and the official Bevel homepage for breadth and product presentation. No competitor copy, assets or testimonials were reused.
- Added visible nutrition, movement, voice logging, Health Vault, recovery/stress/trends/glucose, cycle/journal, care, Blueprint, family, connections and trust sections.
- Confirmed annual price slots show ₹7,500/year and ₹625 monthly equivalent. Professional care is separate; app inclusions remain pending in the private concept.
- Fictional insight examples identify their source, last sync and missing data. Cycle dates are internally coherent. Report information is reviewed against its original. Consultations require scheduling separately from service purchase.

## Build and static checks

- `node build.mjs` and `npm run check` passed.
- Assembled HTML has no duplicate IDs, unresolved local fragment anchors or missing referenced local assets.
- Public build gate intentionally rejected unconfirmed feature claims and missing essential destinations. Normal owner-private output remains intact.
- Original raster files were not changed. Existing WebP delivery copies and HTML/CSS/SVG illustrations are used.

## Browser verification

- Inspected the complete desktop composition and its major sections at 1280 × 900.
- Checked widths 320, 390, 768, 1024 and 1280: document width matches viewport width.
- Found and corrected intrinsic grid-width clipping in nutrition/movement. Rechecked text columns at all four narrow widths; text fits the available width.
- Verified original assets finish loading (zero unloaded/failed images after section traversal) and browser console has no warnings/errors.
- Tested Intelligence/Today preview tabs, visitor-priority tabs, nutrition tabs including arrow-key navigation, Health Vault tabs, insight tabs and Home key, care-mode tabs and family sharing disclosure.
- Tested the weekly story: plan → office lunch → lunch choice → next-week draft. The example does not log a meal as eaten.
- Tested the voice illustration through capture, confirmation and reset. It does not access a microphone. Removed focus stealing if the visitor moves away during the finite animation.
- Tested mobile menu, fixed navigation, responsive Get Orb bar and annual-billing FAQ.
- Get Orb opens the correctly priced store-selection dialog. Pending store links are disabled and explained. Escape closes the dialog.
- Reviewed reduced-motion branches and progressive fallback in source. No browser-level reduced-motion or script-disabled emulation was performed.

## Captures

Saved outside the Site source directory:

- `orb-v12-full-homepage.png`: complete, loaded desktop homepage.
- `orb-v12-hero.png`: hero region with original phones and sharp Intelligence conversation.
- `orb-v12-your-priorities.png`: personal priorities section.
- `orb-v12-mobile.png`: 390px mobile view.

## Limits

This validates the website concept's layout and demonstrations. It does not verify app release, clinical effectiveness, device compatibility, conversion uplift, paid entitlements, store checkout or live professional services. Store/enquiry/policy links remain pending as documented in `site-content.json`. Existing owner-private audience is preserved.
