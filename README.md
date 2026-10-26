# FranGoLingo

Aprender francês por **histórias interativas**, offline-first, open-source.
Modelo inspirado no Duolingo Stories — app independente, sem uso de assets ou conteúdo do Duolingo.

## Referência pedagógica

A estrutura de progressão também considera o guia oficial francês **Pour enseigner la lecture et l’écriture au CP**, coordenado pelo Ministério da Educação Nacional francês, edição de agosto de 2019, ISBN 978-2-11-152104-9. Usamos suas orientações como referência metodológica para organizar decodificação, relações grafema-fonema, leitura em voz alta, compreensão e escrita; o guia não é conteúdo do aplicativo.

O arquivo local `guide-pour-enseigner-la-lecture-et-l-ecriture-au-cp-67854.md` é mantido como material de referência. Consulte a edição oficial e seus termos antes de redistribuir qualquer trecho ou material derivado.

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

Estado atual: leitor interativo funcionando ponta-a-ponta (Fase 1) com 3 histórias FR-A1. A persistência de progresso (Fase 2) ainda é em memória — fechar o app zera XP, corações e conclusões. Áudio TTS só está embutido para `01-au-cafe`; as histórias 02 e 03 ainda não têm `.mp3`. Ver `ROADMAP.md`.

## Build do APK (CI)

Push em `main` (ou Actions → run manual) builda o APK no GitHub Actions e sobe como artefato. Ver `docs/ci.md`.

## Licença

Conteúdo e código pensados para redistribuição livre. Checar licença de fontes externas antes de embarcar (`docs/content-sources.md`).
