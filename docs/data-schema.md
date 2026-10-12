# Schema de História

Um arquivo JSON por história. Local: `content/stories/<lang>/<level>/<id>.json`.

## Campos raiz

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Identificador único e estável. Casa com o nome do arquivo. |
| `title` | string | Título no idioma-alvo. |
| `level` | string | `A1`..`C1` (CEFR). |
| `language` | string | Idioma-alvo, ISO 639-1 (`fr`). |
| `nativeLanguage` | string | Idioma de apoio (`pt-BR`). |
| `tags` | string[] | Tema (`food`, `greetings`). |
| `keyVocabulary` | object[] | Vocabulário-chave: `{ word, translation }`. |
| `nodes` | node[] | Array ordenado de nós, reproduzido em sequência. |

## Tipos de nó

### `line`
Uma fala/texto. É o que o leitor renderiza.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | Único dentro da história. |
| `type` | `"line"` | |
| `speaker` | string? | Personagem (opcional, narração se ausente). |
| `text` | string | Texto no idioma-alvo. |
| `translation` | string | Tradução da frase. |
| `audio` | string | Caminho relativo do áudio, ex. `<id>/<nodeId>.mp3`. |
| `tokens` | token[] | Texto quebrado em tokens tocáveis (para tooltip). |

`token` = `{ "t": string, "gloss": string|null }`.
- `t`: superfície exata (inclui pontuação e elisão: `l'`, `d'`, `au`).
- `gloss`: tradução da palavra no contexto, ou `null` para pontuação.
- Regra: concatenar todos os `t` (separados por espaço exceto pontuação) deve reconstruir `text`. O validador checa isso.

### `exercise`
Interrupção que força interação.

Campos comuns: `id`, `type: "exercise"`, `exerciseType`, `explanation`.

**`exerciseType: "fill_blank"`**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `sentence` | string[] | Frase em pedaços; o pedaço em `blankIndex` é a lacuna. |
| `blankIndex` | number | Índice da lacuna em `sentence`. |
| `options` | string[] | Alternativas (múltipla escolha). |
| `answer` | string | Alternativa correta. |

**`exerciseType: "comprehension"`**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `question` | string | Pergunta no idioma nativo. |
| `options` | string[] | Alternativas. |
| `answer` | string | Alternativa correta. |

## Exemplo mínimo

```json
{
  "id": "fr-a1-01-au-cafe",
  "title": "Au café",
  "level": "A1",
  "language": "fr",
  "nativeLanguage": "pt-BR",
  "nodes": [
    {
      "id": "n1",
      "type": "line",
      "text": "Bonjour !",
      "translation": "Olá!",
      "audio": "fr-a1-01-au-cafe/n1.mp3",
      "tokens": [
        { "t": "Bonjour", "gloss": "Olá" },
        { "t": "!", "gloss": null }
      ]
    }
  ]
}
```
