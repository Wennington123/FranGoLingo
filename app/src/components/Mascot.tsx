import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

// Mesmo desenho de mascot/sketch.js. Renderizado com Views (pixel art, sem asset).
const PALETTE: Record<string, string | null> = {
  ".": null,
  W: "#ffffff",
  S: "#d1d5db",
  R: "#ef4444",
  O: "#f59e0b",
  K: "#111827",
};

const SPRITE = [
  ".....RRR............",
  "....RRRRR...........",
  "....RRRRR...........",
  "....WWWWWWW.........",
  "...WWWWWWWWW........",
  "...WWWWKWWWW........",
  "...WWWWKWWWWOOO.....",
  "...WWWWWWWWW........",
  "..WWWWWWWWWWWW......",
  ".WWWWWWWWWWWWWW.....",
  ".WWWWWWWWSSWWWW.....",
  "WWWWWWWWSSSSWWWW....",
  "WWWWWWWWSSSWWWW.....",
  ".WWWWWWWWWWWWWW.....",
  "..WWWWWWWWWWWW......",
  "...WWWWWWWWWW.......",
  "....OOO..OOO........",
  "....OOO..OOO........",
  "...OOOO.OOOO........",
];

export type MascotMode = "idle" | "happy" | "sad";

const SPRITE_W = SPRITE[0].length;
const SPRITE_H = SPRITE.length;

function poseFor(mode: MascotMode, t: number, frame: number) {
  if (mode === "happy") {
    const hop = Math.abs(Math.sin(t * 6));
    return { yOff: -hop * 10, squash: hop > 0.6 ? 0.08 : -0.06, blink: false, beakOpen: true };
  }
  if (mode === "sad") {
    return { yOff: 4 + Math.sin(t * 1.5) * 1.5, squash: 0.05, blink: frame % 8 < 2, beakOpen: false };
  }
  return { yOff: Math.sin(t * 2) * 1.5, squash: 0, blink: frame % 9 === 0, beakOpen: false };
}

type Props = { mode?: MascotMode; cell?: number };

export function Mascot({ mode = "idle", cell = 8 }: Props) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 100);
    return () => clearInterval(id);
  }, []);

  const pose = poseFor(mode, frame * 0.1, frame);

  const cells: { x: number; y: number; color: string }[] = [];
  SPRITE.forEach((line, row) => {
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      if (ch === "K" && pose.blink) continue;
      const color = PALETTE[ch];
      if (color) cells.push({ x: col * cell, y: row * cell, color });
    }
  });
  if (pose.beakOpen) {
    for (let col = 12; col <= 13; col++) {
      cells.push({ x: col * cell, y: 7 * cell, color: PALETTE.O as string });
    }
  }

  return (
    <View
      style={[
        styles.stage,
        { width: SPRITE_W * cell, height: SPRITE_H * cell },
      ]}
    >
      <View
        style={{
          width: SPRITE_W * cell,
          height: SPRITE_H * cell,
          transform: [{ translateY: pose.yOff }, { scaleY: 1 - pose.squash }],
        }}
      >
        {cells.map((c, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              width: cell,
              height: cell,
              backgroundColor: c.color,
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { alignItems: "center", justifyContent: "center" },
});
