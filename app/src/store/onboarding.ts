import { create } from "zustand";

type OnboardingState = {
  seenTutorial: boolean;
  seenReaderHint: boolean;
  finishTutorial: () => void;
  dismissReaderHint: () => void;
};

// Fase 0: em memória. Fase 2 persiste em expo-sqlite.
export const useOnboarding = create<OnboardingState>((set) => ({
  seenTutorial: false,
  seenReaderHint: false,
  finishTutorial: () => set({ seenTutorial: true }),
  dismissReaderHint: () => set({ seenReaderHint: true }),
}));
