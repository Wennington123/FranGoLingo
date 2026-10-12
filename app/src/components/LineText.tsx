import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Token } from "../types";

type Props = {
  tokens: Token[];
};

export function LineText({ tokens }: Props) {
  const [selected, setSelected] = useState<Token | null>(null);

  return (
    <View>
      <View style={styles.row}>
        {tokens.map((tok, i) => {
          if (tok.gloss === null) {
            return (
              <Text key={i} style={styles.text}>
                {tok.t}
              </Text>
            );
          }
          return (
            <Pressable key={i} onPress={() => setSelected(tok)}>
              <Text style={[styles.text, styles.word]}>{tok.t}</Text>
            </Pressable>
          );
        })}
      </View>

      {selected && (
        <Pressable style={styles.tooltip} onPress={() => setSelected(null)}>
          <Text style={styles.tooltipWord}>{selected.t}</Text>
          <Text style={styles.tooltipGloss}>{selected.gloss}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
    gap: 6,
  },
  text: { fontSize: 22, color: "#1f2937" },
  word: { color: "#2563eb", textDecorationLine: "underline" },
  tooltip: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#111827",
  },
  tooltipWord: { color: "#fff", fontSize: 18, fontWeight: "700" },
  tooltipGloss: { color: "#d1d5db", fontSize: 16 },
});
