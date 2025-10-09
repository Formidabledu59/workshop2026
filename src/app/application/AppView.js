'use client'

import { useEffect, useState } from "react";
import McqView from "./McqView";
import TrueFalseView from "./TrueFalseView";
import "@/app/application/page.css";

export default function AppView({ id }) {
  const [appData, setAppData] = useState(null);
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  const [currQuestion, setCurrQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // SYSTÈME DE SCORE
  const [currentScore, setCurrentScore] = useState(0);
  const [answers, setAnswers] = useState([]); // Pour traquer les réponses
  
  useEffect(() => {
    fetch(`https://workshop2526.alwaysdata.net/api/app/${id}`)
      .then(response => response.json())
      .then(json => {
        if (json.success && json.app) {
          setAppData(json.app);
          setCurrQuestion(json.app.questions[currQuestionIndex]);
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Erreur:', err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  // Fonction pour calculer le score max jusqu'à l'index donné
  const getMaxScoreUpTo = (questionIndex) => {
    if (!appData?.questions) return 0;
    return appData.questions
      .slice(0, questionIndex + 1)
      .reduce((total, question) => total + (question.difficulty), 0);
  };

  // Fonction pour enregistrer une réponse et calculer le score
  const recordAnswer = (questionId, isCorrect) => {
    const question = appData.questions.find(q => q.id === questionId);
    const points = isCorrect ? (question.difficulty) : 0;
    
    // Mettre à jour le score
    setCurrentScore(prevScore => prevScore + points);
    
    // Enregistrer la réponse
    setAnswers(prevAnswers => [
      ...prevAnswers,
      {
        questionId,
        isCorrect,
        points
      }
    ]);
  };
  
  function nextQuestion() {
    if (currQuestionIndex + 1 < appData.questions.length) {
      const nextIndex = currQuestionIndex + 1;
      setCurrQuestionIndex(nextIndex);
      setCurrQuestion(appData.questions[nextIndex]);
    } else {
      // Quiz terminé - redirection vers le menu
      window.history.back();
    }
  }

  // Logique pour l'icône avec cas spécifiques
  const getAppIcon = () => {
    if (id == 4) {
      return 'https://media.cdnandroid.com/item_images/957613/imagen-parcoursup-0ori.jpg';
    }
    if (id == 7) {
      return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMdM9MEQ0ExL1PmInT3U5I8v63YXBEdoIT0Q&s';
    }
    
    if (appData.iconIcon && appData.iconIcon.startsWith('http')) {
      return appData.iconIcon;
    }
    if (appData.background && appData.background.startsWith('http')) {
      return appData.background;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="app-container loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Chargement...</h2>
          <p>Préparation du quiz</p>
        </div>
      </div>
    );
  }

  if (error || !appData) {
    return (
      <div className="app-container error">
        <div className="error-content">
          <div className="error-icon">💥</div>
          <h2>Oops !</h2>
          <p>Impossible de charger l'app #{id}</p>
          <button onClick={() => window.history.back()} className="btn-back">
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  let questionComponent = null;
  if (currQuestion) {
    if (currQuestion.type === "vrai_faux") {
      questionComponent = (
        <TrueFalseView 
          key={currQuestion.id} 
          question={currQuestion} 
          nextQuest={nextQuestion}
          currentIndex={currQuestionIndex}
          totalQuestions={appData.questions.length}
          onAnswerSubmit={recordAnswer}
          currentScore={currentScore}
          maxScoreUpTo={getMaxScoreUpTo(currQuestionIndex)}
        />
      );
    } else if (currQuestion.type === "qcm") {
      questionComponent = (
        <McqView 
          key={currQuestion.id} 
          question={currQuestion} 
          nextQuest={nextQuestion}
          currentIndex={currQuestionIndex}
          totalQuestions={appData.questions.length}
          onAnswerSubmit={recordAnswer}
          currentScore={currentScore}
          maxScoreUpTo={getMaxScoreUpTo(currQuestionIndex)}
        />
      );
    }
  }

  const appIcon = getAppIcon();
  
  return (
    <div className="app-container">
      {/* BOUTON RETOUR TOUJOURS AU-DESSUS */}
      <div className="floating-back-btn">
        <button onClick={() => window.history.back()} className="back-btn-floating">
          ← Menu
        </button>
      </div>

      {/* Header avec info de l'app */}
      <div className="app-header">        
        <div className="app-info">
          <div className="app-icon-container">
            {appIcon ? (
              <img 
                src={appIcon} 
                alt={appData.name} 
                className="app-icon-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="app-icon-fallback" 
              style={{ 
                background: appData.color || '#3b82f6',
                display: appIcon ? 'none' : 'flex'
              }}
            >
              {appData.name?.charAt(0) || '?'}
            </div>
          </div>
          
          <div className="app-details">
            <h1 className="app-title">{appData.name}</h1>
            <p className="app-description">{appData.description}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${((currQuestionIndex + 1) / (appData.questions?.length || 1)) * 100}%` 
              }}
            ></div>
          </div>
          <div className="progress-text">
            Question {currQuestionIndex + 1} sur {appData.questions?.length || 0}
          </div>
        </div>
      </div>

      {/* Zone de la question */}
      <div className="question-zone">
        {questionComponent}
      </div>
    </div>
  );
}
