import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { stories } from "../data/stories";
import type { RootStackParamList } from "../navigation";
import { useProgress } from "../store/progress";

type Props = NativeStackScreenProps<RootStackParamList, "Trail">;

export function TrailScreen({ navigation }: Props) {
  const { hearts, xp, completed } = useProgress();

  const isUnlocked = (index: number) =>
    index === 0 || completed.includes(stories[index - 1].id);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stat}>HP {hearts}</Text>
        <Text style={styles.stat}>XP {xp}</Text>
      </View>

      <FlatList
        data={stories}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => {
          const unlocked = isUnlocked(index);
          const done = completed.includes(item.id);
          return (
            <Pressable
              style={[styles.card, !unlocked && styles.locked]}
              disabled={!unlocked}
              onPress={() => navigation.navigate("Reader", { storyId: item.id })}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>
                {item.level} · {item.language}
                {done ? " · concluída" : unlocked ? "" : " · bloqueada"}
              </Text>
            </Pressable>
          );
        }}
      />

      <Pressable
        style={styles.review}
        onPress={() => navigation.navigate("Review")}
      >
        <Text style={styles.reviewText}>Revisão</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  stat: { fontSize: 16, fontWeight: "700", color: "#111827" },
  list: { padding: 16, gap: 12 },
  card: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  locked: { opacity: 0.5 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  cardMeta: { marginTop: 4, fontSize: 13, color: "#6b7280" },
  review: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
  },
  reviewText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
