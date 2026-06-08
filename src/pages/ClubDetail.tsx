import { Link, useParams } from 'react-router-dom';
import { championsWithWinner } from '../data/champions';
import { getClubMeta, slugToClub } from '../data/clubMeta';
import ClubLogo from '../components/ClubLogo';
import '../styles/Clubs.css';

export default function ClubDetail() {
  const { slug } = useParams<{ slug: string }>();
  const clubName = slug ? slugToClub(slug) : null;

  if (!clubName) {
    return (
      <div className="clubs-page">
        <p>Club niet gevonden.</p>
        <Link to="/clubs">← Terug naar clubs</Link>
      </div>
    );
  }

  const titles = championsWithWinner.filter((c) => c.club === clubName);
  const meta = getClubMeta(clubName);

  if (titles.length === 0) {
    return (
      <div className="clubs-page">
        <p>Geen kampioenschappen gevonden voor {clubName}.</p>
        <Link to="/clubs">← Terug naar clubs</Link>
      </div>
    );
  }

  const eredivisieTitles = titles.filter((t) => t.era === 'eredivisie');

  return (
    <div className="clubs-page">
      <Link to="/clubs" className="back-link">
        ← Alle clubs
      </Link>

      <div className="club-detail-header">
        <ClubLogo club={clubName} size={72} />
        <div>
          <h1>{clubName}</h1>
          <p className="club-detail-stats">
            {titles.length} landskampioenschappen
            {eredivisieTitles.length > 0 &&
              ` · ${eredivisieTitles.length} Eredivisie`}
          </p>
          <p className="club-detail-range">
            Eerste titel: {titles[0].season} · Laatste titel:{' '}
            {titles[titles.length - 1].season}
          </p>
        </div>
      </div>

      {meta.mnemonic && (
        <div className="mnemonic-card">
          <h2>
            <span className="mnemonic-icon">🧠</span> Ezelsbruggetje
          </h2>
          <p className="mnemonic-short">{meta.mnemonic}</p>
          {meta.mnemonicDetail && (
            <p className="mnemonic-detail">{meta.mnemonicDetail}</p>
          )}
        </div>
      )}

      <section className="club-titles-section">
        <h2>Alle kampioenschappen</h2>
        <div className="club-titles-timeline">
          {titles.map((t) => (
            <div key={t.id} className="title-entry">
              <span className="title-season">{t.season}</span>
              <span className={`era-tag era-${t.era}`}>
                {t.era === 'eredivisie' ? 'Eredivisie' : 'Voor Eredivisie'}
              </span>
              {t.note && <span className="title-note">{t.note}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="club-decades">
        <h2>Per decennium</h2>
        <div className="decade-grid">
          {groupByDecade(titles).map(([decade, count]) => (
            <div key={decade} className="decade-card">
              <span className="decade-label">{decade}</span>
              <span className="decade-count">
                {count} {count === 1 ? 'titel' : 'titels'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function groupByDecade(titles: { year: number }[]): [string, number][] {
  const map = new Map<string, number>();
  for (const t of titles) {
    const decade = `${Math.floor(t.year / 10) * 10}s`;
    map.set(decade, (map.get(decade) ?? 0) + 1);
  }
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}
