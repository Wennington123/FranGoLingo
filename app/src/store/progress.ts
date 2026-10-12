import { create } from "zustand";

export type Mistake = {
  storyId: string;
  nodeId: string;
  label: string;
};

type ProgressState = {
  hearts: number;
  xp: number;
  completed: string[];
  mistakes: Mistake[];
  loseHeart: () => void;
  gainXp: (amount: number) => void;
  addMistake: (m: Mistake) => void;
  completeStory: (storyId: string) => void;
  resetHearts: () => void;
};

export const MAX_HEARTS = 5;

export const useProgress = create<ProgressState>((set) => ({
  hearts: MAX_HEARTS,
  xp: 0,
  completed: [],
  mistakes: [],
  loseHeart: () => set((s) => ({ hearts: Math.max(0, s.hearts - 1) })),
  gainXp: (amount) => set((s) => ({ xp: s.xp + amount })),
  addMistake: (m) =>
    set((s) =>
      s.mistakes.some((x) => x.storyId === m.storyId && x.nodeId === m.nodeId)
        ? s
        : { mistakes: [...s.mistakes, m] },
    ),
  completeStory: (storyId) =>
    set((s) =>
      s.completed.includes(storyId)
        ? s
        : { completed: [...s.completed, storyId] },
    ),
  resetHearts: () => set({ hearts: MAX_HEARTS }),
}));
