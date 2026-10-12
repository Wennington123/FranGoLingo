#!/usr/bin/env python3
"""Gera o ícone do app a partir da cara do frango (mascot/sketch.js).

Saída:
    app/assets/icon.png           1024x1024, fundo azul (ícone principal)
    app/assets/adaptive-icon.png  1024x1024, transparente (foreground Android)

Uso:
    python mascot/make_icon.py
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import preview as p  # noqa: E402

ASSETS = HERE.parent / "app" / "assets"
SIZE = 1024
BG = (37, 99, 235, 255)  # #2563eb


def face_neutral(factor: int) -> Image.Image:
    p.parse_sketch()
    img = p.draw_sprite({"expr": "neutral", "beakOpen": False})
    return img.resize((img.width * factor, img.height * factor), Image.NEAREST)


def compose(face: Image.Image, size: int, scale: float, bg: tuple[int, int, int, int] | None) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), bg) if bg else Image.new("RGBA", (size, size), (0, 0, 0, 0))
    target_w = int(size * scale)
    ratio = target_w / face.width
    f = face.resize((int(face.width * ratio), int(face.height * ratio)), Image.NEAREST)
    canvas.alpha_composite(f, ((size - f.width) // 2, (size - f.height) // 2))
    return canvas


def main() -> int:
    ASSETS.mkdir(parents=True, exist_ok=True)
    face = face_neutral(4)

    icon = compose(face, SIZE, 0.72, BG)
    icon.convert("RGB").save(ASSETS / "icon.png")

    adaptive = compose(face, SIZE, 0.58, None)
    adaptive.save(ASSETS / "adaptive-icon.png")

    print(f"icon.png + adaptive-icon.png -> {ASSETS}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
