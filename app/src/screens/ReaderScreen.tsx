import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppIcon } from "../components/AppIcon";
import { AudioButton } from "../components/AudioButton";
import { DuoButton } from "../components/DuoButton";
import { ExerciseCard } from "../components/ExerciseCard";
import { FeedbackBanner } from "../components/FeedbackBanner";
import { LineText } from "../components/LineText";
import { Mascot } from "../components/Mascot";
import { ProgressBar } from "../components/ProgressBar";
import { useSoundEffects } from "../components/SoundEffects";
import { getStory } from "../data/stories";
import type { RootStackParamList } from "../navigation";
import { useOnboarding } from "../store/onboarding";
import { useProgress } from "../store/progress";
import { colors, font, radius } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Reader">;
type Feedback = { correct: boolean; solution?: string } | null;

export function ReaderScreen({ route, navigation }: Props) {
  const story = getStory(route.params.storyId);
  const { hearts, loseHeart, gainXp, addMistake, completeStory, resetHearts } =
    useProgress();
  const { play } = useSoundEffects();
  const seenReaderHint = useOnboarding((s) => s.seenReaderHint);
  const dismissReaderHint = useOnboarding((s) => s.dismissReaderHint);

  const [index, setIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  if (!story) {
    return (
      <View style={styles.center}>
        <Text>História não encontrada.</Text>
      </View>
    );
  }

  const node = story.nodes[index];
  const dead = hearts <= 0 && !finished;

  const finish = () => {
    completeStory(story.id);
    play("complete");
    setFinished(true);
  };

  const goNext = () => {
    setFeedback(null);
    setShowTranslation(false);
    if (index + 1 >= story.nodes.length) finish();
    else setIndex(index + 1);
  };

  const restart = () => {
    resetHearts();
    setIndex(0);
    setShowTranslation(false);
    setFeedback(null);
    setFinished(false);
  };

  if (dead) {
    return (
      <View style={styles.center}>
        <Mascot mode="sad" cell={12} />
        <Text style={styles.big}>Você ficou sem corações</Text>
        <Text style={styles.sub}>Não desanime, tente de novo.</Text>
        <View style={styles.centerBtn}>
          <DuoButton label="Tentar de novo" variant="danger" onPress={restart} />
        </View>
      </View>
    );
  }

  if (finished) {
    return (
      <View style={styles.center}>
        <Mascot mode="happy" cell={12} />
        <Text style={styles.big}>Lição concluída!</Text>
        <Text style={styles.sub}>Você ganhou XP e avançou na trilha.</Text>
        <View style={styles.centerBtn}>
          <DuoButton label="Voltar à trilha" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  const progress = index / story.nodes.length;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={styles.closeBtn}
        >
          <AppIcon name="close" size={28} color={colors.textFaint} />
        </Pressable>
        <View style={styles.progressWrap}>
          <ProgressBar progress={progress} />
        </View>
        <View style={styles.hearts}>
          <AppIcon name="heart" size={18} color={colors.red} />
          <Text style={styles.heartCount}>{hearts}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!seenReaderHint && node.type === "line" && (
          <Pressable style={styles.hint} onPress={dismissReaderHint}>
            <Text style={styles.hintText}>
              Toque em qualquer palavra em francês para ver a tradução.
            </Text>
            <Text style={styles.hintBtn}>Entendi</Text>
          </Pressable>
        )}

        {node.type === "line" ? (
          <>
            {node.speaker && <Text style={styles.speaker}>{node.speaker}</Text>}
            <LineText tokens={node.tokens} />
            <AudioButton audioPath={node.audio} autoPlay />
            {showTranslation ? (
              <Text style={styles.translation}>{node.translation}</Text>
            ) : (
              <Pressable onPress={() => setShowTranslation(true)}>
                <Text style={styles.showTranslation}>Ver tradução</Text>
              </Pressable>
            )}
          </>
        ) : (
          <ExerciseCard
            node={node}
            onAnswer={(correct) => {
              if (correct) {
                play("success");
                gainXp(10);
                setFeedback({ correct: true });
              } else {
                play("error");
                loseHeart();
                addMistake({
                  storyId: story.id,
                  nodeId: node.id,
                  label: node.exerciseType === "fill_blank" ? node.prompt : node.question,
                });
                setFeedback({ correct: false, solution: node.answer });
              }
            }}
          />
        )}
      </ScrollView>

      {node.type === "line" && (
        <View style={styles.footer}>
          <DuoButton label="Continuar" onPress={goNext} />
        </View>
      )}

      {feedback && (
        <View style={styles.bannerWrap}>
          <FeedbackBanner
            correct={feedback.correct}
            solution={feedback.solution}
            onContinue={goNext}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  progressWrap: { flex: 1 },
  hearts: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.redLight,
  },
  heartCount: { fontSize: 16, fontWeight: font.bold, color: colors.red },
  content: { padding: 20, gap: 18, paddingBottom: 120 },
  hint: {
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.blueLight,
    gap: 6,
  },
  hintText: { color: colors.blueDark, fontSize: 15, fontWeight: font.semi },
  hintBtn: { color: colors.blueDark, fontWeight: font.bold, fontSize: 15 },
  speaker: {
    fontSize: 13,
    fontWeight: font.bold,
    color: colors.purple,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  translation: { fontSize: 18, color: colors.textMuted, fontStyle: "italic" },
  showTranslation: { fontSize: 15, color: colors.blue, fontWeight: font.semi },
  footer: { padding: 16 },
  bannerWrap: { position: "absolute", left: 0, right: 0, bottom: 0 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  big: { fontSize: 24, fontWeight: font.bold, color: colors.text, textAlign: "center" },
  sub: { fontSize: 16, color: colors.textMuted, textAlign: "center" },
  centerBtn: { alignSelf: "stretch", marginTop: 12 },
});
