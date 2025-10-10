'use client'

import { useEffect, useState } from "react";
import McqView from "./McqView";
import TrueFalseView from "./TrueFalseView";
import "@/app/application/page.css";
import NextPlayerToast from "./NextPlayerToast";
import { hasIconAsIcon } from "@/utils/helpers";
import { useRouter } from "next/navigation";

export default function AppView({ id }) {
  const router = useRouter();
  const [appData, setAppData] = useState(null);
  const [currQuestIndex, setCurrQuestIndex] = useState(0);
  const [currQuestion, setCurrQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [score, setScore] = useState(0);
  const [players, setPlayers] = useState();
  
  // SYSTÈME DE SCORE
  const [currentScore, setCurrentScore] = useState(0);
  const [answers, setAnswers] = useState([]); // Pour traquer les réponses
  
  useEffect(() => {
    setPlayers(JSON.parse(localStorage.getItem("userData")).player_names);
    // fetch("../mock/apps2.json")
    fetch(`https://workshop2526.alwaysdata.net/api/app/${id}`)
      .then(response => response.json())
      .then(json => {
        if (json.success && json.app) {
          setAppData(json.app);
          setCurrQuestion(json.app.questions[currQuestIndex]);
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
  // const getMaxScoreUpTo = (questionIndex) => {
  const getMaxScoreUpToNow = () => {
    if (!appData?.questions) return 0;
    return appData.questions
      .slice(0, currQuestIndex + 1)
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
  
  function nextQuestion(gotCorrctAnsw) {
    const points = gotCorrctAnsw ? (currQuestion.difficulty) : 0;
    const newScore = score + points;
    setScore(newScore);

    const nextQuestIndex = currQuestIndex + 1;

    // if (gotCorrctAnsw) setScore(score + 1);
    if (appData.questions.length !== nextQuestIndex) {
      setCurrQuestIndex(nextQuestIndex);
      setCurrQuestion(appData.questions[nextQuestIndex]);
      if (players.length > 1) {
        let nextPlayers = players;
        nextPlayers.push(nextPlayers.shift());
        setPlayers(nextPlayers);
      }
    }
    else {
      // end of app
      // alert("comportement pas encore implémenté: fin de l'app");
      let scores = JSON.parse(localStorage.getItem("scores"));
      scores[appData.id].score = newScore;
      scores[appData.id].state = 2;
      localStorage.setItem("scores", JSON.stringify(scores));
      setTimeout(() => router.push("/home-menu"), 5000);
    }
  }

  // Logique pour l'icône avec cas spécifiques
  const getAppIcon = () => {
    if (hasIconAsIcon.includes(appData.name)) return appData.iconIcon;
    else return appData.background;
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

  let questionComponent = (<></>);
  if (currQuestion) {
    
    if (currQuestion.type === "vrai_faux") {
      questionComponent = (<TrueFalseView key={currQuestion.id} question={currQuestion} nextQuest={nextQuestion} />);
    }
    if (currQuestion.type === "qcm") {
      questionComponent = (<McqView key={currQuestion.id} question={currQuestion} nextQuest={nextQuestion} />);
    }
  }

  const appIcon = getAppIcon();
  
  // return (
  //   <div className="main-screen" style={{backgroundColor: "white"}}>
  //     <div style={{backgroundColor: "white"}}>{appData.name}</div>
  //     <div>{appData.description}</div>
  //     {question}
  //     {players ? (
  //       <NextPlayerToast key={currQuestIndex} player={players[0]} />
  //     ) : (null)}
  //   </div>
  // );

  return (
    <>
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
                  width: `${((currQuestIndex + 1) / (appData.questions?.length || 1)) * 100}%` 
                }}
              ></div>
            </div>
            <div className="progress-text">
              Question {currQuestIndex + 1} sur {appData.questions?.length || 0}
            </div>
            <div className="score-bubble">
              <span className="score-current">{score}</span>
              <span className="score-separator">/</span>
              <span className="score-max">{getMaxScoreUpToNow() + (currQuestion.difficulty)}</span>
            </div>
          </div>
        </div>

        {/* Zone de la question */}
        <div className="question-zone">
          {questionComponent}
        </div>

      </div>
      {/* Toast joueur suivant */}
      {players ? (
        <NextPlayerToast key={currQuestIndex} player={players[0]} />
        ) : (null)}
    </>
  );
}
