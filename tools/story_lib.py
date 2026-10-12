"""Schema + helpers para histórias do FranGoLingo.

Regra central: concatenar os `t` dos tokens (com espaço entre palavras, sem
espaço antes de pontuação de fechamento ou após apóstrofo de elisão) reproduz
o `text` do nó. O validador garante isso.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

CLOSING_PUNCT = set(",.!?;:…»)")

LEVELS = {"A1", "A2", "B1", "B2", "C1"}
NODE_TYPES = {"line", "exercise"}
EXERCISE_TYPES = {"fill_blank", "comprehension"}


def _is_punct(token: str) -> bool:
    return bool(token) and all(ch in CLOSING_PUNCT for ch in token)


def reconstruct_text(tokens: list[dict]) -> str:
    """Reconstrói o texto a partir dos tokens, seguindo a regra de espaçamento."""
    out = ""
    prev = ""
    for i, tok in enumerate(tokens):
        t = tok["t"]
        if i == 0:
            out = t
        elif _is_punct(t) or prev.endswith("'"):
            out += t
        else:
            out += " " + t
        prev = t
    return out


def find_stories(root: Path) -> list[Path]:
    return sorted(root.glob("**/*.json"))


def load_story(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def validate_story(story: dict, audio_root: Path | None = None) -> list[str]:
    """Retorna lista de erros. Vazia = válido."""
    errors: list[str] = []
    sid = story.get("id", "<sem id>")

    for field in ("id", "title", "level", "language", "nativeLanguage", "nodes"):
        if field not in story:
            errors.append(f"{sid}: campo raiz obrigatório ausente: {field}")

    if story.get("level") and story["level"] not in LEVELS:
        errors.append(f"{sid}: level inválido: {story['level']}")

    nodes = story.get("nodes", [])
    if not nodes:
        errors.append(f"{sid}: história sem nós")

    seen_ids: set[str] = set()
    for idx, node in enumerate(nodes):
        nid = node.get("id", f"<nó {idx}>")
        where = f"{sid}/{nid}"

        if nid in seen_ids:
            errors.append(f"{where}: id de nó duplicado")
        seen_ids.add(nid)

        ntype = node.get("type")
        if ntype not in NODE_TYPES:
            errors.append(f"{where}: type inválido: {ntype}")
            continue

        if ntype == "line":
            errors.extend(_validate_line(node, where, audio_root))
        else:
            errors.extend(_validate_exercise(node, where))

    return errors


def _validate_line(node: dict, where: str, audio_root: Path | None) -> list[str]:
    errors: list[str] = []
    for field in ("text", "translation", "tokens"):
        if field not in node:
            errors.append(f"{where}: campo ausente: {field}")

    tokens = node.get("tokens", [])
    if tokens:
        for j, tok in enumerate(tokens):
            if "t" not in tok or "gloss" not in tok:
                errors.append(f"{where}/token {j}: precisa de 't' e 'gloss'")
        if all("t" in tok for tok in tokens):
            got = reconstruct_text(tokens)
            if got != node.get("text"):
                errors.append(f"{where}: tokens não reconstroem text\n    esperado: {node.get('text')!r}\n    obtido:   {got!r}")

    audio = node.get("audio")
    if audio and audio_root is not None:
        if not (audio_root / audio).exists():
            errors.append(f"{where}: áudio ausente: {audio}")

    return errors


def _validate_exercise(node: dict, where: str) -> list[str]:
    errors: list[str] = []
    etype = node.get("exerciseType")
    if etype not in EXERCISE_TYPES:
        errors.append(f"{where}: exerciseType inválido: {etype}")
        return errors

    if etype == "fill_blank":
        sentence = node.get("sentence", [])
        blank = node.get("blankIndex")
        if not isinstance(blank, int) or not (0 <= blank < len(sentence)):
            errors.append(f"{where}: blankIndex fora do intervalo de sentence")
        elif sentence[blank] != "__":
            errors.append(f"{where}: posição de blankIndex deveria ser '__'")

    options = node.get("options", [])
    answer = node.get("answer")
    if len(options) < 2:
        errors.append(f"{where}: precisa de ao menos 2 opções")
    if answer not in options:
        errors.append(f"{where}: answer não está entre options")

    return errors
