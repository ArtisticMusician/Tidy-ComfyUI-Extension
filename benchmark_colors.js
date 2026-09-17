const { performance } = require('perf_hooks');

// Mock helpers
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hslToHex(h, s, l) {
  const [r, g, b] = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

function shadeHexColor(hex, amount = -0.2) {
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);
  r = Math.max(0, Math.min(255, r + amount * 100));
  g = Math.max(0, Math.min(255, g + amount * 100));
  b = Math.max(0, Math.min(255, b + amount * 100));
  return rgbToHex(r, g, b);
}

// Generate mock graph
const NUM_NODES = 5000;
const app = {
  graph: {
    _nodes: []
  }
};
const types = ["note", "loader", "clip", "sampler", "controlnet", "vae", "conditioning", "latent", "mask", "image", "style", "primitive", "gligen", "unknown"];

for (let i = 0; i < NUM_NODES; i++) {
  app.graph._nodes.push({
    type: types[i % types.length],
    title: i % 10 === 0 ? "positive prompt" : (i % 7 === 0 ? "negative prompt" : "node title"),
    setDirtyCanvas: () => {}
  });
}

// Old Logic
const oldColors = {
  loader: [0, 0.4, 0.3],
  clip: [20, 0.4, 0.3],
  note: [40, 0.4, 0.3],
  sampler: [60, 0.4, 0.3],
  controlnet: [80, 0.4, 0.3],
  vae: [100, 0.4, 0.3],
  conditioning: [120, 0.4, 0.3],
  latent: [140, 0.4, 0.3],
  mask: [160, 0.4, 0.3],
  image: [180, 0.4, 0.3],
  style: [200, 0.4, 0.3],
  primitive: [220, 0.4, 0.3],
  gligen: [240, 0.4, 0.3],
};

function oldColorByType() {
  app.graph._nodes.forEach((node) => {
    const colorRef = Object.entries(oldColors).find(([key]) => {
      return node.type.toLowerCase().includes(key);
    });
    if (colorRef) {
      const [h, s, l] = colorRef[1];
      const bgcolor = hslToHex(h / 360, s, l);
      node.bgcolor = bgcolor;
      node.color = shadeHexColor(node.bgcolor);
    }
  });
}

function oldColorPositiveNegative() {
  app.graph._nodes.forEach((node) => {
    if (node.title.toLowerCase().includes("positive")) {
      const bgcolor = hslToHex(120 / 360, 0.4, 0.3);
      node.bgcolor = bgcolor;
      node.color = shadeHexColor(node.bgcolor);
    } else if (node.title.toLowerCase().includes("negative")) {
      const bgcolor = hslToHex(0, 0.4, 0.3);
      node.bgcolor = bgcolor;
      node.color = shadeHexColor(node.bgcolor);
    }
  });
}

function oldUncolor() {
  app.graph._nodes.forEach((node) => {
    if (node.type.toLowerCase() === "note") {
      const [h, s, l] = oldColors.note;
      const bgcolor = hslToHex(h / 360, s, l);
      node.bgcolor = bgcolor;
      node.color = shadeHexColor(node.bgcolor);
    } else {
      node.bgcolor = hslToHex(0, 0, 0.3);
      node.color = shadeHexColor(node.bgcolor);
    }
  });
}

// New Logic
const PRECALCULATED_NOTE_BG = hslToHex(oldColors.note[0] / 360, oldColors.note[1], oldColors.note[2]);
const PRECALCULATED_NOTE_COLOR = shadeHexColor(PRECALCULATED_NOTE_BG);
const PRECALCULATED_DEFAULT_BG = hslToHex(0, 0, 0.3);
const PRECALCULATED_DEFAULT_COLOR = shadeHexColor(PRECALCULATED_DEFAULT_BG);

function newUncolor() {
  app.graph._nodes.forEach((node) => {
    const nodeType = node.type?.toLowerCase() || "";
    if (nodeType === "note") {
      node.bgcolor = PRECALCULATED_NOTE_BG;
      node.color = PRECALCULATED_NOTE_COLOR;
    } else {
      node.bgcolor = PRECALCULATED_DEFAULT_BG;
      node.color = PRECALCULATED_DEFAULT_COLOR;
    }
  });
}

const PRECALCULATED_NODE_COLORS = Object.entries(oldColors).map(([key, [h, s, l]]) => {
  const bgcolor = hslToHex(h / 360, s, l);
  return {
    key,
    bgcolor,
    color: shadeHexColor(bgcolor)
  };
});

function newColorByType() {
  app.graph._nodes.forEach((node) => {
    const nodeType = node.type?.toLowerCase() || "";
    const colorRef = PRECALCULATED_NODE_COLORS.find((item) => nodeType.includes(item.key));
    if (colorRef) {
      node.bgcolor = colorRef.bgcolor;
      node.color = colorRef.color;
    }
  });
}

const PRECALCULATED_POS_BG = hslToHex(120 / 360, 0.4, 0.3);
const PRECALCULATED_POS_COLOR = shadeHexColor(PRECALCULATED_POS_BG);
const PRECALCULATED_NEG_BG = hslToHex(0, 0.4, 0.3);
const PRECALCULATED_NEG_COLOR = shadeHexColor(PRECALCULATED_NEG_BG);

function newColorPositiveNegative() {
  app.graph._nodes.forEach((node) => {
    const nodeTitle = node.title?.toLowerCase() || "";
    if (nodeTitle.includes("positive")) {
      node.bgcolor = PRECALCULATED_POS_BG;
      node.color = PRECALCULATED_POS_COLOR;
    } else if (nodeTitle.includes("negative")) {
      node.bgcolor = PRECALCULATED_NEG_BG;
      node.color = PRECALCULATED_NEG_COLOR;
    }
  });
}

// Benchmarking
const oldOps = [oldColorByType, oldColorPositiveNegative, oldUncolor];
const newOps = [newColorByType, newColorPositiveNegative, newUncolor];

let oldTime = 0;
let newTime = 0;
const ITERATIONS = 100;

for (let i = 0; i < ITERATIONS; i++) {
  const t0 = performance.now();
  oldOps.forEach(f => f());
  oldTime += performance.now() - t0;

  const t1 = performance.now();
  newOps.forEach(f => f());
  newTime += performance.now() - t1;
}

console.log(`Old logic took: ${oldTime.toFixed(2)}ms`);
console.log(`New logic took: ${newTime.toFixed(2)}ms`);
console.log(`Improvement: ${((oldTime - newTime) / oldTime * 100).toFixed(2)}% faster`);
