import { useCallback, useState, type FormEvent } from 'react';
import { generateQuiz, getScoreFeedback } from '../utils/quiz';
import type { QuizOptions } from '../utils/quiz';
import { checkAnswer } from '../utils/answerMatch';
import { formatYear } from '../utils/format';
import { getMeta, useDataset } from '../data/DatasetContext';
import EntityLogo from './EntityLogo';
import type { AnswerStatus } from '../types';
import '../styles/Quiz.css';

type QuizProps = QuizOptions;

export default function Quiz(props: QuizProps) {
  const dataset = useDataset();
  const [questions, setQuestions] = useState(() => generateQuiz(dataset, props));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<AnswerStatus>('pending');
  const [userAnswer, setUserAnswer] = useState('');
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];
  const isAnswered = status !== 'pending';
  const isCorrect = status === 'correct' || status === 'fuzzy' || status === 'approved';

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (isAnswered || !input.trim()) return;

      const check = checkAnswer(
        input,
        current.correctAnswer,
        current.type,
        current.correctYear,
        dataset.aliases
      );

      setUserAnswer(input.trim());

      if (check.result === 'exact') {
        setStatus('correct');
        setScore((s) => s + 1);
      } else if (check.result === 'fuzzy') {
        setStatus('fuzzy');
        setScore((s) => s + 1);
      } else {
        setStatus('wrong');
      }
    },
    [isAnswered, input, current, dataset]
  );

  const handleApprove = () => {
    if (status === 'wrong') {
      setStatus('approved');
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setInput('');
      setUserAnswer('');
      setStatus('pending');
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setQuestions(generateQuiz(dataset, props));
    setCurrentIndex(0);
    setScore(0);
    setInput('');
    setUserAnswer('');
    setStatus('pending');
    setFinished(false);
  };

  const wrongMeta =
    isAnswered && !isCorrect ? getMeta(dataset, current.champion.winner) : null;

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="quiz quiz-finished">
        <div className="result-card">
          <h2>Overhoring voltooid!</h2>
          <div className="final-score">
            <p className="score-text">
              Je scoorde {score} van de {questions.length} vragen
            </p>
            <p className="percentage">{percentage}%</p>
          </div>
          <div className="feedback">
            <p>{getScoreFeedback(percentage)}</p>
          </div>
          <button className="restart-btn" onClick={handleRestart}>
            Opnieuw proberen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz-header">
        <span className="progress">
          Vraag {currentIndex + 1} van {questions.length}
          {props.order === 'chronological' && (
            <span className="order-badge"> · Op volgorde</span>
          )}
        </span>
        <span className="score-display">Score: {score}</span>
      </div>

      <div className="quiz-content">
        <div className="question">
          <h2>{current.question}</h2>
          {current.type === 'season-to-club' && (
            <p className="question-hint">{dataset.winnerInputHint}</p>
          )}
          {current.type === 'club-to-season' && (
            <p className="question-hint">Typ het jaartal (bijv. 1988)</p>
          )}
        </div>

        {!isAnswered ? (
          <form className="answer-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="answer-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                current.type === 'season-to-club'
                  ? dataset.winnerInputPlaceholder
                  : 'Bijv. 1988'
              }
              autoFocus
              autoComplete="off"
            />
            <button type="submit" className="submit-btn" disabled={!input.trim()}>
              Controleer antwoord
            </button>
          </form>
        ) : (
          <>
            <div
              className={`feedback-message ${isCorrect ? 'correct' : 'incorrect'}`}
            >
              {status === 'correct' && <p>✓ Goed antwoord!</p>}
              {status === 'fuzzy' && (
                <p>✓ Goed! Kleine spelfout, maar geaccepteerd.</p>
              )}
              {status === 'approved' && (
                <p>✓ Goedgekeurd — je antwoord telt mee.</p>
              )}
              {status === 'wrong' && (
                <>
                  <p>
                    ✗ Helaas! Jouw antwoord: <strong>{userAnswer}</strong>
                  </p>
                  <p className="correct-answer-reveal">
                    Het juiste antwoord is:{' '}
                    <strong>
                      {current.type === 'season-to-club' ? (
                        <span className="correct-with-logo">
                          <EntityLogo winner={current.correctAnswer} size={24} />
                          {current.correctAnswer}
                        </span>
                      ) : (
                        formatYear(current.correctYear)
                      )}
                    </strong>
                  </p>
                </>
              )}
              {wrongMeta?.mnemonic && status === 'wrong' && (
                <p className="mnemonic-hint">
                  🧠 Ezelsbruggetje ({current.champion.winner}): {wrongMeta.mnemonic}
                </p>
              )}
            </div>

            <div className="answer-actions">
              {status === 'wrong' && (
                <button className="approve-btn" onClick={handleApprove}>
                  Toch goed keuren
                </button>
              )}
              <button className="next-btn" onClick={handleNext}>
                {currentIndex < questions.length - 1
                  ? 'Volgende vraag'
                  : 'Bekijk resultaat'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
