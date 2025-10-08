'use client'

import { useState } from "react";

export default function TrueFalseView({ question, nextQuest }) {
  const [guess, setGuess] = useState();
  const answer = question.answer === "vrai" ? true : false;       // string to boolean
  var status = (<></>);
  
  console.log(guess);
  
  if (typeof guess !== "undefined" && typeof guess !== null) {
    let message;
    if (guess === answer) {
      message = (
        <div>oui</div>
      );
    }
    else {
      message = (
        <div>non</div>
      );
    }
    status = (
      <div>
        {message}
        <p>{question.explanation}</p>
        <button onClick={() => nextQuest()}>Ok</button>
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
      {/* <button onClick={() => nextQuest()}>next</button> */}
    </div>
  );
}
