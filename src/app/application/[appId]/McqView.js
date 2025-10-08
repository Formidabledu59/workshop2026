'use client'

import { useState } from "react";

export default function McqView({ question, nextQuest }) {

  return (
    <div>
      <h1>{question.text}</h1>
      its a mcq<br/>
      {question.text}
      <button onClick={() => nextQuest()}>next</button>
    </div>
  );
}
