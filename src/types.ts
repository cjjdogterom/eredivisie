export type Era = 'voor-eredivisie' | 'eredivisie' | 'geen-kampioen';

export interface Champion {
  id: string;
  season: string;
  year: number;
  club: string | null;
  city: string | null;
  era: Era;
  note?: string;
}

export interface ClubStats {
  club: string;
  totalTitles: number;
  eredivisieTitles: number;
  seasons: string[];
  firstTitle: string;
  lastTitle: string;
}

export type QuizMode = 'season-to-club' | 'club-to-season' | 'mixed';

export type QuizOrder = 'random' | 'chronological' | 'reverse-chronological';

export interface QuizQuestion {
  id: string;
  type: 'season-to-club' | 'club-to-season';
  question: string;
  correctAnswer: string;
  correctYear: number;
  champion: Champion;
}

export type AnswerStatus = 'pending' | 'correct' | 'fuzzy' | 'wrong' | 'approved';
