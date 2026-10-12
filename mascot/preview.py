#!/usr/bin/env python3
"""Renderiza frames do mascote a partir de mascot/sketch.js.

Reusa o SPRITE/PALETTE do sketch e replica poseFor() para gerar:
    mascot/preview/<anim>.png  (tira de 8 frames)
    mascot/preview/<anim>.gif  (animado)
    mascot/preview/all.png     (as 3 animações empilhadas)

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

PALETTE: dict[str, tuple[int, int, int] | None] = {}
SPRITE: list[str] = []


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
        return {
            "yOff": -hop * 22,
            "squash": 0.08 if hop > 0.6 else -0.06,
            "blink": False,
            "beakOpen": True,
            "shadow": 1 - hop * 0.5,
        }
    if name == "sad":
        return {
            "yOff": 6 + math.sin(t * 1.5) * 2,
            "squash": 0.05,
            "blink": frame % 8 < 2,
            "beakOpen": False,
            "shadow": 1.1,
        }
    return {
        "yOff": math.sin(t * 2) * 2,
        "squash": 0,
        "blink": frame % 8 == 0,
        "beakOpen": False,
        "shadow": 1,
    }


def draw_sprite(pose) -> Image.Image:
    w, h = dims()
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for row, line in enumerate(SPRITE):
        for col, ch in enumerate(line):
            if ch == "K" and pose["blink"]:
                continue
            color = PALETTE.get(ch)
            if color is None:
                continue
            d.rectangle(
                [col * CELL, row * CELL, (col + 1) * CELL - 1, (row + 1) * CELL - 1],
                fill=color + (255,),
            )
    if pose["beakOpen"]:
        for col in range(12, 14):
            d.rectangle(
                [col * CELL, 7 * CELL, (col + 1) * CELL - 1, 8 * CELL - 1],
                fill=PALETTE["O"] + (255,),
            )
    return img


def render_frame(pose) -> Image.Image:
    w, h = dims()
    canvas = max(w, h) + 60
    frame = Image.new("RGB", (canvas, canvas), BG)
    d = ImageDraw.Draw(frame)

    cx, cy = canvas // 2, canvas // 2
    sw = w * (1 + pose["squash"])
    sh = h * (1 - pose["squash"])

    shadow_w = w * 0.9 * pose["shadow"]
    d.ellipse(
        [cx - shadow_w / 2, cy + h / 2 + 4, cx + shadow_w / 2, cy + h / 2 + 18],
        fill=(0, 0, 0),
    )

    sp = draw_sprite(pose).resize((max(1, round(sw)), max(1, round(sh))))
    frame.paste(sp, (round(cx - sw / 2), round(cy - sh / 2 + pose["yOff"])), sp)
    return frame


def main() -> int:
    parse_sketch()
    OUT.mkdir(exist_ok=True)
    canvas = max(dims()) + 60

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
