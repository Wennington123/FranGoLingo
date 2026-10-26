# FranGoLingo — Árvore de Desenvolvimento

Aprender francês por histórias interativas, offline-first, open-source.
Filosofia: começar simples e funcionar ponta-a-ponta antes de escalar.

## Princípios

1. **Conteúdo fora do bundle.** Leve no boot. Lições são pacotes baixáveis + cache local. Igual Duolingo faz.
2. **Vertical slice primeiro.** Uma história FR-A1 completa (texto + tradução + gloss por palavra + áudio + 2 exercícios) funcionando ponta-a-ponta vale mais que 50 telas vazias.
3. **Pipeline > digitação.** Python gera/valida JSON e áudio. Humano escreve texto bruto, script faz o resto.
4. **Dados são o produto.** Schema estável e versionado; app só interpreta.
5. **Progressão pedagógica explícita.** Organizar atividades por decodificação, relações grafema-fonema, sílabas, leitura em voz alta, compreensão e escrita, adaptando a referência do guia francês ao objetivo pt-BR → francês.

Referência metodológica: *Pour enseigner la lecture et l’écriture au CP*, Ministério da Educação Nacional francês, edição de agosto de 2019, ISBN 978-2-11-152104-9. O guia orienta a metodologia, mas não é conteúdo redistribuído pelo aplicativo.

## Fases

### Fase 0 — Fundação (concluída)
- [x] Repo + estrutura
- [x] Schema de história (`docs/data-schema.md`)
- [x] 1 história FR-A1 de exemplo
- [x] Pipeline Python: validar + TTS
- [x] Esqueleto app (trilha / leitor / revisão)

### Fase 1 — Leitor real (concluída, com pendência de áudio)
- [x] Renderização progressiva linha-a-linha com áudio
- [x] Tooltip por palavra (gloss de `tokens`)
- [x] Exercícios: completar lacuna + compreensão
- [x] Lógica de vidas (Zustand) + animação acerto/erro
- [x] Mascote Frango em RN (`Mascot.tsx`, mesmo sprite do p5)
- [x] Tutorial de primeira-uso (onboarding) + dica no leitor
- [ ] Áudio TTS das histórias 02 e 03 (só `01-au-cafe` tem `.mp3`)

### Fase 2 — Persistência (atual)
- [ ] `expo-sqlite`: progresso, histórias desbloqueadas, log de erros
- [ ] Persistir estado de onboarding (tutorial não reaparecer)
- [ ] Tela Revisão consolidando erros e permitindo refazer/remover

### Fase 3 — Conteúdo escalável e identidade visual
- Loader de pacote de conteúdo (zip) baixável + cache
- Áudio: baixar sob demanda, não embutir
- Script de ingestão de glossário (FreeDict/OMW) e frases (Tatoeba)
- Mascote Frango: sketch p5 (`mascot/`) → sprite sheet → app (ver `docs/mascot.md`)
- Política de áudio: Lingua Libre para palavras; Piper com voz FR auditada no pipeline de frases; nunca distribuir áudio gerado por `edge-tts`. Manifest com autor/licença por arquivo (ver `docs/content-sources.md`)

### Fase 4 — Autoria
- Formato de fonte simples (YAML/MD) para colaborador escrever história
- `tools/build_story.py`: fonte → JSON validado
- Documentação de contribuição

### Fase 5 — Distribuição
- EAS Build → APK/AAB
- Play Store: privacy policy, data safety
- Release open-source no GitHub

## Stack
- App: React Native + Expo, React Navigation, Zustand, `expo-sqlite`, `expo-audio`, `react-native-svg`
- Pipeline: Python 3 (`edge-tts`, `jsonschema`)
- Conteúdo: JSON versionado
