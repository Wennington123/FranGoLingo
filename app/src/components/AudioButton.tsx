import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, font, radius } from "../theme";
import { AppIcon } from "./AppIcon";

type Props = {
  assetId?: number;
  autoPlay?: boolean;
};

export function AudioButton({ assetId, autoPlay }: Props) {
  const player = useAudioPlayer(assetId ?? null);
  const status = useAudioPlayerStatus(player);
  const playedFor = useRef<number | null>(null);

  useEffect(() => {
    if (!autoPlay || !assetId || !status.isLoaded) return;
    if (playedFor.current === assetId) return;
    playedFor.current = assetId;
    player.play();
  }, [autoPlay, assetId, status.isLoaded, player]);

  const enabled = assetId !== undefined;

  return (
    <Pressable
      style={[styles.button, !enabled && styles.disabled]}
      disabled={!enabled}
      onPress={() => {
        player.seekTo(0);
        player.play();
      }}
    >
      <View style={styles.content}>
        <AppIcon
          name={enabled ? "volume-high" : "volume-off"}
          size={18}
          color={enabled ? colors.blueDark : colors.textFaint}
        />
        <Text style={[styles.label, !enabled && styles.labelDisabled]}>
          {enabled ? "Ouvir" : "Áudio em breve"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.blueLight,
    alignSelf: "flex-start",
  },
  disabled: { backgroundColor: colors.bgAlt },
  content: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: { color: colors.blueDark, fontWeight: font.semi, fontSize: 15 },
  labelDisabled: { color: colors.textFaint },
});
