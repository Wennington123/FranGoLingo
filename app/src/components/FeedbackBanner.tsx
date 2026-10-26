import { StyleSheet, Text, View } from "react-native";
import { colors, font, radius } from "../theme";
import { AppIcon } from "./AppIcon";
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
        <View style={[styles.badge, { backgroundColor: badge }]}>
          <AppIcon name={correct ? "check" : "close"} size={22} color="#FFFFFF" />
        </View>
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
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 16,
    gap: 16,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  badge: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: { flex: 1 },
  title: { fontSize: 20, fontWeight: font.bold },
  solution: { fontSize: 16, color: colors.redDark, marginTop: 2 },
});
