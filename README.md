# FranGoLingo

Aprender francês por **histórias interativas**, offline-first, open-source.
Modelo inspirado no Duolingo Stories — app independente, sem uso de assets ou conteúdo do Duolingo.

## Estrutura

```
content/stories/    histórias em JSON (versionadas)
content/audio/      áudio TTS gerado (gitignored, reconstruível)
docs/               schema de dados + fontes de conteúdo gratuitas
tools/              pipeline Python (validar + TTS)
app/                aplicativo Expo / React Native
ROADMAP.md          árvore de desenvolvimento por fases
```

## Pipeline de conteúdo

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r tools/requirements.txt

# validar todas as histórias
python tools/validate_story.py

# validar incluindo existência dos áudios
python tools/validate_story.py --audio

# gerar áudio TTS de uma história
python tools/generate_audio.py content/stories/fr/a1/01-au-cafe.json

# copiar o áudio para o bundle do app + gerar o mapa de requires
python tools/export_app_audio.py
```

## App

```bash
cd app
npm install
npx expo start
```

Estado atual: esqueleto (Fase 0). Ver `ROADMAP.md`.

## Build do APK (CI)

Push em `main` (ou Actions → run manual) builda o APK no GitHub Actions e sobe como artefato. Ver `docs/ci.md`.

## Licença

Conteúdo e código pensados para redistribuição livre. Checar licença de fontes externas antes de embarcar (`docs/content-sources.md`).
