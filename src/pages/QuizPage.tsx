import { useState } from 'react';
import Quiz from '../components/Quiz';
import type { QuizMode } from '../types';

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
    description: 'Een mix van beide vraagtypen.',
  },
];

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<QuizMode>('mixed');
  const [eraFilter, setEraFilter] = useState<'all' | 'eredivisie' | 'voor-eredivisie'>('all');
  const [questionCount, setQuestionCount] = useState(10);
  const [quizKey, setQuizKey] = useState(0);

  const handleStart = () => {
    setQuizKey((k) => k + 1);
    setStarted(true);
  };

  if (started) {
    return (
      <div className="quiz-page">
        <div className="page-header compact">
          <h1>Overhoring</h1>
          <button className="btn btn-outline" onClick={() => setStarted(false)}>
            ← Instellingen
          </button>
        </div>
        <Quiz
          key={quizKey}
          questionCount={questionCount}
          mode={mode}
          eraFilter={eraFilter}
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
          <h2>Tijdperk</h2>
          <div className="era-options">
            {[
              { value: 'all' as const, label: 'Alle seizoenen' },
              { value: 'eredivisie' as const, label: 'Alleen Eredivisie (1956+)' },
              { value: 'voor-eredivisie' as const, label: 'Voor Eredivisie (1889–1956)' },
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
          <h2>Aantal vragen: {questionCount}</h2>
          <input
            type="range"
            min={5}
            max={25}
            step={5}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="question-slider"
          />
          <div className="slider-labels">
            <span>5</span>
            <span>10</span>
            <span>15</span>
            <span>20</span>
            <span>25</span>
          </div>
        </section>

        <button className="btn btn-primary btn-large" onClick={handleStart}>
          Start overhoring
        </button>
      </div>
    </div>
  );
}
