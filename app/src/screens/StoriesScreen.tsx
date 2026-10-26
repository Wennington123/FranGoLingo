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
        renderItem={({ item, index }) => {
          const done = completed.includes(item.id);
          const unlocked = index === 0 || completed.includes(stories[index - 1].id);
          return (
            <Pressable
              style={[styles.card, !unlocked && styles.cardLocked]}
              disabled={!unlocked}
              onPress={() => navigation.navigate("Reader", { storyId: item.id })}
            >
              <View style={[styles.iconWrap, !unlocked && styles.iconWrapLocked]}>
                <AppIcon
                  name={done ? "check-circle" : unlocked ? "book-open-page-variant" : "lock"}
                  size={28}
                  color={unlocked ? colors.blue : colors.textFaint}
                />
              </View>
              <View style={styles.details}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.meta}>{item.level} · {item.tags?.join(" · ") ?? "francês"}</Text>
                <Text style={styles.status}>
                  {done
                    ? "Concluída — ler novamente"
                    : unlocked
                      ? "Disponível offline"
                      : "Conclua a história anterior para desbloquear"}
                </Text>
              </View>
              {unlocked ? (
                <AppIcon name="chevron-right" size={24} color={colors.textFaint} />
              ) : (
                <AppIcon name="lock" size={20} color={colors.textFaint} />
              )}
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
  cardLocked: { opacity: 0.6, borderColor: colors.border },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blueLight,
  },
  iconWrapLocked: { backgroundColor: colors.bgAlt },
  details: { flex: 1 },
  cardTitle: { fontSize: 19, fontWeight: font.bold, color: colors.text },
  meta: { marginTop: 3, fontSize: 13, color: colors.blueDark, fontWeight: font.semi },
  status: { marginTop: 5, fontSize: 13, color: colors.textMuted },
  empty: { padding: 24, textAlign: "center", color: colors.textMuted, fontSize: 16 },
});
