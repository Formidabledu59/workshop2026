'use client'

import { useEffect, useState } from "react";
import McqView from "./McqView";
import TrueFalseView from "./TrueFalseView";
import "@/app/application/page.css";
import NextPlayerToast from "./NextPlayerToast";

export default function AppView({ id }) {
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
  
  function nextQuestion(gotCorrctAnsw) {
    let nextQuestIndex = currQuestIndex + 1;

    if (gotCorrctAnsw) setScore(score + 1);
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
    }
  }

  if (currQuestion) {
    question = (<></>);
    
    if (currQuestion.type == "vrai_faux") {
      question = (<TrueFalseView key={currQuestion.id} question={currQuestion} nextQuest={nextQuestion} />);
    }
    if (currQuestion.type == "qcm") {
      question = (<McqView key={currQuestion.id} question={currQuestion} nextQuest={nextQuestion} />);
    }
  }

  const appIcon = getAppIcon();
  
  return (
    <div className="main-screen" style={{backgroundColor: "white"}}>
      <div style={{backgroundColor: "white"}}>{appData.name}</div>
      <div>{appData.description}</div>
      {question}
      {players ? (
        <NextPlayerToast key={currQuestIndex} player={players[0]} />
      ) : (undefined)}
    </div>
  );
}
