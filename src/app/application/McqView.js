'use client'

import { useEffect, useState } from "react";

export default function McqView({ question, nextQuest }) {
  // const isAllCorrect = ["Toutes les réponses", "Tous ces signes"].includes(question.answer);
  // if (isAllCorrect) var answer = question.choices;
  // else var answer = [question.answer];
  const answer = [question.answer];

  const [inputs, setInputs] = useState(Object.fromEntries(
    question.choices.map(choice => [choice, false])
  ));
  const [inputsElement, setInputsElement] = useState();
  const [guess, setGuess] = useState();
  const [status, setStatus] = useState(<></>);


  const toggleInput = (input) => {
    setInputs(oldValues => ({
      ...oldValues,
      [input]: !oldValues[input]
    }));
  }

  useEffect(() => {
    setInputsElement(
      Object.entries(inputs).map(([choice, value]) => (
        <span key={choice} >
          <span className="checkBoxLabel" >{choice}</span>
          <label className="checkboxContainer">
            <input type="checkbox" checked={value} onChange={() => toggleInput(choice)} />
            <span className="checkmark"></span>
          </label>
        </span>
      )
    ));
  }, [inputs]);

  const validate = () => {
    let userGuess = Object.entries(inputs)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);
    let corrctInputs = Object.fromEntries(
      question.choices.map(choice => [choice, question.answer === choice])
    );
    let isGuessCorrct = answer.every((value, index) => value === userGuess[index]);
    let glitter;
    

    if (isGuessCorrct) glitter = (
      <div>oui</div>
    );
    else glitter = (
      <div>non</div>
    );

    setStatus(
      <div>
        {glitter}
        <p>{question.explanation}</p>
        <button onClick={() => nextQuest()}>{isGuessCorrct ? "Suivant" : "Ok"}</button>
      </div>
    );
    setGuess(userGuess);
    setInputsElement(
      Object.entries(inputs).map(([choice, value]) => (
        <span key={choice}>
          <span className="checkBoxLabel" >{choice}</span>
          <label className="checkboxContainer" >
            <input type="checkbox" checked={value} disabled />
            <span
              className="checkmark"
              style={{ backgroundColor: inputs[choice] === corrctInputs[choice] ? "green" : "red" }}
            >   
            </span>
          </label>
        </span>
      )
    ));


    // if (isAllCorrect && Object.values(inputs).every(value => value === true)) {
    //   question.answer = question.choices;
    //   // congrat, next
    // }
    // else {
    //   let corrctInputs = Object.fromEntries(
    //     question.choices.map(choice => [choice, question.answer === choice])
    //   )
    //   if (inputs === corrctInputs) {
    //     // congrat, next
    //   }
    //   else {
    //     // nop, next
    //   }
    // }
  }

  return (
    <div>
      <h1>{question.text}</h1>
      <div>
        {/* {Object.entries(inputs).map(([choice, value]) => (
          <input type="checkbox" key={choice} checked={value} onChange={() => toggleInput(choice)} />
        ))} */}
        <div>
          {inputsElement}
        </div>
        <button onClick={validate} disabled={typeof guess == "boolean"}>Valider</button>
      </div>
      {status}
    </div>
  );
}
