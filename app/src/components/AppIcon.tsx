import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, Text, type StyleProp, type TextStyle } from "react-native";

export type AppIconName = keyof typeof MaterialCommunityIcons.glyphMap;

const FONT_FAMILY =
  Platform.OS === "ios" ? "Material Design Icons" : "MaterialCommunityIcons";

type Props = {
  name: AppIconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function AppIcon({ name, size = 22, color, style }: Props) {
  const glyph = (MaterialCommunityIcons.glyphMap as Record<string, number>)[name];
  if (!glyph) return null;

  return (
    <Text
      style={[
        {
          fontFamily: FONT_FAMILY,
          fontSize: size,
          color,
          includeFontPadding: false,
          textAlignVertical: "center",
        },
        style,
      ]}
    >
      {String.fromCodePoint(glyph)}
    </Text>
  );
}
