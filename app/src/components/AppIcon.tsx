import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

export type AppIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type Props = Omit<ComponentProps<typeof MaterialCommunityIcons>, "name"> & {
  name: AppIconName;
};

export function AppIcon({ name, size = 22, ...props }: Props) {
  return <MaterialCommunityIcons name={name} size={size} {...props} />;
}
