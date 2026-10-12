import { useAudioPlayer } from "expo-audio";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, font, radius } from "../theme";

export function AudioButton({ uri }: { uri?: string }) {
  const player = useAudioPlayer(uri ? { uri } : undefined);

  return (
    <Pressable
      style={[styles.button, !uri && styles.disabled]}
      disabled={!uri}
      onPress={() => {
        player.seekTo(0);
        player.play();
      }}
    >
      <Text style={[styles.label, !uri && styles.labelDisabled]}>
        {uri ? "🔊  Ouvir" : "🔈  Áudio em breve"}
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
