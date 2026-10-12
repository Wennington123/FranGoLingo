export type RootStackParamList = {
  Trail: undefined;
  Reader: { storyId: string };
  Review: undefined;
};

// Fase 1: base para áudio (bundle local ou pacote baixado). Null = desabilitado.
export const AUDIO_BASE: string | null = null;

export function resolveAudio(audioPath?: string): string | undefined {
  if (!audioPath || !AUDIO_BASE) return undefined;
  return `${AUDIO_BASE.replace(/\/$/, "")}/${audioPath}`;
}
