import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, font, radius } from "../theme";

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
      <Text style={[styles.label, !enabled && styles.labelDisabled]}>
        {enabled ? "🔊  Ouvir" : "🔈  Áudio em breve"}
      </Text>
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
  label: { color: colors.blueDark, fontWeight: font.semi, fontSize: 15 },
  labelDisabled: { color: colors.textFaint },
});
