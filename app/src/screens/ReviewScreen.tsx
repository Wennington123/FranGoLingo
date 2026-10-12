import { FlatList, StyleSheet, Text, View } from "react-native";
import { useProgress } from "../store/progress";

export function ReviewScreen() {
  const mistakes = useProgress((s) => s.mistakes);

  if (mistakes.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Nenhum erro para revisar. Bom trabalho.</Text>
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
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  empty: { fontSize: 16, color: "#6b7280", textAlign: "center" },
  list: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16, gap: 12 },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fef2f2",
  },
  story: { fontSize: 12, color: "#9ca3af" },
  label: { fontSize: 16, color: "#111827", marginTop: 4 },
});
