#!/usr/bin/env python3
"""Valida histórias JSON do FranGoLingo.

Uso:
    python tools/validate_story.py [caminho ...]

Sem argumento, valida todas em content/stories.
Com --audio, também checa se os arquivos de áudio existem.
"""
from __future__ import annotations

import sys
from pathlib import Path

from story_lib import find_stories, load_story, validate_story

REPO = Path(__file__).resolve().parent.parent
STORIES = REPO / "content" / "stories"
AUDIO = REPO / "content" / "audio"


def main(argv: list[str]) -> int:
    check_audio = "--audio" in argv
    args = [a for a in argv if not a.startswith("--")]

    if args:
        paths = [Path(a) for a in args]
    else:
        paths = find_stories(STORIES)

    if not paths:
        print("nenhuma história encontrada")
        return 1

    total_errors = 0
    for path in paths:
        errors = validate_story(load_story(path), AUDIO if check_audio else None)
        status = "OK  " if not errors else "FAIL"
        print(f"[{status}] {path.relative_to(REPO)}")
        for err in errors:
            print(f"    - {err}")
        total_errors += len(errors)

    print(f"\n{len(paths)} história(s), {total_errors} erro(s)")
    return 1 if total_errors else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
