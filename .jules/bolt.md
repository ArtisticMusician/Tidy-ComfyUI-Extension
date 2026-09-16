## 2026-09-16 - [Precompute node colors optimization]
**Learning:** ComfyUI extensions often calculate UI properties dynamically per-node during render loops (e.g., `extensions/colors.js` converting HSL to Hex repeatedly). Precomputing static values dramatically reduces render overhead.
**Action:** When working on ComfyUI extensions, check if dynamic property calculations (like color generation) inside node iteration loops can be lifted and precomputed.
