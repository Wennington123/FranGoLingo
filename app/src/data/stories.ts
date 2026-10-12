import type { Story } from "../types";

// Fase 0: conteúdo embutido. Fase 3 troca por pacote baixável + cache.
import auCafe from "../../content/stories/fr/a1/01-au-cafe.json";

export const stories: Story[] = [auCafe as unknown as Story];

export function getStory(id: string): Story | undefined {
  return stories.find((s) => s.id === id);
}
