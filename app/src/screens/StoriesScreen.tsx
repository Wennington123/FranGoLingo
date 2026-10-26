import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppIcon } from "../components/AppIcon";
import { stories } from "../data/stories";
import type { RootStackParamList } from "../navigation";
import { useProgress } from "../store/progress";
import { colors, font, radius } from "../theme";

 type Props = NativeStackScreenProps<RootStackParamList, "Stories">;

export function StoriesScreen({ navigation }: Props) {
  const completed = useProgress((state) => state.completed);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórias</Text>
        <Text style={styles.subtitle}>Leia, ouça e pratique francês em contexto.</Text>
      </View>
      <FlatList
        data={stories}
        keyExtractor={(story) => story.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma história disponível.</Text>}
        renderItem={({ item }) => {
          const done = completed.includes(item.id);
          return (
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate("Reader", { storyId: item.id })}
            >
              <View style={styles.iconWrap}>
                <AppIcon name={done ? "check-circle" : "book-open-page-variant"} size={28} color={colors.blue} />
              </View>
              <View style={styles.details}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.meta}>{item.level} · {item.tags?.join(" · ") ?? "francês"}</Text>
                <Text style={styles.status}>{done ? "Concluída — ler novamente" : "Disponível offline"}</Text>
              </View>
              <AppIcon name="chevron-right" size={24} color={colors.textFaint} />
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { padding: 20, borderBottomWidth: 2, borderBottomColor: colors.border },
  title: { fontSize: 28, fontWeight: font.bold, color: colors.text },
  subtitle: { marginTop: 4, fontSize: 16, color: colors.textMuted },
  list: { padding: 16, gap: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.blueLight,
    backgroundColor: colors.bg,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blueLight,
  },
  details: { flex: 1 },
  cardTitle: { fontSize: 19, fontWeight: font.bold, color: colors.text },
  meta: { marginTop: 3, fontSize: 13, color: colors.blueDark, fontWeight: font.semi },
  status: { marginTop: 5, fontSize: 13, color: colors.textMuted },
  empty: { padding: 24, textAlign: "center", color: colors.textMuted, fontSize: 16 },
});
