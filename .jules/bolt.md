## 2024-05-30 - [Prevent unconditional dirty canvas renders]
**Learning:** In ComfyUI extensions, mutating `node.bgcolor` or `node.color` across the entire graph blindly triggers unconditional canvas redraws via `node.setDirtyCanvas(true, true)`.
**Action:** Always conditionally check if a node property actually changed before updating it and marking the canvas dirty to prevent severe rendering bottlenecks.
