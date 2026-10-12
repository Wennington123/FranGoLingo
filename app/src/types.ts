export type Token = {
  t: string;
  gloss: string | null;
};

export type LineNode = {
  id: string;
  type: "line";
  speaker?: string;
  text: string;
  translation: string;
  audio?: string;
  tokens: Token[];
};

export type FillBlankNode = {
  id: string;
  type: "exercise";
  exerciseType: "fill_blank";
  prompt: string;
  sentence: string[];
  blankIndex: number;
  options: string[];
  answer: string;
  explanation?: string;
};

export type ComprehensionNode = {
  id: string;
  type: "exercise";
  exerciseType: "comprehension";
  question: string;
  options: string[];
  answer: string;
};

export type ExerciseNode = FillBlankNode | ComprehensionNode;
export type StoryNode = LineNode | ExerciseNode;

export type Story = {
  id: string;
  title: string;
  level: string;
  language: string;
  nativeLanguage: string;
  tags?: string[];
  keyVocabulary?: { word: string; translation: string }[];
  nodes: StoryNode[];
};
