import { useState } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle } from "react-native";
import { colors, font, radius } from "../theme";
import type { Token } from "../types";

const CLOSING = /^[,.!?;:…»)"]+$/;

function needsSpaceBefore(token: Token, prev?: Token) {
  if (!prev) return false;
  if (CLOSING.test(token.t)) return false;
  if (prev.t.endsWith("'")) return false;
  return true;
}

export function LineText({ tokens }: { tokens: Token[] }) {
  const [selected, setSelected] = useState<Token | null>(null);

  return (
    <View>
      <View style={styles.row}>
        {tokens.map((tok, i) => {
          const style: StyleProp<TextStyle> = [
            styles.text,
            needsSpaceBefore(tok, tokens[i - 1]) ? styles.space : undefined,
            tok.gloss ? styles.word : undefined,
            selected === tok ? styles.wordActive : undefined,
          ];
          if (!tok.gloss) {
            return (
              <Text key={i} style={style}>
                {tok.t}
              </Text>
            );
          }
          return (
            <Pressable key={i} onPress={() => setSelected(tok)}>
              <Text style={style}>{tok.t}</Text>
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
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "flex-end" },
  text: { fontSize: 24, color: colors.text, lineHeight: 36 },
  space: { marginLeft: 7 },
  word: { fontWeight: font.semi },
  wordActive: { color: colors.blue, backgroundColor: colors.blueLight },
  tooltip: {
    marginTop: 14,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.text,
    alignSelf: "flex-start",
  },
  tooltipWord: { color: "#FFFFFF", fontSize: 20, fontWeight: font.bold },
  tooltipGloss: { color: colors.greenLight, fontSize: 17, marginTop: 2 },
});
