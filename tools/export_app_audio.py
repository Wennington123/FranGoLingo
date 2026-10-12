#!/usr/bin/env python3
"""Copia o áudio TTS para o bundle do app e gera o mapa de requires.

Saída:
    app/content/audio/**           cópia do áudio (versionada, entra no APK)
    app/src/data/audio.ts          mapa estático path -> require()

Rodar depois de tools/generate_audio.py.

Uso:
    python tools/export_app_audio.py
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SRC_AUDIO = REPO / "content" / "audio"
SRC_STORIES = REPO / "content" / "stories"
DST_AUDIO = REPO / "app" / "content" / "audio"
OUT_TS = REPO / "app" / "src" / "data" / "audio.ts"


def collect_paths() -> list[str]:
    paths: set[str] = set()
    for story_file in SRC_STORIES.glob("**/*.json"):
        story = json.loads(story_file.read_text(encoding="utf-8"))
        for node in story.get("nodes", []):
            if node.get("type") == "line" and node.get("audio"):
                paths.add(node["audio"])
    return sorted(paths)


def main() -> int:
    if not SRC_AUDIO.exists():
        print(f"nada em {SRC_AUDIO} — rode tools/generate_audio.py primeiro")
        return 1

    if DST_AUDIO.exists():
        shutil.rmtree(DST_AUDIO)
    shutil.copytree(SRC_AUDIO, DST_AUDIO)

    paths = collect_paths()
    present, missing = [], []
    for p in paths:
        (present if (DST_AUDIO / p).exists() else missing).append(p)

    lines = [
        "// GERADO por tools/export_app_audio.py — não editar à mão.",
        "export const AUDIO: Record<string, number> = {",
    ]
    for p in present:
        lines.append(f'  "{p}": require("../../content/audio/{p}"),')
    lines += [
        "};",
        "",
        "export function resolveAudio(path?: string): number | undefined {",
        "  return path ? AUDIO[path] : undefined;",
        "}",
        "",
    ]
    OUT_TS.write_text("\n".join(lines), encoding="utf-8")

    print(f"{len(present)} áudio(s) embutido(s) em {DST_AUDIO.relative_to(REPO)}")
    print(f"mapa: {OUT_TS.relative_to(REPO)}")
    for p in missing:
        print(f"    aviso: sem arquivo para {p}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
