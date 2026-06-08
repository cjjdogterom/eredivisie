import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { champions } from '../data/champions';
import { clubToSlug, getClubMeta } from '../data/clubMeta';
import ClubLogo from '../components/ClubLogo';
import type { Era } from '../types';
import '../styles/Overview.css';

type EraFilter = 'all' | Era;

const eraLabels: Record<Era, string> = {
  'voor-eredivisie': 'Voor Eredivisie',
  eredivisie: 'Eredivisie',
  'geen-kampioen': 'Geen kampioen',
};

export default function Overview() {
  const [search, setSearch] = useState('');
  const [eraFilter, setEraFilter] = useState<EraFilter>('all');
  const [decade, setDecade] = useState<string>('all');

  const decades = useMemo(() => {
    const set = new Set<string>();
    for (const c of champions) {
      set.add(`${Math.floor(c.year / 10) * 10}s`);
    }
    return ['all', ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return champions.filter((c) => {
      if (eraFilter !== 'all' && c.era !== eraFilter) return false;

      if (decade !== 'all') {
        const cDecade = `${Math.floor(c.year / 10) * 10}s`;
        if (cDecade !== decade) return false;
      }

      if (!query) return true;

      const meta = c.club ? getClubMeta(c.club) : null;

      return (
        c.season.toLowerCase().includes(query) ||
        c.club?.toLowerCase().includes(query) ||
        c.city?.toLowerCase().includes(query) ||
        c.note?.toLowerCase().includes(query) ||
        meta?.mnemonic?.toLowerCase().includes(query)
      );
    });
  }, [search, eraFilter, decade]);

  return (
    <div className="overview-page">
      <div className="page-header">
        <h1>Overzicht kampioenen</h1>
        <p>
          Alle {champions.length} seizoenen van het Nederlands landskampioenschap,
          van 1888/89 tot 2025/26.
        </p>
      </div>

      <div className="filters">
        <input
          type="search"
          className="search-input"
          placeholder="Zoek op seizoen, club of stad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={eraFilter}
          onChange={(e) => setEraFilter(e.target.value as EraFilter)}
        >
          <option value="all">Alle tijdperken</option>
          <option value="voor-eredivisie">Voor Eredivisie (1889–1956)</option>
          <option value="eredivisie">Eredivisie (1956–heden)</option>
          <option value="geen-kampioen">Geen kampioen</option>
        </select>
        <select
          className="filter-select"
          value={decade}
          onChange={(e) => setDecade(e.target.value)}
        >
          {decades.map((d) => (
            <option key={d} value={d}>
              {d === 'all' ? 'Alle decennia' : d}
            </option>
          ))}
        </select>
      </div>

      <p className="results-count">
        {filtered.length} {filtered.length === 1 ? 'resultaat' : 'resultaten'}
      </p>

      <div className="champions-table-wrapper">
        <table className="champions-table">
          <thead>
            <tr>
              <th>Seizoen</th>
              <th>Kampioen</th>
              <th>Stad</th>
              <th>Tijdperk</th>
              <th>Ezelsbruggetje</th>
              <th>Opmerking</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const meta = c.club ? getClubMeta(c.club) : null;

              return (
                <tr key={c.id} className={c.club ? '' : 'no-champion'}>
                  <td className="season-cell">{c.season}</td>
                  <td className="club-cell">
                    {c.club ? (
                      <>
                        <ClubLogo club={c.club} size={32} />
                        <Link to={`/clubs/${clubToSlug(c.club)}`} className="club-link">
                          {c.club}
                        </Link>
                      </>
                    ) : (
                      <span className="no-winner">—</span>
                    )}
                  </td>
                  <td>{c.city ?? '—'}</td>
                  <td>
                    <span className={`era-tag era-${c.era}`}>{eraLabels[c.era]}</span>
                  </td>
                  <td className="mnemonic-cell">
                    {meta?.mnemonic ? (
                      <span className="mnemonic-tooltip" title={meta.mnemonicDetail}>
                        🧠 {meta.mnemonic}
                      </span>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="note-cell">{c.note ?? ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
