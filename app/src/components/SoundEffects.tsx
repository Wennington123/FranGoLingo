import { createContext, useContext, type PropsWithChildren } from "react";
import { useAudioPlayer } from "expo-audio";

const SOURCES = {
  tap: require("../../assets/sfx/tap.wav"),
  success: require("../../assets/sfx/success.wav"),
  error: require("../../assets/sfx/error.wav"),
  complete: require("../../assets/sfx/complete.wav"),
};

type SoundName = keyof typeof SOURCES;
type SoundContextValue = { play: (name: SoundName) => void };

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundEffectsProvider({ children }: PropsWithChildren) {
  const tap = useAudioPlayer(SOURCES.tap);
  const success = useAudioPlayer(SOURCES.success);
  const error = useAudioPlayer(SOURCES.error);
  const complete = useAudioPlayer(SOURCES.complete);
  const players = { tap, success, error, complete };

  const play = (name: SoundName) => {
    const player = players[name];
    void player.seekTo(0).then(() => player.play());
  };

  return <SoundContext.Provider value={{ play }}>{children}</SoundContext.Provider>;
}

export function useSoundEffects() {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSoundEffects precisa de SoundEffectsProvider");
  return context;
}
