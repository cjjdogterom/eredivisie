import { getClubStats } from '../data/champions';
import '../styles/Stats.css';

export default function Stats() {
  const stats = getClubStats();
  const maxTitles = stats[0]?.totalTitles ?? 1;

  return (
    <div className="stats-page">
      <div className="page-header">
        <h1>Statistieken</h1>
        <p>
          Ranglijst van alle clubs met minstens één landskampioenschap sinds 1889.
        </p>
      </div>

      <div className="stats-summary">
        <div className="summary-card">
          <span className="summary-number">{stats.length}</span>
          <span className="summary-label">Clubs met titel</span>
        </div>
        <div className="summary-card highlight">
          <span className="summary-number">{stats[0]?.club}</span>
          <span className="summary-label">Meeste titels ({stats[0]?.totalTitles})</span>
        </div>
        <div className="summary-card">
          <span className="summary-number">
            {stats.filter((s) => s.eredivisieTitles > 0).length}
          </span>
          <span className="summary-label">Met Eredivisie-titel</span>
        </div>
      </div>

      <div className="stats-table-wrapper">
        <table className="stats-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Club</th>
              <th>Totaal</th>
              <th>Eredivisie</th>
              <th>Eerste titel</th>
              <th>Laatste titel</th>
              <th>Verdeling</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((club, index) => (
              <tr key={club.club} className={index < 3 ? `top-${index + 1}` : ''}>
                <td className="rank-cell">{index + 1}</td>
                <td className="club-name-cell">
                  {index < 3 && <span className="medal">{['🥇', '🥈', '🥉'][index]}</span>}
                  {club.club}
                </td>
                <td className="title-count">{club.totalTitles}</td>
                <td>{club.eredivisieTitles}</td>
                <td>{club.firstTitle}</td>
                <td>{club.lastTitle}</td>
                <td className="bar-cell">
                  <div className="title-bar">
                    <div
                      className="title-bar-fill"
                      style={{ width: `${(club.totalTitles / maxTitles) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="fun-facts">
        <h2>Wist je dat?</h2>
        <ul>
          <li>
            Ajax, PSV en Feyenoord wonnen samen meer dan 75% van alle
            landskampioenschappen.
          </li>
          <li>
            HVV (Den Haag) domineerde het begin van de 20e eeuw met 10 titels —
            de meeste van alle clubs buiten de Grote Drie.
          </li>
          <li>
            Het seizoen 2019/20 werd afgebroken door COVID-19; er werd geen
            kampioen uitgeroepen.
          </li>
          <li>
            DWS promoveerde in 1962/63 en werd het seizoen erna meteen kampioen.
          </li>
        </ul>
      </section>
    </div>
  );
}
