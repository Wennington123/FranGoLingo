#!/usr/bin/env python3
"""Gera áudio TTS para cada nó do tipo `line` de uma história.

Usa edge-tts (vozes neurais Microsoft, sem chave de API).

Uso:
    python tools/generate_audio.py content/stories/fr/a1/01-au-cafe.json
    python tools/generate_audio.py <arquivo> --voice fr-FR-HenriNeural

Saída: content/audio/<audio path do nó>. Reexecuta só o que faltar, a menos
que --force seja passado.
"""
from __future__ import annotations

import argparse
import asyncio
from pathlib import Path

from story_lib import load_story

REPO = Path(__file__).resolve().parent.parent
AUDIO_ROOT = REPO / "content" / "audio"

VOICE_BY_SPEAKER = {
    "Serveur": "fr-FR-HenriNeural",
    "Client": "fr-FR-DeniseNeural",
}
DEFAULT_VOICE = "fr-FR-DeniseNeural"


async def _synthesize(text: str, out_path: Path, voice: str, rate: str) -> None:
    import edge_tts

    out_path.parent.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(text, voice, rate=rate)
    await communicate.save(str(out_path))


async def run(story_path: Path, voice: str | None, rate: str, force: bool) -> int:
    story = load_story(story_path)
    jobs = []
    for node in story["nodes"]:
        if node.get("type") != "line" or not node.get("audio"):
            continue
        out = AUDIO_ROOT / node["audio"]
        if out.exists() and not force:
            print(f"skip {node['audio']} (existe)")
            continue
        node_voice = voice or VOICE_BY_SPEAKER.get(node.get("speaker", ""), DEFAULT_VOICE)
        jobs.append((node["text"], out, node_voice))

    for text, out, node_voice in jobs:
        print(f"gerando {out.relative_to(REPO)} [{node_voice}]")
        await _synthesize(text, out, node_voice, rate)

    print(f"\n{len(jobs)} gerado(s)")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("story", type=Path)
    parser.add_argument("--voice", default=None, help="força uma voz para todos os nós")
    parser.add_argument("--rate", default="+0%", help="ex.: -10%%")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    return asyncio.run(run(args.story.resolve(), args.voice, args.rate, args.force))


if __name__ == "__main__":
    raise SystemExit(main())
