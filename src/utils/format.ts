import type { Champion } from '../types';

/** Jaar waarin de competitie afliep (bijv. 1918 i.p.v. 1917/18). */
export function formatYear(year: number): string {
  return String(year);
}

export function getChampionYear(champion: Champion): number {
  return champion.year;
}

export function formatChampionYear(champion: Champion): string {
  return formatYear(champion.year);
}
