// GERADO por tools/export_app_audio.py — não editar à mão.
export const AUDIO: Record<string, number> = {
  "fr-a1-01-au-cafe/n1.mp3": require("../../content/audio/fr-a1-01-au-cafe/n1.mp3"),
  "fr-a1-01-au-cafe/n2.mp3": require("../../content/audio/fr-a1-01-au-cafe/n2.mp3"),
  "fr-a1-01-au-cafe/n4.mp3": require("../../content/audio/fr-a1-01-au-cafe/n4.mp3"),
  "fr-a1-01-au-cafe/n6.mp3": require("../../content/audio/fr-a1-01-au-cafe/n6.mp3"),
};

export function resolveAudio(path?: string): number | undefined {
  return path ? AUDIO[path] : undefined;
}
