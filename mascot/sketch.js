// FranGoLingo mascote — cara do Frango em pixel.
// Rodar em https://editor.p5js.org (colar este arquivo) ou abrir mascot/index.html.
// Clique / barra de espaço: troca expressão (idle -> happy -> sad).
// Tecla S: baixa sprite sheet PNG com os 8 frames da expressão atual.

const PALETTE = {
  ".": null, // transparente
  W: "#ffffff", // penas
  S: "#d1d5db", // sombra
  R: "#ef4444", // crista e papo
  O: "#f59e0b", // bico
  K: "#111827", // olho (base)
  P: "#f9a8d4", // bochecha
};

// Cara (sem olhos — olhos são desenhados por expressão).
const SPRITE = [
  "......RR........",
  ".....RRRR.......",
  ".....RRRR.......",
  "....WWWWWW......",
  "...WWWWWWWW.....",
  "..WWWWWWWWWW....",
  "..WWWWWWWWWW....",
  "..WWWWWWWWWW....",
  "..WWWWOOOWWW....",
  "..WWWWOOOWWW....",
  "..WPWWWWWWPW....",
  "...WWWRRWWW.....",
  "....WWWWWW......",
  ".....WWWW.......",
];

const CELL = 16;
const SPRITE_W = SPRITE[0].length;
const SPRITE_H = SPRITE.length;
const SHEET_FRAMES = 8;
const MODES = ["idle", "happy", "sad"];
let mode = 0;

function setup() {
  createCanvas(512, 512);
  pixelDensity(1);
  noSmooth();
  textFont("monospace");
  textSize(14);
}

// ---- Expressão / pose --------------------------------------------------

function poseFor(name, t) {
  if (name === "happy") {
    const hop = abs(sin(t * 6));
    return { yOff: -hop * 10, squash: hop > 0.6 ? 0.08 : -0.06, expr: "happy", beakOpen: true };
  }
  if (name === "sad") {
    return { yOff: 3 + sin(t * 1.5) * 1.5, squash: 0.04, expr: "sad", beakOpen: false };
  }
  return {
    yOff: sin(t * 2) * 1.5,
    squash: 0,
    expr: frameCount % 170 < 6 ? "blink" : "neutral",
    beakOpen: false,
  };
}

// Olhos por expressão. Retorna [linha, coluna, cor].
function eyeCells(expr) {
  const k = PALETTE.K;
  const out = [];
  if (expr === "happy") {
    // olhos fechados em arco "^^"
    out.push([5, 4, k], [6, 3, k], [6, 5, k], [5, 9, k], [6, 8, k], [6, 10, k]);
  } else if (expr === "sad") {
    // olhos baixos + sobrancelhas em diagonal (canto interno erguido)
    for (const c of [4, 5, 8, 9]) out.push([6, c, k], [7, c, k]);
    out.push([5, 4, k], [4, 5, k], [5, 9, k], [4, 8, k]);
  } else {
    // neutro: olhos 2x2 sólidos
    for (const c of [4, 5, 8, 9]) out.push([5, c, k], [6, c, k]);
  }
  return out;
}

// ---- Desenho -----------------------------------------------------------

function drawSpriteInto(g, pose) {
  for (let row = 0; row < SPRITE_H; row++) {
    const line = SPRITE[row];
    for (let col = 0; col < SPRITE_W; col++) {
      const color = PALETTE[line[col]];
      if (!color) continue;
      g.fill(color);
      g.rect(col * CELL, row * CELL, CELL, CELL);
    }
  }

  if (pose.expr !== "blink") {
    for (const [row, col, color] of eyeCells(pose.expr)) {
      g.fill(color);
      g.rect(col * CELL, row * CELL, CELL, CELL);
    }
  }

  if (pose.beakOpen) {
    g.fill(PALETTE.O);
    for (let col = 6; col <= 8; col++) g.rect(col * CELL, 10 * CELL, CELL, CELL);
  }
}

function drawFace(pose) {
  push();
  translate(width / 2, height / 2);
  translate(0, pose.yOff);
  scale(1 + pose.squash, 1 - pose.squash);
  translate(-(SPRITE_W * CELL) / 2, -(SPRITE_H * CELL) / 2);
  const g = drawingContext;
  drawSpriteInto(
    { fill: (c) => (g.fillStyle = c), rect: (x, y, w, h) => g.fillRect(x, y, w, h) },
    pose,
  );
  pop();
}

function drawHud(name) {
  fill("#94a3b8");
  noStroke();
  text(`FranGoLingo  ·  ${name}`, 20, height - 46);
  text("clique/space: trocar  ·  S: exportar sprite sheet", 20, height - 24);
}

function draw() {
  background("#0b1020");
  const t = millis() / 1000;
  const name = MODES[mode];
  const pose = poseFor(name, t);
  drawFace(pose);
  drawHud(name);
}

// ---- Interação ---------------------------------------------------------

function next() {
  mode = (mode + 1) % MODES.length;
}
function mousePressed() {
  next();
}
function keyPressed() {
  if (key === " ") next();
  if (key === "s" || key === "S") exportSheet();
}

// ---- Export sprite sheet ----------------------------------------------

function exportSheet() {
  const name = MODES[mode];
  const sheet = createGraphics(SHEET_FRAMES * SPRITE_W * CELL, SPRITE_H * CELL);
  sheet.pixelDensity(1);
  sheet.noSmooth();
  sheet.noStroke();
  for (let f = 0; f < SHEET_FRAMES; f++) {
    const t = (f / SHEET_FRAMES) * (TWO_PI / 1.5);
    const pose = poseFor(name, t);
    const filled = {
      fill: (c) => sheet.fill(c),
      rect: (x, y, w, h) => sheet.rect(x, y, w, h),
    };
    sheet.push();
    sheet.translate(f * SPRITE_W * CELL + SPRITE_W * CELL / 2, SPRITE_H * CELL / 2);
    sheet.scale(1 + pose.squash, 1 - pose.squash);
    sheet.translate(-(SPRITE_W * CELL) / 2, -(SPRITE_H * CELL) / 2);
    drawSpriteInto(filled, pose);
    sheet.pop();
  }
  sheet.save(`frango_${name}_sheet.png`);
  sheet.remove();
}
