import { Asset } from "expo-asset";
import { Platform } from "react-native";
import { create } from "zustand";
import { stories } from "./stories";

const SFX_NAMES = ["tap", "success", "error", "complete"] as const;
export type SfxName = (typeof SFX_NAMES)[number];

function sanitize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function audioResourceName(audioPath: string) {
  return `frangolingo_audio_${sanitize(audioPath.replace(/\.[^.]+$/, ""))}`;
}

export function sfxResourceName(name: string) {
  return `frangolingo_sfx_${sanitize(name)}`;
}

export function sfxKey(name: SfxName) {
  return `sfx:${name}`;
}

type AudioAssetsState = {
  uris: Record<string, string>;
  ready: boolean;
  init: () => Promise<void>;
};

export const useAudioAssets = create<AudioAssetsState>((set, get) => ({
  uris: {},
  ready: false,
  init: async () => {
    if (get().ready) return;
    if (Platform.OS !== "android" || __DEV__) {
      set({ ready: true });
      return;
    }

    const paths = new Set<string>();
    for (const story of stories) {
      for (const node of story.nodes) {
        if (node.type === "line" && node.audio) paths.add(node.audio);
      }
    }

    const entries: [string, string][] = [];
    await Promise.all([
      ...Array.from(paths).map(async (audioPath) => {
        const asset = Asset.fromURI(audioResourceName(audioPath));
        await asset.downloadAsync();
        if (asset.localUri) entries.push([audioPath, asset.localUri]);
      }),
      ...SFX_NAMES.map(async (name) => {
        const asset = Asset.fromURI(sfxResourceName(name));
        await asset.downloadAsync();
        if (asset.localUri) entries.push([sfxKey(name), asset.localUri]);
      }),
    ]).catch((error) => {
      console.warn("Falha ao preparar áudios", error);
    });

    set({ uris: Object.fromEntries(entries), ready: true });
  },
}));
