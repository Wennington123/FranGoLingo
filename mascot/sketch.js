// FranGoLingo mascote — Frango em pixel.
// Rodar em https://editor.p5js.org (colar este arquivo) ou abrir mascot/index.html.
// Clique / barra de espaço: troca animação (idle -> happy -> sad).
// Tecla S: baixa sprite sheet PNG com os 8 frames da animação atual.

const PALETTE = {
  ".": null, // transparente
  W: "#ffffff", // corpo
  S: "#d1d5db", // sombra do corpo
  R: "#ef4444", // crista e papo
  O: "#f59e0b", // bico e pés
  K: "#111827", // olho
};

const SPRITE = [
  ".....RRR............",
  "....RRRRR...........",
  "....RRRRR...........",
  "....WWWWWWW.........",
  "...WWWWWWWWW........",
  "...WWWWKWWWW........",
  "...WWWWKWWWWOOO.....",
  "...WWWWWWWWW........",
  "..WWWWWWWWWWWW......",
  ".WWWWWWWWWWWWWW.....",
  ".WWWWWWWWSSWWWW.....",
  "WWWWWWWWSSSSWWWW....",
  "WWWWWWWWSSSWWWW.....",
  ".WWWWWWWWWWWWWW.....",
  "..WWWWWWWWWWWW......",
  "...WWWWWWWWWW.......",
  "....OOO..OOO........",
  "....OOO..OOO........",
  "...OOOO.OOOO........",
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

// ---- Pose por animação -------------------------------------------------

function poseFor(name, t) {
  if (name === "happy") {
    const hop = abs(sin(t * 6));
    return {
      yOff: -hop * 26,
      squash: hop > 0.6 ? 0.08 : -0.06,
      blink: false,
      beakOpen: true,
      shadow: 1 - hop * 0.5,
    };
  }
  if (name === "sad") {
    return {
      yOff: 7 + sin(t * 1.5) * 1.5,
      squash: 0.05,
      blink: frameCount % 200 < 12,
      beakOpen: false,
      shadow: 1.1,
    };
  }
  return {
    yOff: sin(t * 2) * 2,
    squash: 0,
    blink: frameCount % 170 < 6,
    beakOpen: false,
    shadow: 1,
  };
}

// ---- Desenho -----------------------------------------------------------

function drawSpriteInto(g, pose) {
  const { blink, beakOpen } = pose;
  for (let row = 0; row < SPRITE_H; row++) {
    const line = SPRITE[row];
    for (let col = 0; col < SPRITE_W; col++) {
      const ch = line[col];
      if (ch === "K" && blink) continue; // olho fechado = pisca
      const color = PALETTE[ch];
      if (!color) continue;
      g.fill(color);
      g.rect(col * CELL, row * CELL, CELL, CELL);
    }
  }
  if (beakOpen) {
    g.fill(PALETTE.O);
    for (let col = 12; col <= 13; col++) g.rect(col * CELL, 7 * CELL, CELL, CELL);
  }
}

function drawShadow(pose) {
  noStroke();
  fill(0, 60);
  const w = SPRITE_W * CELL * 0.9 * pose.shadow;
  const h = 14 * pose.shadow;
  ellipse(width / 2, height * 0.78 + SPRITE_H * CELL / 2 + 6, w, h);
}

function drawChicken(pose) {
  push();
  translate(width / 2, height * 0.38);
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
  drawShadow(pose);
  drawChicken(pose);
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
    const t = (f / SHEET_FRAMES) * (TWO_PI / 1.5); // 1 ciclo da animação
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
