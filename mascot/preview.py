#!/usr/bin/env python3
"""Renderiza frames do mascote (cara) a partir de mascot/sketch.js.

Reusa SPRITE/PALETTE do sketch e replica poseFor()/eyeCells() para gerar:
    mascot/preview/<anim>.png  (tira de 8 frames)
    mascot/preview/<anim>.gif  (animado)
    mascot/preview/all.png     (as 3 expressões empilhadas)

Uso:
    python mascot/preview.py
"""
from __future__ import annotations

import math
import re
from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
SKETCH = HERE / "sketch.js"
OUT = HERE / "preview"

BG = (11, 16, 32)
CELL = 12
FRAMES = 8

OUTLINE = (154, 166, 178)

PALETTE: dict[str, tuple[int, int, int] | None] = {}
SPRITE: list[str] = []

EYE_CELLS: dict[str, list[tuple[int, int, str]]] = {
    "happy": [(5, 4, "K"), (6, 3, "K"), (6, 5, "K"), (5, 9, "K"), (6, 8, "K"), (6, 10, "K")],
    "sad": [
        (6, 4, "K"), (7, 4, "K"), (6, 5, "K"), (7, 5, "K"),
        (6, 8, "K"), (7, 8, "K"), (6, 9, "K"), (7, 9, "K"),
        (5, 4, "K"), (4, 5, "K"), (5, 9, "K"), (4, 8, "K"),
    ],
    "neutral": [
        (5, 4, "K"), (6, 4, "K"), (5, 5, "K"), (6, 5, "K"),
        (5, 8, "K"), (6, 8, "K"), (5, 9, "K"), (6, 9, "K"),
    ],
}


def parse_sketch() -> None:
    global PALETTE, SPRITE
    src = SKETCH.read_text(encoding="utf-8")

    block = re.search(r"const SPRITE = \[(.*?)\];", src, re.S).group(1)
    SPRITE = re.findall(r'"([^"]*)"', block)

    pal_block = re.search(r"const PALETTE = \{(.*?)\};", src, re.S).group(1)
    PALETTE = {}
    for key, hexcolor in re.findall(r'"?([A-Z.])"?:\s*(?:"(#[0-9a-fA-F]{6})"|null)', pal_block):
        if hexcolor:
            h = hexcolor.lstrip("#")
            PALETTE[key] = tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))
        else:
            PALETTE[key] = None


def dims() -> tuple[int, int]:
    return len(SPRITE[0]) * CELL, len(SPRITE) * CELL


# Espelha sketch.js: poseFor()
def pose_for(name: str, t: float, frame: int) -> dict:
    if name == "happy":
        hop = abs(math.sin(t * 6))
        return {"yOff": -hop * 10, "squash": 0.08 if hop > 0.6 else -0.06, "expr": "happy", "beakOpen": True}
    if name == "sad":
        return {"yOff": 3 + math.sin(t * 1.5) * 1.5, "squash": 0.04, "expr": "sad", "beakOpen": False}
    return {
        "yOff": math.sin(t * 2) * 1.5,
        "squash": 0,
        "expr": "blink" if frame % 9 == 0 else "neutral",
        "beakOpen": False,
    }


def draw_sprite(pose) -> Image.Image:
    w, h = dims()
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    def cell(col, row, color):
        d.rectangle(
            [col * CELL, row * CELL, (col + 1) * CELL - 1, (row + 1) * CELL - 1],
            fill=color + (255,),
        )

    grid: dict[tuple[int, int], str] = {}
    for row, line in enumerate(SPRITE):
        for col, ch in enumerate(line):
            if PALETTE.get(ch):
                grid[(row, col)] = ch

    if pose["expr"] != "blink":
        for row, col, ch in EYE_CELLS[pose["expr"]]:
            grid[(row, col)] = ch

    if pose["beakOpen"]:
        for col in range(6, 9):
            grid[(10, col)] = "O"

    for row in range(-1, len(SPRITE) + 1):
        for col in range(-1, len(SPRITE[0]) + 1):
            if (row, col) in grid:
                continue
            neighbors = [(row + 1, col), (row - 1, col), (row, col + 1), (row, col - 1)]
            if any(n in grid for n in neighbors):
                cell(col, row, OUTLINE)

    for (row, col), ch in grid.items():
        cell(col, row, PALETTE[ch])

    return img


def render_frame(pose) -> Image.Image:
    w, h = dims()
    canvas = max(w, h) + 40
    frame = Image.new("RGB", (canvas, canvas), BG)
    sw = w * (1 + pose["squash"])
    sh = h * (1 - pose["squash"])
    cx, cy = canvas / 2, canvas / 2
    sp = draw_sprite(pose).resize((max(1, round(sw)), max(1, round(sh))))
    frame.paste(sp, (round(cx - sw / 2), round(cy - sh / 2 + pose["yOff"])), sp)
    return frame


def main() -> int:
    parse_sketch()
    OUT.mkdir(exist_ok=True)
    canvas = max(dims()) + 40

    rows = []
    for name in ("idle", "happy", "sad"):
        frames = []
        for f in range(FRAMES):
            t = (f / FRAMES) * 4.0
            frames.append(render_frame(pose_for(name, t, f)))

        strip = Image.new("RGB", (canvas * FRAMES, canvas), BG)
        for i, fr in enumerate(frames):
            strip.paste(fr, (i * canvas, 0))
        strip.save(OUT / f"{name}.png")

        frames[0].save(
            OUT / f"{name}.gif",
            save_all=True,
            append_images=frames[1:],
            duration=110,
            loop=0,
        )
        rows.append(strip)
        print(f"{name}: {FRAMES} frames -> {name}.png / {name}.gif")

    allimg = Image.new("RGB", (canvas * FRAMES, canvas * len(rows)), BG)
    for i, strip in enumerate(rows):
        allimg.paste(strip, (0, i * canvas))
    allimg.save(OUT / "all.png")
    print(f"all.png -> {allimg.size[0]}x{allimg.size[1]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
