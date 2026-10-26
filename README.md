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

Estado atual: leitor interativo funcionando ponta-a-ponta (Fase 1) com 3 histórias FR-A1. Ícones e áudio são embutidos nativamente no build: a fonte vai para `assets/fonts` via `expo-font` e os áudios para `res/raw` via `plugins/withAudioAssets.js`, contornando o bug de resolução de assets do `expo-audio` 0.3.x em release. A persistência de progresso (Fase 2) ainda é em memória — fechar o app zera XP, corações e conclusões. Áudio TTS só existe para `01-au-cafe`; as histórias 02 e 03 mostram "Áudio em breve". Ver `ROADMAP.md`.

## Debug local (Android)

Pré-requisitos: JDK 17, Android SDK (platform 35, build-tools 35, NDK 26.1) e um AVD x86_64 com KVM.

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
export QT_QPA_PLATFORM=xcb   # em Wayland, se a janela do emulador não abrir

emulator -avd FranGoLingo -gpu host -memory 2048 -cores 4 &
cd app
npx expo run:android
```

Para builds locais mais rápidos no emulador, compile só a ABI x86_64:

```bash
cd app/android
./gradlew assembleDebug -PreactNativeArchitectures=x86_64
```

O APK de debug não embute o bundle JS: mantenha o Metro (`npx expo start`) rodando. O APK de release é standalone e é o que o CI gera por padrão.

## Build do APK (CI)

Push em `main` ou PR builda o APK release. Em Actions → run manual (`workflow_dispatch`) dá para escolher `debug` ou `release`; o artefato sai como `frangolingo-android-<tipo>`. Ver `docs/ci.md`.

## Referências de conteúdo

- **Avangardix** (curso FR para brasileiros): `docs/reference/avangardix.md` — referência metodológica; não copiar exercícios/diálogos.
- **Decks Anki FR–PT-BR**: usados só como referência de estrutura/vocabulário. A maioria não declara licença e o áudio costuma vir de TTS/Forvo, então não redistribuímos esses assets. Ver `docs/content-sources.md`.

## Licença

Conteúdo e código pensados para redistribuição livre. Checar licença de fontes externas antes de embarcar (`docs/content-sources.md`).
