## YYYY-MM-DD - [Precomputation of Static Values Outside Loops]
**Learning:** Functions that frequently iterate over elements (like `app.graph._nodes.forEach`) are prime candidates for optimization if they perform redundant calculations or array operations that don't depend on the specific node.
**Action:** Extract static calculations, such as color hex conversions (`hslToHex`, `shadeHexColor`) and static array destructuring or mapping (`Object.entries`), out of `.forEach` and `.find` loops into module-scoped constants or precomputed lookup objects to reduce redundant work.

## YYYY-MM-DD - [Prevent Unnecessary Canvas Redraws]
**Learning:** ComfyUI triggers `app.graph.afterChange` hooks on many generic graph actions. Calling `node.setDirtyCanvas(true, true)` unconditionally across all nodes in the graph in this hook creates a massive performance lag because it forces LiteGraph to redraw everything, even when no visual properties changed.
**Action:** Always track state changes (`let changed = false`) and compare old values to new values before committing visual properties. Only invoke `setDirtyCanvas` when an actual property update is required.
