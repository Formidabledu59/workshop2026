'use client'

import { useState } from "react";

// export default function TrueFalseView({ 
//   question, 
//   nextQuest, 
//   currentIndex, 
//   totalQuestions,
//   onAnswerSubmit,
//   currentScore,
//   maxScoreUpTo
// }) {
export default function TrueFalseView({ 
  question, 
  nextQuest, 
}) {
  const [guess, setGuess] = useState(null);
  const [status, setStatus] = useState(null);
  const [isValidated, setIsValidated] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);    // decommissioned
  const answer = question.answer === "vrai";

  const handleChoice = (choice) => {
    if (isValidated) return;
    setGuess(choice);
  }

  const validate = () => {
    if (guess === null || isValidated) return;
    setIsValidated(true);
    
    const isCorrect = guess === answer;
    // const points = isCorrect ? (question.difficulty) : 0;

    // new
    setStatus({
      isCorrect: isCorrect,
      pointsEarned: isCorrect ? (question.difficulty) : 0
    });
    
    setPointsEarned(isCorrect ? (question.difficulty) : 0);
    // onAnswerSubmit(question.id, isCorrect);
  }

  // const isCorrect = guess === answer;

  return (
    <div className="question-container true-false">
      <div className="question-header">
        <h2 className="question-text">{question.text}</h2>
        <div className="question-difficulty">
          Difficulté: {question.difficulty}/3 • {question.difficulty} points
        </div>
      </div>
      
      <div className="tf-choices">
        <button 
          className={`tf-choice vrai ${guess === true ? 'selected' : ''} ${
            isValidated ? (answer === true ? 'correct' : 
            guess === true ? 'incorrect' : '') : ''
          }`}
          onClick={() => handleChoice(true)}
          disabled={isValidated}
        >
          <span className="choice-icon">✅</span>
          <span className="choice-label">Vrai</span>
        </button>
        
        <button 
          className={`tf-choice faux ${guess === false ? 'selected' : ''} ${
            isValidated ? (answer === false ? 'correct' : 
            guess === false ? 'incorrect' : '') : ''
          }`}
          onClick={() => handleChoice(false)}
          disabled={isValidated}
        >
          <span className="choice-icon">❌</span>
          <span className="choice-label">Faux</span>
        </button>
      </div>

      <div className="action-section">
        <button 
          onClick={validate} 
          disabled={isValidated || guess === null}
          className="btn-validate"
        >
          {guess === null ? 'Choisissez une réponse' : 'Valider'}
        </button>
      </div>

      {status && (
        <div className={`result-section ${status.isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="result-header">
            <div className="result-icon">
              {status.isCorrect ? '🎉' : '😔'}
            </div>
            <h3>{status.isCorrect ? 'Correct !' : 'Incorrect'}</h3>
            <div className="points-earned">
              +{status.pointsEarned} points
            </div>
          </div>
          
          <div className="explanation-box">
            <p><strong>Explication :</strong></p>
            <p>{question.explanation}</p>
            <p><strong>Bonne réponse :</strong> {question.answer}</p>
          </div>
          
          {/* BOUTON + SCORE EN BAS À DROITE */}
          <div className="bottom-actions">
            <button onClick={() => nextQuest(status.isCorrect)} className="btn-next">
              Question suivante →
            </button>
          </div>
          {/* <div className="bottom-actions">
            <button onClick={nextQuest} className="btn-next">
              {currentIndex + 1 < totalQuestions ? 'Question suivante →' : 'Voir le résultat 🏆'}
            </button>
            <div className="score-bubble">
              <span className="score-current">{currentScore + pointsEarned}</span>
              <span className="score-separator">/</span>
              <span className="score-max">{maxScoreUpTo + (question.difficulty)}</span>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
}
