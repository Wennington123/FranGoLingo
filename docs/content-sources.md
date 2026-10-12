# Fontes de Conteúdo Gratuitas

Todas verificáveis e com licença compatível com redistribuição (checar licença exata antes de embarcar). Nada aqui é asset do Duolingo.

## Áudio

| Fonte | Conteúdo | Licença | Uso |
|-------|----------|---------|-----|
| **Lingua Libre** (Wikimedia) | Palavras/expressões FR gravadas por nativos | CC-BY-SA | Clipes por palavra |
| **Wikimedia Commons / Wiktionary** | Pronúncia de palavras FR | CC | Clipes por palavra |
| **Tatoeba** | Frases FR com áudio | CC-BY 2.0 FR | Frases curtas |
| **Mozilla Common Voice** | Dataset de fala FR | CC0 | Treino/fine-tune TTS |

## TTS (gera áudio, não baixa)

| Ferramenta | Nota | Licença |
|------------|------|---------|
| **edge-tts** | Vozes neurais Microsoft, sem chave de API | MIT (cliente) |
| **Piper** | Offline, local, vozes FR boas, rápido | MIT |
| **Coqui XTTS** | Clonagem de voz | MPL/Coqui |
| **espeak-ng** | Robótico, fallback | GPL |

Evitar: **Forvo** — pronúncia humana, mas licença restritiva para redistribuir.

## Tradução ptbr↔fr

| Fonte | Tipo | Licença | Uso |
|-------|------|---------|-----|
| **Tatoeba** | Pares fra→por humanos | CC-BY 2.0 FR | Frases |
| **Argos Translate / LibreTranslate** | MT neural offline | MIT/GPL | Geração de base |
| **OPUS (OpenSubtitles etc.)** | Corpus paralelo fra-por | Variada | Treino/casamento |
| **FreeDict fra-por** | Dicionário | GPL | Palavra→palavra |
| **Open Multilingual WordNet (OMW)** | fr + pt ligados por ILI | MIT (alguns) | Palavra→palavra por sentido |

## Estratégia

1. **Frase:** Tatoeba (humano) como base; Argos Translate como fallback/revisão.
2. **Palavra (gloss de tooltip):** OMW/FreeDict como rascunho; revisor humano ajusta o `gloss` no contexto.
3. **Áudio:** começar com `edge-tts` (rápido). Migrar para Lingua Libre/gravação nativa onde existir clipe humano.
