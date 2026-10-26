import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { resolveAudio } from "../data/audio";
import { useAudioAssets } from "../data/audioAssets";
import { colors, font, radius } from "../theme";
import { AppIcon } from "./AppIcon";

type Props = {
  audioPath?: string;
  autoPlay?: boolean;
};

export function AudioButton({ audioPath, autoPlay }: Props) {
  const uri = useAudioAssets((s) => (audioPath ? s.uris[audioPath] : undefined));
  const source = audioPath ? uri ? { uri } : __DEV__ ? resolveAudio(audioPath) ?? null : null : null;
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    player.volume = 1;
    player.muted = false;
  }, [player, source]);

  const playedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!autoPlay || !audioPath || !status.isLoaded) return;
    if (playedFor.current === audioPath) return;
    playedFor.current = audioPath;
    player.play();
  }, [autoPlay, audioPath, status.isLoaded, player]);

  const enabled = source !== null;
  const unavailable = enabled && !status.isLoaded;

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
          {!audioPath
            ? "Áudio em breve"
            : !enabled || unavailable
              ? "Carregando áudio…"
              : "Ouvir"}
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
