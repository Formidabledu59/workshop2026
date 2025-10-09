'use client'

import { useEffect, useState } from "react";
import McqView from "./McqView";
import TrueFalseView from "./TrueFalseView";
import "@/app/application/page.css";

export default function AppView({ id }) {
  const [appData, setAppData] = useState([]);
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  const [currQuestion, setCurrQuestion] = useState();
  var question = (<></>);
  
  
  useEffect(() => {
    // fetch("../mock/apps2.json")
    fetch(`https://workshop2526.alwaysdata.net/api/app/${id}`)
      .then(response => response.json())
      .then(json => {
        setAppData(json.app);
        // setCurrQuestion(json.app.questions.find(quest => quest.id === 1));
        setCurrQuestion(json.app.questions[currQuestionIndex]);
      });
  }, []);
  
  function nextQuestion() {
    // setCurrQuestion(appData.questions
    //   .find(quest => quest.id === currQuestion.id + 1)
    // );
    setCurrQuestionIndex(currQuestionIndex + 1);
    setCurrQuestion(appData.questions[currQuestionIndex + 1]);
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
  
  return (
    <div className="main-screen" style={{backgroundColor: "white"}}>
      <div style={{backgroundColor: "white"}}>{appData.name}</div> {/*remplacer le bg */}
      <div>{appData.description}</div>
      {question}
    </div>
  );
}
