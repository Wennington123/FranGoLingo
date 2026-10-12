import { Pressable, StyleSheet, Text, View } from "react-native";
import { EDGE, colors, font, radius } from "../theme";

export type ChipState = "idle" | "selected" | "correct" | "wrong";

const APPEARANCE: Record<ChipState, { bg: string; border: string; text: string }> = {
  idle: { bg: colors.bg, border: colors.border, text: colors.text },
  selected: { bg: colors.blueLight, border: colors.blue, text: colors.blueDark },
  correct: { bg: colors.greenLight, border: colors.green, text: colors.greenDark },
  wrong: { bg: colors.redLight, border: colors.red, text: colors.redDark },
};

type Props = {
  label: string;
  onPress?: () => void;
  state?: ChipState;
  flex?: boolean;
};

export function WordChip({ label, onPress, state = "idle", flex }: Props) {
  const a = APPEARANCE[state];
  return (
    <View style={[styles.wrap, { backgroundColor: a.border }, flex && styles.flex]}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={[styles.inner, { backgroundColor: a.bg, borderColor: a.border }]}
      >
        <Text style={[styles.label, { color: a.text }]}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.md, marginBottom: 0 },
  flex: { flexGrow: 1 },
  inner: {
    borderRadius: radius.md,
    borderWidth: 2,
    borderBottomWidth: 2,
    marginBottom: EDGE,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  label: { fontSize: 18, fontWeight: font.semi },
});
