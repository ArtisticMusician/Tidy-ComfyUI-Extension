## 2026-09-17 - [ComfyUI Graph Operations Optimization]
**Learning:** In this ComfyUI extension codebase, graph modifications trigger frequent `app.graph.afterChange` events. Operations like calculating colors (e.g. `hslToHex` / `shadeHexColor`) and array allocations (e.g. `Object.entries`) inside node loops during these events can cause significant performance overhead.
**Action:** Always precalculate and cache static values and map structures before iterating over graph nodes during rendering or change events.
## 2026-09-17 - [ComfyUI setDirtyCanvas Performance Anti-pattern]
**Learning:** Calling `node.setDirtyCanvas(true, true)` unconditionally inside node iteration loops during `afterChange` events forces LiteGraph to redraw the entire canvas on every update (e.g., while simply moving a node). This redraw cost dominates the UI frame time and is much more expensive than JS computation overhead.
**Action:** Always conditionally check if a visual property (like `node.bgcolor` or `node.color`) has actually changed before mutating the node and triggering `setDirtyCanvas`.
