import { championsWithWinner, getUniqueClubs } from '../data/champions';
import type { Champion, QuizMode, QuizOrder, QuizQuestion } from '../types';

export interface QuizOptions {
  count: number;
  mode: QuizMode;
  eraFilter: 'all' | 'eredivisie' | 'voor-eredivisie';
  order: QuizOrder;
  allYears: boolean;
}

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickDistractors(correct: string, pool: string[], count: number): string[] {
  const filtered = pool.filter((item) => item !== correct);
  return shuffle(filtered).slice(0, count);
}

function createSeasonToClubQuestion(champion: Champion): QuizQuestion {
  const clubs = getUniqueClubs();
  const distractors = pickDistractors(champion.club!, clubs, 3);

  return {
    id: `s2c-${champion.id}`,
    type: 'season-to-club',
    question: `Wie werd landskampioen in het seizoen ${champion.season}?`,
    correctAnswer: champion.club!,
    options: shuffle([champion.club!, ...distractors]),
    champion,
  };
}

function createClubToSeasonQuestion(champion: Champion): QuizQuestion {
  const seasons = championsWithWinner.map((c) => c.season);
  const distractors = pickDistractors(champion.season, seasons, 3);

  return {
    id: `c2s-${champion.id}`,
    type: 'club-to-season',
    question: `In welk seizoen werd ${champion.club} landskampioen?`,
    correctAnswer: champion.season,
    options: shuffle([champion.season, ...distractors]),
    champion,
  };
}

function orderPool(pool: Champion[], order: QuizOrder): Champion[] {
  const sorted = [...pool].sort((a, b) => a.year - b.year);
  if (order === 'reverse-chronological') return sorted.reverse();
  if (order === 'chronological') return sorted;
  return shuffle(pool);
}

function resolveQuestionType(mode: QuizMode, index: number): 'season-to-club' | 'club-to-season' {
  if (mode === 'season-to-club') return 'season-to-club';
  if (mode === 'club-to-season') return 'club-to-season';
  return index % 2 === 0 ? 'season-to-club' : 'club-to-season';
}

export function getPoolSize(eraFilter: QuizOptions['eraFilter']): number {
  if (eraFilter === 'eredivisie') {
    return championsWithWinner.filter((c) => c.era === 'eredivisie').length;
  }
  if (eraFilter === 'voor-eredivisie') {
    return championsWithWinner.filter((c) => c.era === 'voor-eredivisie').length;
  }
  return championsWithWinner.length;
}

export function generateQuiz(options: QuizOptions): QuizQuestion[] {
  const { mode, eraFilter, order, allYears } = options;

  let pool = championsWithWinner;

  if (eraFilter === 'eredivisie') {
    pool = pool.filter((c) => c.era === 'eredivisie');
  } else if (eraFilter === 'voor-eredivisie') {
    pool = pool.filter((c) => c.era === 'voor-eredivisie');
  }

  const ordered = orderPool(pool, order);
  const count = allYears ? pool.length : Math.min(options.count, pool.length);
  const selected = ordered.slice(0, count);

  return selected.map((champion, index) => {
    const type = resolveQuestionType(mode, index);
    return type === 'season-to-club'
      ? createSeasonToClubQuestion(champion)
      : createClubToSeasonQuestion(champion);
  });
}

export function getScoreFeedback(percentage: number): string {
  if (percentage === 100) return 'Perfect! Je bent een echte voetbalhistoricus!';
  if (percentage >= 80) return 'Uitstekend! Je kent de kampioenen als geen ander.';
  if (percentage >= 60) return 'Goed gedaan! Nog even oefenen en je bent er.';
  if (percentage >= 40) return 'Niet slecht, maar er is ruimte voor verbetering.';
  return 'Tijd om het overzicht nog eens door te nemen!';
}
