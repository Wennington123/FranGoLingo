# Fontes de Conteúdo Gratuitas

Todas verificáveis e com licença compatível com redistribuição (checar licença exata por arquivo antes de embarcar). Nada aqui é asset do Duolingo.

## Áudio humano

| Fonte | Conteúdo | Licença | Uso |
|-------|----------|---------|-----|
| **Lingua Libre** (Wikimedia France) | Palavras/expressões FR gravadas por nativos | CC BY-SA 4.0 ou CC0 por arquivo | Clipes por palavra |
| **Wikimedia Commons / Wiktionary** | Pronúncia de palavras FR | Frequente CC BY-SA / CC0 | Clipes por palavra |
| **Tatoeba** | Frases FR com áudio | Texto CC BY 2.0 FR; áudio CC BY (verificar por frase) | Frases curtas |
| **Mozilla Common Voice** | Frases inteiras validadas por nativos | CC0 (via Mozilla Data Collective) | Listening com sotaques reais |
| **CML-TTS** (OpenSLR 146) | Audiobooks LibriVox em FR (~31 GB) | **CC BY 4.0** (não é domínio público) | Leitura avançada; baixa prioridade |

Notas de acesso:

- **Lingua Libre:** os dumps oficiais estão parados desde 2022. O caminho atual é consultar as categorias do Commons (`Category:Lingua Libre pronunciation by language`) e baixar com `wikiget`/Petscan, ou usar a API por palavra. Baixar o corpus inteiro não faz sentido para o app; buscar só o vocabulário das histórias.
- **Common Voice:** a distribuição saiu do site antigo e agora é feita pelo Mozilla Data Collective (conta e termos de uso). As frases não vão casar com as falas autorais das nossas histórias; serve melhor para exercícios de listening separados.
- **CML-TTS:** a embalagem do dataset é CC BY 4.0, mesmo que as gravações originais do LibriVox sejam de domínio público. Exige atribuição.
- Evitar **Forvo** — pronúncia humana, mas API paga e ToS restritivas para redistribuir.

## TTS (gera áudio, não baixa)

| Ferramenta | Licença real | Nota |
|------------|--------------|------|
| **Piper** | Código **GPL-3.0** (`OHF-Voice/piper1-gpl`); modelos de voz com licença própria | `rhasspy/piper` foi arquivado em out/2025. Auditar a licença de cada voz FR (há vozes CC BY 4.0 e research-only). Melhor uso: pipeline, não embarcar no APK. |
| **edge-tts** | Cliente GPL-3.0 de endpoint **não oficial** do Microsoft Edge | Não usar para áudio distribuído; termos do áudio gerado não são claros e o endpoint pode bloquear. Manter só como fallback de desenvolvimento. |
| **Coqui TTS / XTTS v2** | Código MPL-2.0; **pesos sob CPML (não comercial)** | Não usar em produto distribuído. |
| **EasyTTS** | Código MIT | Beta (poucos commits), depende do corpus SynPaFlex (licença de pesquisa). Não recomendado. |
| **espeak-ng** | GPL-3.0 | Robótico; fallback. |

## Tradução ptbr↔fr

| Fonte | Tipo | Licença | Uso |
|-------|------|---------|-----|
| **Tatoeba** | Pares fra→por humanos | CC-BY 2.0 FR | Frases |
| **Argos Translate / LibreTranslate** | MT neural offline | MIT/GPL | Geração de base |
| **OPUS (OpenSubtitles etc.)** | Corpus paralelo fra-por | Variada | Treino/casamento |
| **FreeDict fra-por** | Dicionário | GPL | Palavra→palavra |
| **Open Multilingual WordNet (OMW)** | fr + pt ligados por ILI | MIT (alguns) | Palavra→palavra por sentido |

## Decks Anki FR–PT-BR (referência, não fonte de assets)

| Deck | Conteúdo | Licença/uso |
|------|----------|-------------|
| **AnkiWeb "Francês para Português (+1000 palavras e expressões)"** (1792738210) | frente em francês com áudio, verso em português | Licença não declarada; usar só estrutura/vocabulário, não redistribuir áudio |
| **AnkiWeb "francês iniciante ao avançado"** (569671098) | progressão iniciante→avançado | Licença não declarada; referência de currículo |
| **AnkiWeb "Portugais du Brésil — Vocabulaire avancé"** (1488225311) | PT→FR, áudio gerado com WaveNet | Direção inversa; áudio TTS, não redistribuir |
| **AnkiDecks "Français - Portugais"** (103 cards) | vocabulário FR-PT | Sem áudio; licença não declarada |

**Política:** decks Anki são úteis para copiar a *estrutura* (campos, tags, níveis CEFR) e conferir vocabulário. O AnkiWeb não aplica licença aberta por padrão e muitos decks usam áudio de TTS/Forvo, então não incorporamos áudio nem texto desses decks no app. Áudio continua vindo de Lingua Libre/Tatoeba/Common Voice ou Piper com voz auditada.

## Arquitetura de áudio recomendada

O app é offline-first (React Native + Expo), sem backend. Então:

1. **Palavras (tooltip/vocabulário):** buscar clipes do Lingua Libre para as palavras que realmente aparecem nas histórias, normalizar com `ffmpeg` (mono, opus/mp3 ~24–32 kbps) e versionar em `content/audio/words/`. Isso mantém o APK pequeno e usa voz humana real.
2. **Falas das histórias:** gerar no pipeline de build com TTS de licença auditada (Piper com voz FR verificada) ou usar Tatoeba/Common Voice quando a frase já existir em licença livre. Preferir sempre voz humana quando houver correspondência.
3. **Texto dinâmico:** se necessário, `expo-speech` (TTS do sistema operacional). O cliente é MIT e não exige servidor, mas a voz/modelo é do dispositivo, não é FOSS.
4. **Atribuição:** manifest de áudio com `source`, `author` e `license` por arquivo + `content/audio/ATTRIBUTION.md` e tela de créditos. O validador deve recusar áudio sem metadados de licença.
5. **Pacote baixável (Fase 3):** conteúdo extra e áudio sob demanda em zip, para não engordar o APK.

## Estratégia

1. **Frase:** Tatoeba/Common Voice (humano) como base; Argos Translate como fallback/revisão; Piper no pipeline para o que não existir.
2. **Palavra (gloss de tooltip):** OMW/FreeDict como rascunho; revisor humano ajusta o `gloss` no contexto.
3. **Áudio de palavra:** Lingua Libre como fonte primária; gravação própria quando a palavra não existir.
4. **Áudio de frase:** TTS com licença auditada; nunca distribuir áudio gerado por `edge-tts`.
