export type Language = 'English' | 'Chinese (Simplified)' | 'Malay';

export interface Flashcard {
  id: string;
  kanji: string;
  reading: string; // Hiragana/Katakana
  romaji: string;
  translation: string; // Renamed from english
  exampleSentence: string;
}

export interface AnalysisToken {
  word: string;
  reading: string;
  partOfSpeech: string;
  meaning: string;
}

export interface AnalysisResult {
  original: string;
  translation: string;
  tokens: AnalysisToken[];
  grammarNotes: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  FLASHCARDS = 'FLASHCARDS',
  CHAT = 'CHAT',
  ANALYZER = 'ANALYZER'
}

export interface DailyPhrase {
  japanese: string;
  reading: string;
  translation: string; // Renamed from english
  context: string;
}