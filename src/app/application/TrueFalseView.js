'use client'

import { useState } from "react";

export default function TrueFalseView({ question, nextQuest }) {
  const [guess, setGuess] = useState();
  const answer = question.answer === "vrai" ? true : false;       // string to boolean
  var status = (<></>);
  
  
  if (typeof guess !== "undefined" && typeof guess !== null) {
    let glitter;
    if (guess === answer) {
      glitter = (
        <div>oui</div>
      );
    }
    else {
      glitter = (
        <div>non</div>
      );
    }
    status = (
      <div>
        {glitter}
        <p>{question.explanation}</p>
        <button onClick={() => nextQuest()}>{guess === answer ? "Suivant" : "Ok"}</button>
      </div>
    );
  }

  return (
    <div>
      <h1>{question.text}</h1>
      <div>
        <button onClick={() => setGuess(true)} disabled={typeof guess == "boolean"}>Vrai</button>
        <button onClick={() => setGuess(false)} disabled={typeof guess == "boolean"}>Faux</button>
      </div>
      {status}
    </div>
  );
}
