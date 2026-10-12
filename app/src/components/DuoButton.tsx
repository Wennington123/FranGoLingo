import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { EDGE, font, radius, variants, type Variant } from "../theme";

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
};

export function DuoButton({ label, onPress, variant = "primary", disabled }: Props) {
  const v = variants[variant];
  const [pressed, setPressed] = useState(false);

  return (
    <View style={[styles.wrap, { backgroundColor: v.edge }, disabled && styles.disabled]}>
      <Pressable
        disabled={disabled}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={onPress}
        style={[
          styles.inner,
          {
            backgroundColor: v.bg,
            marginTop: pressed ? EDGE : 0,
            marginBottom: pressed ? 0 : EDGE,
          },
        ]}
      >
        <Text style={[styles.label, { color: v.text }]}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.lg },
  disabled: { opacity: 0.5 },
  inner: {
    borderRadius: radius.lg,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 16, fontWeight: font.bold, letterSpacing: 0.8, textTransform: "uppercase" },
});
