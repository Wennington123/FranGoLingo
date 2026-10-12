Plano de engenharia reversa do Duolingo

Fase 1: Estruturação Pedagógica e Arquitetura de Dados

O coração do aplicativo não é a interface, mas como as histórias são interpretadas pelo código. Como o foco educacional precisa seguir uma progressão lógica de ensino, a estrutura de dados dita o ritmo do aprendizado.

    Modelagem JSON: Cada história deve ser um arquivo JSON contendo metadados (nível, título, vocabulário-chave) e um array de "nós" de diálogo. Cada nó terá o texto em francês, a tradução, o arquivo de áudio vinculado e eventos de interrupção (perguntas).

    Automação com Python: Para evitar a digitação manual exaustiva, scripts em Python podem ser utilizados para automatizar o fluxo de trabalho. Você pode escrever o texto bruto das histórias e usar o script para extrair palavras por frequência, gerar as traduções base e exportar o JSON final perfeitamente formatado. Isso utiliza a mesma lógica de manipulação de dados usada para gerar arquivos CSV otimizados para decks de revisão espaçada.

    Pipeline de Áudio TTS: O script Python também pode realizar chamadas a uma API de conversão de texto em fala (TTS) local ou em nuvem para gerar os arquivos .mp3 de cada linha de diálogo em lote, nomeando-os sequencialmente e salvando-os na pasta de assets do projeto.

Fase 2: Configuração da Stack Mobile

Para gerar um APK leve e de fácil manutenção, a tecnologia deve permitir um desenvolvimento ágil com suporte robusto a manipulação de estado.

    Framework Base: React Native executado através do Expo. Ele permite testar o código instantaneamente e gera o build do APK sem exigir configurações complexas de Gradle no ambiente local.

    Gerenciamento de Estado Global: Zustand. Ele é mais leve e menos burocrático que o Redux, ideal para gerenciar a quantidade de vidas (corações), os pontos de experiência (XP) acumulados e as histórias desbloqueadas na sessão atual.

    Banco de Dados Local: O aplicativo deve ser offline-first. O progresso do usuário e os logs de palavras aprendidas devem ser armazenados localmente utilizando o SQLite (integrado via WatermelonDB ou expo-sqlite). Os JSONs das histórias e os áudios já vêm embutidos no bundle do APK.

Fase 3: Design de Interface e Elementos Visuais

A interface deve ser minimalista para não distrair da leitura, mas responsiva e amigável.

    Gráficos Vetoriais (SVG): Em vez de utilizar imagens rasterizadas pesadas (PNG/JPG) para os personagens ou ícones de interface, todo o design gráfico deve ser exportado em formato SVG. O uso de componentes como react-native-svg permite renderizar cards promocionais das histórias, avatares e mapas de progresso com extrema nitidez em qualquer tela Android, mantendo o tamanho final do APK muito reduzido.

    Navegação (Router): Utilizar o React Navigation para gerenciar três telas principais:

        Trilha (Home): Uma lista vertical das histórias, mostrando cadeados para as bloqueadas.

        Leitor (Story Player): A interface principal de consumo de conteúdo.

        Revisão: Uma tela que consolida os erros cometidos pelo usuário nas histórias.

Fase 4: O Motor do Leitor Interativo (Core Feature)

Esta é a parte mais complexa da engenharia reversa do modelo de histórias, onde a interação acontece tela a tela.

    Renderização Progressiva: O texto francês aparece linha por linha. A cada toque na tela, o componente renderiza o próximo objeto do array JSON e executa o áudio .mp3 correspondente usando a biblioteca expo-av.

    Tooltip de Tradução: O texto renderizado não é uma string simples, mas um conjunto de botões tocáveis. Ao tocar em qualquer palavra francesa na tela, um modal flutuante exibe a tradução daquela palavra específica no contexto da frase.

    Eventos de Interrupção: Quando o laço de repetição do JSON encontra um nó do tipo "exercício", o botão de "Avançar" desaparece. O usuário é forçado a interagir:

        Completar a lacuna: O texto da história tem um espaço em branco e três botões de múltipla escolha aparecem na base da tela.

        Pergunta de compreensão: A história pausa para perguntar em português algo sobre o enredo recém-lido, validando a absorção do conteúdo.

    Lógica de Vidas: Errar um evento de interrupção subtrai um coração no estado global (Zustand). Acertar gera uma animação rápida de sucesso e libera a próxima linha da história.

Fase 5: Empacotamento e Distribuição Open-Source

O último passo garante a distribuição do projeto para que outros possam estudar e utilizar o aplicativo gratuitamente.

    Documentação no GitHub: O repositório precisa incluir instruções claras no README.md sobre como configurar o ambiente e, mais importante, como colaboradores podem submeter novas histórias escrevendo em um padrão simples para que os scripts Python processem.

    Publicação na Play Store: Após gerar o arquivo AAB/APK final através do Expo EAS Build, o aplicativo pode ser submetido diretamente ao Google Play Console. Assim como outras iniciativas open-source, ter o aplicativo listado oficialmente na loja democratiza o acesso e valida a qualidade técnica e pedagógica da ferramenta.
