import { useAudioPlayer } from "expo-audio";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  uri?: string;
};

export function AudioButton({ uri }: Props) {
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
      <Text style={styles.label}>{uri ? "Ouvir" : "Áudio (Fase 1)"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#eef2ff",
    alignSelf: "flex-start",
  },
  disabled: { backgroundColor: "#f3f4f6" },
  label: { color: "#4338ca", fontWeight: "600" },
});
