## 2024-05-24 - [Optimize setDirtyCanvas in afterChange event loops]
**Learning:** In ComfyUI extensions, `app.graph.afterChange` loops can trigger multiple times. Unconditional calls to `node.setDirtyCanvas(true, true)` in these handlers can cause severe rendering bottlenecks.
**Action:** Always conditionally check if a node's properties (like `bgcolor` or `color`) have actually changed before applying the new value and marking the canvas dirty.
