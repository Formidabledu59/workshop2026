'use client'
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './quiz.css';

export default function QuizApp() {
  const params = useParams();
  const router = useRouter();
  const appId = params.id; // Récupère l'ID depuis l'URL

  // États du quiz
  const [app, setApp] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, [appId]);

  // Charger le quiz depuis ton API
  const loadQuiz = async () => {
    try {
      setLoading(true);
      console.log(`🔄 Chargement app ${appId}...`);
      
      const response = await fetch(`https://workshop2526.alwaysdata.net/api/app/${appId}`);
      const data = await response.json();
      
      if (data.success && data.app) {
        setApp(data.app);
        setQuestions(data.app.questions || []);
        console.log(`✅ Quiz chargé: ${data.app.name} (${data.app.questions?.length || 0} questions)`);
      } else {
        setError('Quiz non trouvé');
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  // Sélectionner une réponse
  const selectAnswer = (answer) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  // Valider la réponse
  const validateAnswer = () => {
    if (!selectedAnswer) return;
    
    setIsAnswered(true);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setShowExplanation(true);
  };

  // Question suivante
  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setIsAnswered(false);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  // Terminer le quiz
  const finishQuiz = () => {
    setIsQuizFinished(true);
    
    // Sauvegarder le score (optionnel)
    saveScore();
  };

  // Sauvegarder le score
  const saveScore = async () => {
    try {
      const scoreData = {
        user_email: 'user@example.com', // Tu peux récupérer depuis localStorage
        app_id: parseInt(appId),
        score: score,
        total: questions.length
      };
      
      await fetch('https://workshop2526.alwaysdata.net/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreData)
      });
      
      console.log('✅ Score sauvegardé');
    } catch (error) {
      console.error('❌ Erreur sauvegarde score:', error);
    }
  };

  // Recommencer le quiz
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setScore(0);
    setIsAnswered(false);
    setShowExplanation(false);
    setIsQuizFinished(false);
  };

  // Retour au menu
  const goHome = () => {
    router.push('/home-menu');
  };

  // Rendu conditionnel
  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="error">
          <h2>❌ {error}</h2>
          <button onClick={goHome} className="home-btn">🏠 Retour</button>
        </div>
      </div>
    );
  }

  if (!app || questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="error">
          <h2>❌ Aucune question disponible</h2>
          <button onClick={goHome} className="home-btn">🏠 Retour</button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-container" style={{background: app.background_url || app.color}}>
      {!isQuizFinished ? (
        <div className="quiz-content">
          {/* Header */}
          <div className="quiz-header">
            <button onClick={goHome} className="back-btn">← Menu</button>
            <h1 className="app-title">{app.name}</h1>
            <div className="score-display">Score: {score}</div>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${progress}%`}}></div>
            </div>
            <div className="progress-text">
              Question {currentQuestionIndex + 1} / {questions.length}
            </div>
          </div>

          {/* Question */}
          <div className="question-container">
            <h2 className="question-text">{currentQuestion.text}</h2>

            {/* Réponses */}
            <div className="answers-container">
              {currentQuestion.type === 'vrai_faux' ? (
                <>
                  <button
                    className={`answer-btn ${selectedAnswer === 'vrai' ? 'selected' : ''} ${isAnswered && currentQuestion.answer === 'vrai' ? 'correct' : ''} ${isAnswered && selectedAnswer === 'vrai' && currentQuestion.answer !== 'vrai' ? 'incorrect' : ''}`}
                    onClick={() => selectAnswer('vrai')}
                    disabled={isAnswered}
                  >
                    ✅ Vrai
                  </button>
                  <button
                    className={`answer-btn ${selectedAnswer === 'faux' ? 'selected' : ''} ${isAnswered && currentQuestion.answer === 'faux' ? 'correct' : ''} ${isAnswered && selectedAnswer === 'faux' && currentQuestion.answer !== 'faux' ? 'incorrect' : ''}`}
                    onClick={() => selectAnswer('faux')}
                    disabled={isAnswered}
                  >
                    ❌ Faux
                  </button>
                </>
              ) : (
                currentQuestion.choices?.map((choice, index) => (
                  <button
                    key={index}
                    className={`answer-btn ${selectedAnswer === choice ? 'selected' : ''} ${isAnswered && currentQuestion.answer === choice ? 'correct' : ''} ${isAnswered && selectedAnswer === choice && currentQuestion.answer !== choice ? 'incorrect' : ''}`}
                    onClick={() => selectAnswer(choice)}
                    disabled={isAnswered}
                  >
                    {choice}
                  </button>
                ))
              )}
            </div>

            {/* Explication */}
            {showExplanation && (
              <div className="explanation">
                <div className={`result ${selectedAnswer === currentQuestion.answer ? 'correct' : 'incorrect'}`}>
                  {selectedAnswer === currentQuestion.answer ? '✅ Correct !' : '❌ Incorrect'}
                </div>
                <p>{currentQuestion.explanation}</p>
                <p><strong>Bonne réponse:</strong> {currentQuestion.answer}</p>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="action-buttons">
              {!isAnswered ? (
                <button 
                  className="validate-btn"
                  onClick={validateAnswer}
                  disabled={!selectedAnswer}
                >
                  Valider
                </button>
              ) : (
                <button className="next-btn" onClick={nextQuestion}>
                  {currentQuestionIndex + 1 < questions.length ? 'Question suivante' : 'Voir les résultats'}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Écran de résultats */
        <div className="results-container">
          <div className="results-content">
            <h1>🎉 Quiz terminé !</h1>
            
            <div className="final-score">
              <div className="score-circle">
                <span className="score-number">{score}</span>
                <span className="score-total">/ {questions.length}</span>
              </div>
              <div className="score-percentage">
                {Math.round((score / questions.length) * 100)}%
              </div>
            </div>

            <div className="score-message">
              {score === questions.length ? '🏆 Parfait !' :
               score >= questions.length * 0.8 ? '🎯 Très bien !' :
               score >= questions.length * 0.6 ? '👍 Bien !' :
               '📚 À revoir !'}
            </div>

            <div className="results-actions">
              <button className="restart-btn" onClick={restartQuiz}>
                🔄 Recommencer
              </button>
              <button className="home-btn" onClick={goHome}>
                🏠 Menu principal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}