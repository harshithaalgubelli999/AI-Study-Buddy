export interface SummaryItem {
  topic: string;
  summary: string;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface GeneratedContent {
  summaries: SummaryItem[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}
