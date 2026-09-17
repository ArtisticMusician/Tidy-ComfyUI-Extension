## 2026-09-17 - [ComfyUI Graph Operations Optimization]
**Learning:** In this ComfyUI extension codebase, graph modifications trigger frequent `app.graph.afterChange` events. Operations like calculating colors (e.g. `hslToHex` / `shadeHexColor`) and array allocations (e.g. `Object.entries`) inside node loops during these events can cause significant performance overhead.
**Action:** Always precalculate and cache static values and map structures before iterating over graph nodes during rendering or change events.
