## 2026-09-14 - [Precomputation Optimization in Canvas Events]
**Learning:** ComfyUI extensions often hook into graph events (e.g. `afterChange`, `onNodeAdded`) that fire frequently and iterate over all `app.graph._nodes`. Doing expensive string formatting or color conversion (like `hslToHex`) inside these loops introduces unnecessary CPU load.
**Action:** Always precompute invariant mappings or hex values outside of these iteration loops. Use precomputed arrays rather than invoking `Object.entries()` inside hot paths.
