import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClubStats } from '../data/champions';
import { clubToSlug, getClubMeta } from '../data/clubMeta';
import ClubLogo from '../components/ClubLogo';
import '../styles/Clubs.css';

export default function Clubs() {
  const [search, setSearch] = useState('');
  const clubs = getClubStats();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return clubs;
    return clubs.filter(
      (c) =>
        c.club.toLowerCase().includes(q) ||
        getClubMeta(c.club).mnemonic?.toLowerCase().includes(q)
    );
  }, [clubs, search]);

  return (
    <div className="clubs-page">
      <div className="page-header">
        <h1>Overzicht per club</h1>
        <p>
          Bekijk wanneer elke club kampioen werd, met ezelsbruggetjes om de jaren
          te onthouden.
        </p>
      </div>

      <input
        type="search"
        className="search-input"
        placeholder="Zoek op clubnaam..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="clubs-grid">
        {filtered.map((club) => {
          const meta = getClubMeta(club.club);

          return (
            <Link
              key={club.club}
              to={`/clubs/${clubToSlug(club.club)}`}
              className="club-card"
            >
              <div className="club-card-header">
                <ClubLogo club={club.club} size={48} />
                <div>
                  <h3>{club.club}</h3>
                  <span className="club-title-count">
                    {club.totalTitles} {club.totalTitles === 1 ? 'titel' : 'titels'}
                  </span>
                </div>
              </div>

              <div className="club-seasons-preview">
                {club.seasons.map((s) => (
                  <span key={s} className="season-chip">
                    {s}
                  </span>
                ))}
              </div>

              {meta.mnemonic && (
                <p className="club-mnemonic-preview">
                  <span className="mnemonic-icon">🧠</span> {meta.mnemonic}
                </p>
              )}

              <span className="club-card-link">Bekijk details →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
