import { championsWithWinner, getUniqueClubs } from '../data/champions';
import type { Champion, QuizMode, QuizQuestion } from '../types';

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

export function generateQuiz(
  count: number,
  mode: QuizMode,
  eraFilter: 'all' | 'eredivisie' | 'voor-eredivisie' = 'all'
): QuizQuestion[] {
  let pool = championsWithWinner;

  if (eraFilter === 'eredivisie') {
    pool = pool.filter((c) => c.era === 'eredivisie');
  } else if (eraFilter === 'voor-eredivisie') {
    pool = pool.filter((c) => c.era === 'voor-eredivisie');
  }

  const selected = shuffle(pool).slice(0, Math.min(count, pool.length));

  return selected.map((champion) => {
    const type =
      mode === 'mixed'
        ? Math.random() < 0.5
          ? 'season-to-club'
          : 'club-to-season'
        : mode;

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
