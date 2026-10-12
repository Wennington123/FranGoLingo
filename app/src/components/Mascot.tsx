import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

// Mesmo desenho de mascot/sketch.js (cara). Renderizado com Views.
const PALETTE: Record<string, string | null> = {
  ".": null,
  W: "#ffffff",
  S: "#d1d5db",
  R: "#ef4444",
  O: "#f59e0b",
  K: "#111827",
  P: "#f9a8d4",
};

const SPRITE = [
  "......RR........",
  ".....RRRR.......",
  ".....RRRR.......",
  "....WWWWWW......",
  "...WWWWWWWW.....",
  "..WWWWWWWWWW....",
  "..WWWWWWWWWW....",
  "..WWWWWWWWWW....",
  "..WWWWOOOWWW....",
  "..WWWWOOOWWW....",
  "..WPWWWWWWPW....",
  "...WWWRRWWW.....",
  "....WWWWWW......",
  ".....WWWW.......",
];

export type MascotMode = "idle" | "happy" | "sad";
type Expr = "neutral" | "happy" | "sad" | "blink";

const SPRITE_W = SPRITE[0].length;
const SPRITE_H = SPRITE.length;

// [linha, coluna, cor]
const EYE_CELLS: Record<Expr, [number, number, string][]> = {
  happy: [
    [5, 4, "K"], [6, 3, "K"], [6, 5, "K"],
    [5, 9, "K"], [6, 8, "K"], [6, 10, "K"],
  ],
  sad: [
    [6, 4, "K"], [7, 4, "K"], [6, 5, "K"], [7, 5, "K"],
    [6, 8, "K"], [7, 8, "K"], [6, 9, "K"], [7, 9, "K"],
    [5, 4, "K"], [4, 5, "K"], [5, 9, "K"], [4, 8, "K"],
  ],
  neutral: [
    [5, 4, "K"], [6, 4, "K"], [5, 5, "K"], [6, 5, "K"],
    [5, 8, "K"], [6, 8, "K"], [5, 9, "K"], [6, 9, "K"],
  ],
  blink: [],
};

function poseFor(mode: MascotMode, t: number, frame: number) {
  if (mode === "happy") {
    const hop = Math.abs(Math.sin(t * 6));
    return { yOff: -hop * 6, squash: hop > 0.6 ? 0.08 : -0.06, expr: "happy" as Expr, beakOpen: true };
  }
  if (mode === "sad") {
    return { yOff: 2 + Math.sin(t * 1.5) * 1.2, squash: 0.04, expr: "sad" as Expr, beakOpen: false };
  }
  return {
    yOff: Math.sin(t * 2) * 1.2,
    squash: 0,
    expr: (frame % 9 === 0 ? "blink" : "neutral") as Expr,
    beakOpen: false,
  };
}

type Props = { mode?: MascotMode; cell?: number };

export function Mascot({ mode = "idle", cell = 8 }: Props) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 100);
    return () => clearInterval(id);
  }, []);

  const pose = poseFor(mode, frame * 0.1, frame);

  const cells: { row: number; col: number; color: string }[] = [];
  SPRITE.forEach((line, row) => {
    for (let col = 0; col < line.length; col++) {
      const color = PALETTE[line[col]];
      if (color) cells.push({ row, col, color });
    }
  });
  if (pose.expr !== "blink") {
    for (const [row, col, ch] of EYE_CELLS[pose.expr]) {
      cells.push({ row, col, color: PALETTE[ch] as string });
    }
  }
  if (pose.beakOpen) {
    for (let col = 6; col <= 8; col++) cells.push({ row: 10, col, color: PALETTE.O as string });
  }

  return (
    <View style={[styles.stage, { width: SPRITE_W * cell, height: SPRITE_H * cell }]}>
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
              left: c.col * cell,
              top: c.row * cell,
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
