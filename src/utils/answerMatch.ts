import { championsWithWinner } from '../data/champions';

export type MatchResult = 'exact' | 'fuzzy' | 'wrong';

export interface AnswerCheck {
  result: MatchResult;
  message?: string;
}

const clubAliases: Record<string, string[]> = {
  Ajax: ['ajax', 'afc ajax', 'ajax amsterdam'],
  PSV: ['psv', 'psv eindhoven', 'eindhoven'],
  Feyenoord: ['feyenoord', 'feyenoord rotterdam', 'feijenoord'],
  HVV: ['hvv', 'hvv den haag', 'haagse voetbal vereniging'],
  'Sparta Rotterdam': ['sparta', 'sparta rotterdam'],
  RAP: ['rap', 'rap amsterdam', 'avv rap'],
  'Go Ahead Eagles': ['go ahead', 'go ahead eagles', 'ga eagles', 'go ahead deventer'],
  HFC: ['hfc', 'hfc haarlem', 'koninklijke hfc', 'koninklijke haarlemsche football club'],
  HBS: ['hbs', 'hbs craeyenhout', 'hbs den haag'],
  'Willem II': ['willem ii', 'willem 2', 'willem ii tilburg'],
  AZ: ['az', 'az alkmaar', 'alkmaar'],
  'Heracles Almelo': ['heracles', 'heracles almelo'],
  'ADO Den Haag': ['ado', 'ado den haag', 'den haag'],
  RCH: ['rch', 'racing club heemstede', 'racing club haarlem'],
  'NAC Breda': ['nac', 'nac breda'],
  'FC Twente': ['fc twente', 'twente', 'fc twente enschede'],
  'Roda JC': ['roda jc', 'roda', 'rapid jc', 'rapid'],
  DOS: ['dos', 'dos utrecht', 'vv dos'],
  DWS: ['dws', 'dws amsterdam', 'afc dws'],
  'VV Concordia': ['concordia', 'vv concordia'],
  'Quick Den Haag': ['quick', 'quick den haag'],
  'Be Quick 1887': ['be quick', 'be quick 1887', 'be quick groningen'],
  'SC Enschede': ['sc enschede', 'enschede'],
  'FC Den Bosch': ['fc den bosch', 'den bosch', 'bvv'],
  SVV: ['svv', 'svv schiedam'],
  'SV Limburgia': ['limburgia', 'sv limburgia'],
  'FC Eindhoven': ['fc eindhoven', 'eindhoven fc'],
  'De Volewijckers': ['volewijckers', 'de volewijckers'],
  'HFC Haarlem': ['hfc haarlem', 'haarlem'],
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
    }
  }
  return matrix[b.length][a.length];
}

function isFuzzyMatch(input: string, target: string): boolean {
  const a = normalize(input);
  const b = normalize(target);
  if (!a || !b) return false;
  if (a === b) return true;
  if (b.includes(a) || a.includes(b)) return true;

  const maxLen = Math.max(a.length, b.length);
  const distance = levenshtein(a, b);
  const threshold = maxLen <= 4 ? 1 : maxLen <= 8 ? 2 : 3;
  return distance <= threshold;
}

function getClubVariants(club: string): string[] {
  const aliases = clubAliases[club] ?? [];
  return [club, ...aliases];
}

export function checkClubAnswer(input: string, correctClub: string): AnswerCheck {
  const normalizedInput = normalize(input);
  if (!normalizedInput) return { result: 'wrong' };

  const variants = getClubVariants(correctClub);

  for (const variant of variants) {
    if (normalize(variant) === normalizedInput) {
      return { result: 'exact' };
    }
  }

  for (const variant of variants) {
    if (isFuzzyMatch(input, variant)) {
      return { result: 'fuzzy', message: 'Bijna goed — kleine spelfout, maar geaccepteerd!' };
    }
  }

  return { result: 'wrong' };
}

export function checkYearAnswer(input: string, correctYear: number): AnswerCheck {
  const trimmed = input.trim();
  const parsed = parseInt(trimmed, 10);

  if (Number.isNaN(parsed)) {
    return { result: 'wrong' };
  }

  if (parsed === correctYear) {
    return { result: 'exact' };
  }

  if (levenshtein(trimmed, String(correctYear)) <= 1) {
    return {
      result: 'fuzzy',
      message: `Bijna goed — het juiste jaar is ${correctYear}.`,
    };
  }

  return { result: 'wrong' };
}

export function checkAnswer(
  input: string,
  correctAnswer: string,
  type: 'season-to-club' | 'club-to-season',
  correctYear?: number
): AnswerCheck {
  if (type === 'season-to-club') {
    return checkClubAnswer(input, correctAnswer);
  }
  return checkYearAnswer(input, correctYear ?? parseInt(correctAnswer, 10));
}

export function getTitleCountForClub(club: string, year: number): number {
  return championsWithWinner.filter((c) => c.club === club && c.year <= year).length;
}

export function getTotalTitlesForClub(club: string): number {
  return championsWithWinner.filter((c) => c.club === club).length;
}
