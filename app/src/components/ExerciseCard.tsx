import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ExerciseNode } from "../types";

type Props = {
  node: ExerciseNode;
  onResolve: (correct: boolean) => void;
  onContinue: () => void;
};

export function ExerciseCard({ node, onResolve, onContinue }: Props) {
  const [picked, setPicked] = useState<string | null>(null);

  const choose = (option: string) => {
    if (picked !== null) return;
    setPicked(option);
    onResolve(option === node.answer);
  };

  const correct = picked === node.answer;

  return (
    <View style={styles.card}>
      <Text style={styles.kind}>
        {node.exerciseType === "fill_blank" ? "Complete a frase" : "Compreensão"}
      </Text>

      {node.exerciseType === "fill_blank" ? (
        <>
          <View style={styles.sentenceRow}>
            {node.sentence.map((piece, i) => (
              <Text
                key={i}
                style={
                  i === node.blankIndex && picked
                    ? [styles.sentence, correct ? styles.good : styles.bad]
                    : styles.sentence
                }
              >
                {i === node.blankIndex ? (picked ?? "____") : piece}
              </Text>
            ))}
          </View>
          <Text style={styles.prompt}>{node.prompt}</Text>
        </>
      ) : (
        <Text style={styles.question}>{node.question}</Text>
      )}

      <View style={styles.options}>
        {node.options.map((option) => (
          <Pressable
            key={option}
            style={[
              styles.option,
              picked === option &&
                (option === node.answer ? styles.goodBg : styles.badBg),
            ]}
            onPress={() => choose(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </View>

      {picked !== null && (
        <View style={styles.feedback}>
          <Text style={correct ? styles.goodText : styles.badText}>
            {correct ? "Correto!" : `Resposta: ${node.answer}`}
          </Text>
          {node.exerciseType === "fill_blank" && node.explanation && (
            <Text style={styles.explanation}>{node.explanation}</Text>
          )}
          <Pressable style={styles.continue} onPress={onContinue}>
            <Text style={styles.continueText}>Continuar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  kind: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  sentenceRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  sentence: { fontSize: 20, color: "#111827" },
  question: { fontSize: 20, color: "#111827" },
  prompt: { marginTop: 8, fontSize: 14, color: "#6b7280" },
  options: { marginTop: 16, gap: 10 },
  option: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  optionText: { fontSize: 18, color: "#111827" },
  good: { color: "#059669" },
  bad: { color: "#dc2626" },
  goodBg: { backgroundColor: "#d1fae5", borderColor: "#059669" },
  badBg: { backgroundColor: "#fee2e2", borderColor: "#dc2626" },
  feedback: { marginTop: 16, gap: 6 },
  goodText: { fontSize: 16, fontWeight: "700", color: "#059669" },
  badText: { fontSize: 16, fontWeight: "700", color: "#dc2626" },
  explanation: { fontSize: 14, color: "#374151" },
  continue: {
    marginTop: 8,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#2563eb",
    alignItems: "center",
  },
  continueText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
