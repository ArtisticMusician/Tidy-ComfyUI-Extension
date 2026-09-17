## 2026-09-16 - [Precompute node colors optimization]
**Learning:** ComfyUI extensions often calculate UI properties dynamically per-node during render loops (e.g., `extensions/colors.js` converting HSL to Hex repeatedly). Precomputing static values dramatically reduces render overhead.
**Action:** When working on ComfyUI extensions, check if dynamic property calculations (like color generation) inside node iteration loops can be lifted and precomputed.
## 2026-09-16 - [LiteGraph Node Walking Performance]
**Learning:** During LiteGraph's `afterChange` loop or layout walking, UI callbacks often walk the entire graph doing `app.graph._nodes.forEach`. Moving object lookup allocations, color string manipulations, and conversions (HSL -> Hex) into a one-time module initialization drastically reduces lag. However, the DOM redraw `setDirtyCanvas` still holds the primary time complexity, so reducing logic overhead before the redraw request is critical for keeping frame budgets.
**Action:** Lift complex calculations out of `.forEach` iterators in `afterChange` callbacks whenever they rely on static tables or settings.
