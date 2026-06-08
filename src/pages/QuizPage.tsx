import { useState } from 'react';
import Quiz from '../components/Quiz';
import { getPoolSize } from '../utils/quiz';
import type { QuizMode, QuizOrder } from '../types';

const modes: { value: QuizMode; label: string; description: string }[] = [
  {
    value: 'season-to-club',
    label: 'Seizoen → Club',
    description: 'Welke club werd kampioen in een bepaald seizoen?',
  },
  {
    value: 'club-to-season',
    label: 'Club → Seizoen',
    description: 'In welk seizoen werd een club kampioen?',
  },
  {
    value: 'mixed',
    label: 'Gemengd',
    description: 'Afwisselend seizoen→club en club→seizoen.',
  },
];

const orders: { value: QuizOrder; label: string; description: string }[] = [
  {
    value: 'random',
    label: 'Willekeurig',
    description: 'Vragen in willekeurige volgorde.',
  },
  {
    value: 'chronological',
    label: 'Op volgorde',
    description: 'Chronologisch van oud naar nieuw (1889 → heden).',
  },
  {
    value: 'reverse-chronological',
    label: 'Omgekeerd',
    description: 'Van nieuw naar oud (heden → 1889).',
  },
];

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<QuizMode>('mixed');
  const [order, setOrder] = useState<QuizOrder>('random');
  const [eraFilter, setEraFilter] = useState<'all' | 'eredivisie' | 'voor-eredivisie'>('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [allYears, setAllYears] = useState(false);
  const [quizKey, setQuizKey] = useState(0);

  const poolSize = getPoolSize(eraFilter);
  const effectiveCount = allYears ? poolSize : questionCount;

  const handleStart = () => {
    setQuizKey((k) => k + 1);
    setStarted(true);
  };

  const handleStartAllYears = () => {
    setAllYears(true);
    setMode('mixed');
    setOrder('chronological');
    setQuizKey((k) => k + 1);
    setStarted(true);
  };

  if (started) {
    return (
      <div className="quiz-page">
        <div className="page-header compact">
          <h1>Overhoring</h1>
          <button className="btn btn-outline" onClick={() => { setStarted(false); setAllYears(false); }}>
            ← Instellingen
          </button>
        </div>
        <Quiz
          key={quizKey}
          count={effectiveCount}
          mode={mode}
          eraFilter={eraFilter}
          order={order}
          allYears={allYears}
        />
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="page-header">
        <h1>Overhoringsmodus</h1>
        <p>Stel je quiz samen en test je kennis van de Nederlandse landskampioenen.</p>
      </div>

      <div className="quiz-quick-start">
        <button className="btn btn-primary btn-large" onClick={handleStartAllYears}>
          Alle {poolSize} jaren overhoren (gemengd, op volgorde)
        </button>
        <p className="quick-start-hint">
          Doorloop chronologisch elk kampioenschap van 1889 tot heden.
        </p>
      </div>

      <div className="quiz-setup">
        <section className="setup-section">
          <h2>Vraagtype</h2>
          <div className="mode-grid">
            {modes.map((m) => (
              <button
                key={m.value}
                className={`mode-card ${mode === m.value ? 'selected' : ''}`}
                onClick={() => setMode(m.value)}
              >
                <h3>{m.label}</h3>
                <p>{m.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="setup-section">
          <h2>Volgorde</h2>
          <div className="mode-grid">
            {orders.map((o) => (
              <button
                key={o.value}
                className={`mode-card ${order === o.value ? 'selected' : ''}`}
                onClick={() => setOrder(o.value)}
              >
                <h3>{o.label}</h3>
                <p>{o.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="setup-section">
          <h2>Tijdperk</h2>
          <div className="era-options">
            {[
              { value: 'all' as const, label: `Alle seizoenen (${getPoolSize('all')})` },
              { value: 'eredivisie' as const, label: `Alleen Eredivisie (${getPoolSize('eredivisie')})` },
              {
                value: 'voor-eredivisie' as const,
                label: `Voor Eredivisie (${getPoolSize('voor-eredivisie')})`,
              },
            ].map((opt) => (
              <label key={opt.value} className="era-option">
                <input
                  type="radio"
                  name="era"
                  value={opt.value}
                  checked={eraFilter === opt.value}
                  onChange={() => setEraFilter(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </section>

        <section className="setup-section">
          <h2>Aantal vragen</h2>
          <label className="era-option all-years-option">
            <input
              type="checkbox"
              checked={allYears}
              onChange={(e) => setAllYears(e.target.checked)}
            />
            Alle jaren ({poolSize} vragen)
          </label>
          {!allYears && (
            <>
              <h3 className="slider-label">{questionCount} vragen</h3>
              <input
                type="range"
                min={5}
                max={Math.min(50, poolSize)}
                step={5}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="question-slider"
              />
              <div className="slider-labels">
                <span>5</span>
                <span>25</span>
                <span>{Math.min(50, poolSize)}</span>
              </div>
            </>
          )}
        </section>

        <button className="btn btn-secondary btn-large" onClick={handleStart}>
          Start aangepaste overhoring
        </button>
      </div>
    </div>
  );
}
