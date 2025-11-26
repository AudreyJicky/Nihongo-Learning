
export type Language = 
  | 'English' 
  | 'Chinese (Simplified)' 
  | 'Malay' 
  | 'Japanese' 
  | 'Korean' 
  | 'Indonesian' 
  | 'Thai' 
  | 'Vietnamese' 
  | 'Myanmar' 
  | 'Arabic';

export type ThemeMode = 'light' | 'dark';
export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string; // URL or emoji/base64
  theme: ThemeMode;
  xp: number;
  // Personal Details
  birthday?: string;
  gender?: Gender;
  bio?: string;
  joinedDate?: string;
}

export interface Flashcard {
  id: string;
  concept: string;      
  category: string;     
  definition: string;   
  syntax: string;       
  exampleCode: string;  
}

export interface AnalysisToken {
  segment: string;      
  type: string;         
  explanation: string;  
}

export interface AnalysisResult {
  originalCode: string;
  summary: string;      
  concepts: AnalysisToken[];
  bestPracticeTip: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  REFERENCE = 'REFERENCE',
  FLASHCARDS = 'FLASHCARDS',
  GAME = 'GAME',
  NOTEBOOK = 'NOTEBOOK',
  CHAT = 'CHAT',
  ANALYZER = 'ANALYZER',
  PROFILE = 'PROFILE',
  LEADERBOARD = 'LEADERBOARD',
  COMMUNITY = 'COMMUNITY',
  DOWNLOAD = 'DOWNLOAD'
}

export interface DailyTip {
  topic: string;
  codeSnippet: string;
  explanation: string;
  funFact: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string; // The correct option string
  explanation: string;
}

export interface ReferenceTopic {
  id: string;
  title: string;
  emoji: string;
  description: string;
}

export interface LeaderboardEntry {
    id: string;
    name: string;
    avatar: string;
    xp: number;
    rank: number;
}

export interface StudyGroup {
    id: string;
    name: string;
    members: number;
    description: string;
    tags: string[];
    isJoined?: boolean;
}
