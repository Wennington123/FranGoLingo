import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, font } from "../theme";
import type { ExerciseNode } from "../types";
import { WordChip, type ChipState } from "./WordChip";

type Props = {
  node: ExerciseNode;
  onAnswer: (correct: boolean) => void;
};

export function ExerciseCard({ node, onAnswer }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;

  const choose = (option: string) => {
    if (answered) return;
    setPicked(option);
    onAnswer(option === node.answer);
  };

  const chipState = (option: string): ChipState => {
    if (!answered) return "idle";
    if (option === node.answer) return "correct";
    if (option === picked) return "wrong";
    return "idle";
  };

  return (
    <View style={styles.container}>
      {node.exerciseType === "fill_blank" ? (
        <>
          <Text style={styles.instruction}>{node.prompt}</Text>
          <View style={styles.sentence}>
            {node.sentence.map((piece, i) => {
              if (i === node.blankIndex && picked) {
                const correct = picked === node.answer;
                return (
                  <Text
                    key={i}
                    style={[styles.word, { color: correct ? colors.greenDark : colors.redDark }]}
                  >
                    {picked}
                  </Text>
                );
              }
              return (
                <Text key={i} style={styles.word}>
                  {i === node.blankIndex ? "____" : piece}
                </Text>
              );
            })}
          </View>
        </>
      ) : (
        <Text style={styles.question}>{node.question}</Text>
      )}

      <View style={styles.options}>
        {node.options.map((option) => (
          <WordChip
            key={option}
            label={option}
            state={chipState(option)}
            onPress={answered ? undefined : () => choose(option)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  instruction: { fontSize: 20, fontWeight: font.bold, color: colors.text },
  question: { fontSize: 22, fontWeight: font.bold, color: colors.text },
  sentence: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  word: { fontSize: 22, color: colors.text, fontWeight: font.semi },
  options: { gap: 12 },
});
