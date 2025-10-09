'use client'

import { useEffect, useState } from "react";

export default function McqView({ 
  question, 
  nextQuest, 
  currentIndex, 
  totalQuestions,
  onAnswerSubmit,
  currentScore,
  maxScoreUpTo
}) {
  const answer = [question.answer];
  const [inputs, setInputs] = useState(Object.fromEntries(
    question.choices.map(choice => [choice, false])
  ));
  const [guess, setGuess] = useState(null);
  const [status, setStatus] = useState(null);
  const [isValidated, setIsValidated] = useState(false);

  const toggleInput = (input) => {
    if (isValidated) return;
    
    setInputs(oldValues => ({
      ...oldValues,
      [input]: !oldValues[input]
    }));
  }

  const validate = () => {
    if (isValidated) return;
    
    let userGuess = Object.entries(inputs)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);
      
    let isCorrect = answer.every((value, index) => value === userGuess[index]) && 
                    userGuess.length === answer.length;

    setGuess(userGuess);
    setIsValidated(true);
    
    // Enregistrer la réponse et calculer le score
    onAnswerSubmit(question.id, isCorrect);
    
    setStatus({
      correct: isCorrect,
      explanation: question.explanation,
      correctAnswer: question.answer,
      pointsEarned: isCorrect ? (question.difficulty) : 0
    });
  }

  return (
    <div className="question-container mcq">
      <div className="question-header">
        <h2 className="question-text">{question.text}</h2>
        <div className="question-difficulty">
          Difficulté: {question.difficulty}/3 • {question.difficulty} points
        </div>
      </div>
      
      {/* GRID 2x2 POUR LES CHOIX */}
      <div className="choices-grid">
        {question.choices.map((choice, index) => (
          <div key={choice} className="choice-item">
            <label 
              className={`choice-label ${inputs[choice] ? 'selected' : ''} ${
                isValidated ? (question.answer === choice ? 'correct' : 
                inputs[choice] ? 'incorrect' : '') : ''
              }`}
              onClick={() => toggleInput(choice)}
            >
              <div className="choice-checkbox">
                <input 
                  type="checkbox" 
                  checked={inputs[choice]} 
                  onChange={() => toggleInput(choice)}
                  disabled={isValidated}
                />
                <span className="checkmark">
                  {inputs[choice] && <span className="check-icon">✓</span>}
                </span>
              </div>
              <span className="choice-text">{choice}</span>
            </label>
          </div>
        ))}
      </div>

      <div className="action-section">
        <button 
          onClick={validate} 
          disabled={isValidated || Object.values(inputs).every(v => !v)}
          className="btn-validate"
        >
          {Object.values(inputs).every(v => !v) ? 'Sélectionnez une réponse' : 'Valider'}
        </button>
      </div>

      {status && (
        <div className={`result-section ${status.correct ? 'correct' : 'incorrect'}`}>
          <div className="result-header">
            <div className="result-icon">
              {status.correct ? '🎉' : '😔'}
            </div>
            <h3>{status.correct ? 'Correct !' : 'Incorrect'}</h3>
            <div className="points-earned">
              +{status.pointsEarned} points
            </div>
          </div>
          
          <div className="explanation-box">
            <p><strong>Explication :</strong></p>
            <p>{status.explanation}</p>
            <p><strong>Bonne réponse :</strong> {status.correctAnswer}</p>
          </div>
          
          {/* BOUTON + SCORE EN BAS À DROITE */}
          <div className="bottom-actions">
            <button onClick={nextQuest} className="btn-next">
              {currentIndex + 1 < totalQuestions ? 'Question suivante →' : 'Voir le résultat 🏆'}
            </button>
            <div className="score-bubble">
              <span className="score-current">{currentScore + status.pointsEarned}</span>
              <span className="score-separator">/</span>
              <span className="score-max">{maxScoreUpTo + (question.difficulty)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
