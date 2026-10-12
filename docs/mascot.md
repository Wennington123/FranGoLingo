# Mascote — Frango em pixel

Desenhado/animado com [p5.js](https://editor.p5js.org). Nome do mascote combina com o app: **FranGoLingo** → *Frango*.

## Onde

- `mascot/sketch.js` — sketch p5
- `mascot/index.html` — abre local (só dar duplo-clique ou `python -m http.server`)

No editor.p5js.org: criar sketch novo e colar o conteúdo de `sketch.js`.

## Controles

- **clique / barra de espaço** — troca animação: `idle` → `happy` → `sad`
- **S** — baixa `frango_<anim>_sheet.png` (sprite sheet com 8 frames)

## Como o sprite funciona

- `SPRITE`: mapa de pixel art 16×16 em texto. Cada caractere = 1 pixel, via `PALETTE`.
  Editar é só mexer nas strings (`.` = transparente).
- `poseFor(anim, t)`: devolve a pose (deslocamento vertical, squash, piscar, bico aberto) por animação. Animação é **procedural** sobre um sprite só — sem desenhar 8 quadros à mão.

## Integração no app (importante)

Existe `app/src/components/Mascot.tsx`: **mesmo sprite** do p5 portado para React Native (pixel art com `View`s, sem asset PNG). Anima `idle`/`happy`/`sad` com `setInterval`. Usado no onboarding e pode ir na tela de resultado.

Alternativa (p5 → asset):

1. Animou no p5 (editor ou local).
2. `S` exporta `frango_<anim>_sheet.png`.
3. Copiar PNG para `app/assets/mascot/`.
4. Tocar o sprite sheet no app com:
   - `react-native-svg` se quiser vetor, ou
   - `Image` + troca de offset (sprite animation), ou
   - `react-native-skia` para animação fluida, ou
   - converter o sheet em GIF/`expo-image` animado.

## Preview local (sem browser)

```bash
python mascot/preview.py
```
Gera `mascot/preview/{idle,happy,sad}.gif`, `<anim>.png` (tira de frames) e `all.png` (3 animações empilhadas). Reusa `SPRITE`/`PALETTE` do `sketch.js`.

## Mapeamento de estado → animação

| App | Animação |
|-----|----------|
| Trilha / ocioso | `idle` |
| Acerto / subir de nível | `happy` |
| Erro / perdeu vida | `sad` |

## Alternativas ao p5 (se quiser animação nativa)

- **Rive** — animação interativa, runtime RN, ótimo para mascote.
- **Lottie** (`lottie-react-native`) — After Effects → JSON.
- **react-native-skia** — desenhar/animar direto no RN, sem export.
