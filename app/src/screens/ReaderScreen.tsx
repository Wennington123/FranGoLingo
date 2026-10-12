import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AudioButton } from "../components/AudioButton";
import { ExerciseCard } from "../components/ExerciseCard";
import { LineText } from "../components/LineText";
import { getStory } from "../data/stories";
import { resolveAudio, type RootStackParamList } from "../navigation";
import { useOnboarding } from "../store/onboarding";
import { useProgress } from "../store/progress";

type Props = NativeStackScreenProps<RootStackParamList, "Reader">;

export function ReaderScreen({ route, navigation }: Props) {
  const story = getStory(route.params.storyId);
  const { hearts, loseHeart, gainXp, addMistake, completeStory, resetHearts } =
    useProgress();
  const seenReaderHint = useOnboarding((s) => s.seenReaderHint);
  const dismissReaderHint = useOnboarding((s) => s.dismissReaderHint);

  const [index, setIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [finished, setFinished] = useState(false);

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
    setFinished(true);
  };

  const advance = () => {
    if (index + 1 >= story.nodes.length) finish();
    else {
      setIndex(index + 1);
      setShowTranslation(false);
    }
  };

  const restart = () => {
    resetHearts();
    setIndex(0);
    setShowTranslation(false);
    setFinished(false);
  };

  if (dead) {
    return (
      <View style={styles.center}>
        <Text style={styles.big}>Sem vidas</Text>
        <Pressable style={styles.primary} onPress={restart}>
          <Text style={styles.primaryText}>Reiniciar</Text>
        </Pressable>
      </View>
    );
  }

  if (finished) {
    return (
      <View style={styles.center}>
        <Text style={styles.big}>História concluída</Text>
        <Pressable style={styles.primary} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryText}>Voltar à trilha</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.progress}>
          {index + 1} / {story.nodes.length}
        </Text>
        <Text style={styles.progress}>HP {hearts}</Text>
      </View>

      {!seenReaderHint && (
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Toque em qualquer palavra em francês para ver a tradução.
          </Text>
          <Pressable onPress={dismissReaderHint}>
            <Text style={styles.hintBtn}>Entendi</Text>
          </Pressable>
        </View>
      )}

      {node.type === "line" ? (
        <View style={styles.block}>
          {node.speaker && <Text style={styles.speaker}>{node.speaker}</Text>}
          <LineText tokens={node.tokens} />
          <AudioButton uri={resolveAudio(node.audio)} />
          {showTranslation ? (
            <Text style={styles.translation}>{node.translation}</Text>
          ) : (
            <Pressable onPress={() => setShowTranslation(true)}>
              <Text style={styles.showTranslation}>Ver tradução</Text>
            </Pressable>
          )}
          <Pressable style={styles.primary} onPress={advance}>
            <Text style={styles.primaryText}>Avançar</Text>
          </Pressable>
        </View>
      ) : (
        <ExerciseCard
          node={node}
          onResolve={(correct) => {
            if (correct) gainXp(10);
            else {
              loseHeart();
              addMistake({
                storyId: story.id,
                nodeId: node.id,
                label: node.exerciseType === "fill_blank" ? node.prompt : node.question,
              });
            }
          }}
          onContinue={advance}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  big: { fontSize: 22, fontWeight: "700" },
  topbar: { flexDirection: "row", justifyContent: "space-between" },
  progress: { fontSize: 14, color: "#6b7280" },
  hint: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#eef2ff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  hintText: { flex: 1, color: "#3730a3", fontSize: 14 },
  hintBtn: { color: "#2563eb", fontWeight: "700" },
  block: { gap: 16 },
  speaker: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  translation: { fontSize: 18, color: "#374151", fontStyle: "italic" },
  showTranslation: { fontSize: 15, color: "#2563eb" },
  primary: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
