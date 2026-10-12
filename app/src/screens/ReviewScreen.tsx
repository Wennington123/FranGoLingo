import { FlatList, StyleSheet, Text, View } from "react-native";
import { useProgress } from "../store/progress";
import { colors, font, radius } from "../theme";

export function ReviewScreen() {
  const mistakes = useProgress((s) => s.mistakes);

  if (mistakes.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🎉</Text>
        <Text style={styles.empty}>Nenhum erro para revisar.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={mistakes}
      keyExtractor={(m) => `${m.storyId}/${m.nodeId}`}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.story}>{item.storyId}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 8 },
  emptyIcon: { fontSize: 44 },
  empty: { fontSize: 18, color: colors.textMuted, textAlign: "center", fontWeight: font.semi },
  list: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12 },
  card: {
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.redLight,
    backgroundColor: colors.redLight,
  },
  story: { fontSize: 12, color: colors.redDark, fontWeight: font.bold },
  label: { fontSize: 16, color: colors.text, marginTop: 4, fontWeight: font.semi },
});
