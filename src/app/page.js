'use client'

import "@/app/page.css";
import { showElement, hideElement, selctTxt } from "@/utils/helpers.js"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";


export default function Home() {
  const router = useRouter();
  const [grpName, setGrpName] = useState("");
  const playerNb_min = 1;
  const playerNb_max = 4;
  const [playerNb, setplayerNb] = useState(playerNb_min);
  const [listOfNames, setListOfNames] = useState([]);
  const [listOfNamesInput, setListOfNamesInput] = useState();

  useEffect(() => {
    let nextInputs = []
    for (let i = 1; i <= playerNb; i++) {
      nextInputs.push(
        <input
          type="text"
          name={`player_${i}`}
          key={`player_${i}`}
          required
          className="form-control"
          onClick={e => selctTxt(e)}
          value={`Joueur ${i}`}
          onChange={e => {setNameInList(e.target.value, i)}}
        />
      );
    }
    setListOfNamesInput(nextInputs);
  }, [playerNb]);

  function setNameInList(newValue, atIndex) {
    const nextList = listOfNames.map((item, index) => {
      if (atIndex === index) return newValue;
      else return item;
    });
    setListOfNames(nextList);
  }

  function registerUser(event) {
    event.preventDefault();


    let listOfNames = [...document.getElementById("listOfNames").getElementsByTagName("input")];
    listOfNames = listOfNames.map(input => input.value);
    
    const formData = new FormData(event.target);
    const userData = {
      grp_name: formData.get('grp_name') || document.getElementById('grp_name').value,        // bdd + local
      player_nb: formData.get('player_nb') || document.getElementById('player_nb').value,     // local
      player_names: listOfNames                                                               // local
    };

    // Validation simple
    // registration en bdd

    // Sauvegarder en localStorage
    saveUserData(userData);

    // Redirection vers main.html
    setTimeout(() => {
      // window.location.href = "/workshop2026/home-menu";
      router.push("/home-menu");
    }, 1000);
  }

  return (
    // Écran de verrouillage
    <div id="lock-screen" className="screen active">
      <div className="lock-background">
        <div className="lock-content">
          <div className="time-display">
            <div className="lock-time" id="lockTime">14:00</div>
            <div className="lock-date" id="lockDate">Lundi 6 octobre</div>
          </div>
                
          <div className="unlock-section">
            <div className="unlock-indicator"></div>
            <p className="unlock-text">Balayez vers le haut pour déverrouiller</p>
            {/* <button className="unlock-btn" onClick={showRegistration()}>
              <span className="unlock-icon">🔓</span>
              Déverrouiller
            </button> */}
            <input
              type="range"
              id="unlock-btnNew"
              min="0"
              max="1"
              step="any"
              value="0"
              onChange={e => {if (e.target.value > 0.5) showRegistration()}}
            />
          </div>
          </div>
        </div>

        {/* Formulaire d'inscription */}
        <div id="registration-form" className="registration-modal hidden">
          <div className="modal-backdrop" onClick={hideRegistration}></div>
          <div className="modal-content">
            <h2>Bienvenue !</h2>
            <p>Dites-nous en plus sur vous avant de commencer</p>
              
            {/* <form id="userForm" onsubmit="registerUser(event)"> */}
            <form id="userForm" onSubmit={registerUser} >
              <div className="form-group">
                <label className="form-label" htmlFor="grp_name">Blaze du groupe</label>
                <input
                  type="text"
                  id="grp_name"
                  className="form-control"
                  required
                  value={grpName}
                  onChange={e => setGrpName(e.target.value)}
                  onClick={e => selctTxt(e)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="player_nb">Nombre de joueurs</label>
                <input
                  type="number"
                  id="player_nb"
                  className="form-control"
                  min={playerNb_min} max={playerNb_max}
                  required
                  value={playerNb}
                  onChange={e => setplayerNb(e.target.value)}
                  onClick={e => selctTxt(e)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="player_name">Blazes des joueurs</label>
                <div id="listOfNames">
                  {listOfNamesInput}
                </div>
              </div>
              
              <button type="submit" className="btn-primary">Let's start!</button>
            </form>
          </div>
        </div>
    </div>
  );
}

function showRegistration() {
  showElement('registration-form');
  document.getElementById('registration-form').classList.add('slide-up');
}

function hideRegistration() {
  hideElement('registration-form');
}


function saveUserData(userData) {
  localStorage.setItem('userData', JSON.stringify(userData));
  // currentUser = userData;
}
