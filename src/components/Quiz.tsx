import { useCallback, useState } from 'react';
import { generateQuiz, getScoreFeedback } from '../utils/quiz';
import type { QuizMode, QuizQuestion } from '../types';
import '../styles/Quiz.css';

interface QuizProps {
  questionCount: number;
  mode: QuizMode;
  eraFilter: 'all' | 'eredivisie' | 'voor-eredivisie';
}

export default function Quiz({ questionCount, mode, eraFilter }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    generateQuiz(questionCount, mode, eraFilter)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];
  const isAnswered = selected !== null;

  const handleAnswer = useCallback(
    (answer: string) => {
      if (isAnswered) return;
      setSelected(answer);
      if (answer === current.correctAnswer) {
        setScore((s) => s + 1);
      }
    },
    [isAnswered, current]
  );

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setQuestions(generateQuiz(questionCount, mode, eraFilter));
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  };

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
        </span>
        <span className="score-display">Score: {score}</span>
      </div>

      <div className="quiz-content">
        <div className="question">
          <h2>{current.question}</h2>
        </div>

        <div className="options">
          {current.options.map((option) => {
            let className = 'option-btn';
            if (isAnswered) {
              if (option === current.correctAnswer) className += ' correct';
              else if (option === selected) className += ' incorrect';
            }

            return (
              <button
                key={option}
                className={className}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
              >
                {option}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <>
            <div
              className={`feedback-message ${
                selected === current.correctAnswer ? 'correct' : 'incorrect'
              }`}
            >
              <p>
                {selected === current.correctAnswer
                  ? '✓ Goed antwoord!'
                  : `✗ Helaas! Het juiste antwoord is: ${current.correctAnswer}`}
              </p>
            </div>
            <button className="next-btn" onClick={handleNext}>
              {currentIndex < questions.length - 1 ? 'Volgende vraag' : 'Bekijk resultaat'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
