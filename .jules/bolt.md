## YYYY-MM-DD - [Precomputation of Static Values Outside Loops]
**Learning:** Functions that frequently iterate over elements (like `app.graph._nodes.forEach`) are prime candidates for optimization if they perform redundant calculations or array operations that don't depend on the specific node.
**Action:** Extract static calculations, such as color hex conversions (`hslToHex`, `shadeHexColor`) and static array destructuring or mapping (`Object.entries`), out of `.forEach` and `.find` loops into module-scoped constants or precomputed lookup objects to reduce redundant work.
