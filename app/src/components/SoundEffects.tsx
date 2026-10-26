import { useAudioPlayer } from "expo-audio";
import { createContext, useContext, type PropsWithChildren } from "react";
import { sfxKey, useAudioAssets, type SfxName } from "../data/audioAssets";

const DEV_SOURCES: Record<SfxName, number> = {
  tap: require("../../assets/sfx/tap.wav"),
  success: require("../../assets/sfx/success.wav"),
  error: require("../../assets/sfx/error.wav"),
  complete: require("../../assets/sfx/complete.wav"),
};

type SoundContextValue = { play: (name: SfxName) => void };

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundEffectsProvider({ children }: PropsWithChildren) {
  const uris = useAudioAssets((s) => s.uris);
  const source = (name: SfxName) => {
    if (__DEV__) return DEV_SOURCES[name];
    const uri = uris[sfxKey(name)];
    return uri ? { uri } : null;
  };

  const players = {
    tap: useAudioPlayer(source("tap")),
    success: useAudioPlayer(source("success")),
    error: useAudioPlayer(source("error")),
    complete: useAudioPlayer(source("complete")),
  };

  const play = (name: SfxName) => {
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
