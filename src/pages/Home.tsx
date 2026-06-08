import { Link } from 'react-router-dom';
import { champions, championsWithWinner } from '../data/champions';

export default function Home() {
  const eredivisieCount = champions.filter((c) => c.era === 'eredivisie' && c.club).length;
  const uniqueClubs = new Set(championsWithWinner.map((c) => c.club)).size;

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">Nederlands voetbal sinds 1889</span>
          <h1>Leer alle landskampioenen van Nederland</h1>
          <p>
            Van HVV en RAP tot Ajax, PSV en Feyenoord — ontdek het complete overzicht
            van alle Nederlandse landskampioenen en test je kennis met interactieve quizzen.
          </p>
          <div className="hero-actions">
            <Link to="/overzicht" className="btn btn-primary">
              Bekijk overzicht
            </Link>
            <Link to="/overhoren" className="btn btn-secondary">
              Start overhoring
            </Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">{champions.length}</span>
            <span className="stat-label">Seizoenen</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{championsWithWinner.length}</span>
            <span className="stat-label">Kampioenschappen</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{uniqueClubs}</span>
            <span className="stat-label">Unieke clubs</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{eredivisieCount}</span>
            <span className="stat-label">Eredivisie-titels</span>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Wat kun je doen?</h2>
        <div className="feature-grid">
          <Link to="/overzicht" className="feature-card">
            <span className="feature-icon">📋</span>
            <h3>Compleet overzicht</h3>
            <p>
              Doorzoek en filter alle kampioenen van 1888/89 tot heden. Per seizoen,
              club of tijdperk.
            </p>
          </Link>
          <Link to="/overhoren" className="feature-card">
            <span className="feature-icon">🎓</span>
            <h3>Overhoringsmodus</h3>
            <p>
              Test jezelf met quizzen: welke club werd kampioen? In welk seizoen?
              Kies je moeilijkheidsgraad.
            </p>
          </Link>
          <Link to="/clubs" className="feature-card">
            <span className="feature-icon">⚽</span>
            <h3>Per club</h3>
            <p>
              Bekijk per club wanneer ze kampioen werden, met ezelsbruggetjes
              om de jaren te onthouden.
            </p>
          </Link>
          <Link to="/statistieken" className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Statistieken</h3>
            <p>
              Bekijk welke clubs de meeste titels wonnen, van de Grote Drie tot
              historische kampioenen als HVV en RAP.
            </p>
          </Link>
        </div>
      </section>

      <section className="timeline-preview">
        <h2>Hoogtepunten uit de geschiedenis</h2>
        <div className="timeline">
          <div className="timeline-item">
            <span className="timeline-year">1889</span>
            <p>HFC wordt een van de eerste kampioenen van Nederland.</p>
          </div>
          <div className="timeline-item">
            <span className="timeline-year">1956</span>
            <p>De Eredivisie wordt opgericht; Ajax wint het eerste seizoen.</p>
          </div>
          <div className="timeline-item">
            <span className="timeline-year">1970</span>
            <p>Feyenoord wint als eerste Nederlandse club de Europacup I.</p>
          </div>
          <div className="timeline-item">
            <span className="timeline-year">2026</span>
            <p>PSV verovert hun 27e landskampioenschap.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
