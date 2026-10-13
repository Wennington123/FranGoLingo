import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppIcon } from "../components/AppIcon";
import { stories } from "../data/stories";
import type { RootStackParamList } from "../navigation";
import { useProgress } from "../store/progress";
import { EDGE, colors, font, radius } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Trail">;

export function TrailScreen({ navigation }: Props) {
  const { hearts, xp, completed } = useProgress();

  const isUnlocked = (index: number) =>
    index === 0 || completed.includes(stories[index - 1].id);

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.statGroup}>
          <AppIcon name="fire" size={20} color={colors.red} />
          <Text style={styles.stat}>0</Text>
        </View>
        <View style={styles.statGroup}>
          <AppIcon name="lightning-bolt" size={20} color={colors.yellowDark} />
          <Text style={styles.stat}>{xp}</Text>
        </View>
        <View style={styles.statGroup}>
          <AppIcon name="heart" size={20} color={colors.red} />
          <Text style={[styles.stat, styles.hearts]}>{hearts}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.path}>
        {stories.map((story, index) => {
          const unlocked = isUnlocked(index);
          const done = completed.includes(story.id);
          const bg = done ? colors.yellow : unlocked ? colors.green : colors.locked;
          const edge = done ? colors.yellowDark : unlocked ? colors.greenDark : colors.border;
          const offset = Math.round(Math.sin(index * 1.1) * 55);

          return (
            <View key={story.id} style={[styles.nodeWrap, { marginLeft: offset }]}>
              <View style={[styles.nodeBase, { backgroundColor: edge }]}>
                <Pressable
                  disabled={!unlocked}
                  onPress={() => navigation.navigate("Reader", { storyId: story.id })}
                  style={[styles.node, { backgroundColor: bg }]}
                >
                  <AppIcon
                    name={done ? "check" : unlocked ? "star" : "lock"}
                    size={30}
                    color={unlocked ? "#FFFFFF" : colors.textMuted}
                  />
                </Pressable>
              </View>
              <Text style={styles.nodeLabel}>{story.title}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.tabbar}>
        <View style={styles.tab}>
          <AppIcon name="home" size={22} color={colors.blue} />
          <Text style={[styles.tabLabel, styles.tabActive]}>Lições</Text>
        </View>
        <Pressable style={styles.tab} onPress={() => navigation.navigate("Stories")}>
          <AppIcon name="book-open-page-variant" size={22} color={colors.textFaint} />
          <Text style={styles.tabLabel}>Histórias</Text>
        </Pressable>
        <Pressable style={styles.tab} onPress={() => navigation.navigate("Review")}>
          <AppIcon name="clipboard-text-outline" size={22} color={colors.textFaint} />
          <Text style={styles.tabLabel}>Revisão</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  statGroup: { flexDirection: "row", alignItems: "center", gap: 6 },
  stat: { fontSize: 18, fontWeight: font.bold, color: colors.textMuted },
  hearts: { color: colors.red },
  path: { padding: 24, paddingBottom: 48, alignItems: "center", gap: 8 },
  nodeWrap: { alignItems: "center", marginBottom: 12 },
  nodeBase: { borderRadius: radius.pill },
  node: {
    width: 78,
    height: 78,
    borderRadius: radius.pill,
    marginBottom: EDGE,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeIcon: { fontSize: 30 },
  nodeLabel: { marginTop: 6, fontSize: 13, color: colors.textMuted, fontWeight: font.semi },
  tabbar: {
    flexDirection: "row",
    borderTopWidth: 2,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: 10, gap: 2 },
  tabIcon: { fontSize: 22 },
  tabLabel: { fontSize: 12, fontWeight: font.bold, color: colors.textFaint },
  tabActive: { color: colors.blue },
});
