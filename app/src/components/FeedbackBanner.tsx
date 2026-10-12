import { StyleSheet, Text, View } from "react-native";
import { colors, font, radius } from "../theme";
import { DuoButton } from "./DuoButton";

type Props = {
  correct: boolean;
  solution?: string;
  onContinue: () => void;
};

export function FeedbackBanner({ correct, solution, onContinue }: Props) {
  const bg = correct ? colors.greenLight : colors.redLight;
  const accent = correct ? colors.greenDark : colors.redDark;
  const badge = correct ? colors.green : colors.red;

  return (
    <View style={[styles.banner, { backgroundColor: bg }]}>
      <View style={styles.row}>
        <Text style={[styles.badge, { backgroundColor: badge }]}>{correct ? "✓" : "✕"}</Text>
        <View style={styles.texts}>
          <Text style={[styles.title, { color: accent }]}>
            {correct ? "Excelente!" : "Solução correta:"}
          </Text>
          {!correct && solution ? (
            <Text style={styles.solution}>{solution}</Text>
          ) : null}
        </View>
      </View>
      <DuoButton
        label="Continuar"
        variant={correct ? "primary" : "danger"}
        onPress={onContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 16,
    gap: 16,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  badge: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 40,
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: font.bold,
    overflow: "hidden",
  },
  texts: { flex: 1 },
  title: { fontSize: 20, fontWeight: font.bold },
  solution: { fontSize: 16, color: colors.redDark, marginTop: 2 },
});
