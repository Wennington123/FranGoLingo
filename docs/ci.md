# CI — build do APK (GitHub Actions)

Workflow: `.github/workflows/android.yml`.

## O que faz

Em push para `main`, PR, ou manual (`workflow_dispatch`):

1. Node 22 + Java 17 (Temurin)
2. `npm install`
3. `npm run typecheck` (bloqueante — falha o build se houver erro de tipo)
4. `expo prebuild --platform android`
5. `./gradlew assembleDebug` ou `assembleRelease`, conforme o input `build_type` do `workflow_dispatch`
6. Sobe o APK como artefato `frangolingo-android-debug` ou `frangolingo-android-release`

No run manual, o padrão é `debug`. Push/PR continuam buildando `release`.

Baixar o APK: aba **Actions** → run → **Artifacts**.

## Por que sem EAS

Não precisa de conta Expo nem `EXPO_TOKEN`. Roda direto no runner. Repo open-source = minutos grátis de Actions.

## Assinatura

`expo prebuild` gera `android/app/build.gradle` com `release` usando a keystore **debug** por padrão. Então o APK instala em qualquer device (sideload), mas **não serve para Play Store** (Play exige keystore própria + AAB).

### Play Store (quando chegar a hora)

1. Gerar keystore:
   ```bash
   keytool -genkeypair -v -keystore upload.keystore -alias upload \
     -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Guardar em secrets: `ANDROID_KEYSTORE_BASE64` (base64 do arquivo), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
3. No workflow, decodificar o keystore e mapear para `android/gradle.properties`
   (`MYAPP_UPLOAD_STORE_FILE`, `MYAPP_UPLOAD_STORE_PASSWORD`, `MYAPP_UPLOAD_KEY_ALIAS`, `MYAPP_UPLOAD_KEY_PASSWORD`).
4. Trocar o passo por `./gradlew bundleRelease` e subir o `.aab`.

## Alternativa: EAS Build

Se preferir build na nuvem da Expo (gera APK/AAB, cuida de assinatura):

```yaml
- uses: expo/expo-github-action@v8
  with:
    eas-version: latest
    token: ${{ secrets.EXPO_TOKEN }}
- run: eas build --platform android --profile preview --non-interactive
```

Requer conta Expo e `eas.json`. Mais simples de assinar, menos controle e com fila/cota.
