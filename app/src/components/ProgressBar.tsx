import { StyleSheet, View } from "react-native";
import { colors, radius } from "../theme";

export function ProgressBar({ progress }: { progress: number }) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct}%` }]}>
        {pct > 0 && <View style={styles.shine} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.blue,
    borderRadius: radius.pill,
    justifyContent: "flex-start",
  },
  shine: {
    height: 5,
    marginTop: 3,
    marginHorizontal: 6,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
});
