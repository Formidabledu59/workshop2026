'use client'

import { showElement, hideElement } from "@/utils/helpers.js"
import { useEffect, useState } from "react";

export default function HomeMenu() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetchApps().then((data) => {
      setApps(data.apps);
    });
  }, []);

  return (
    // Écran principal
    <div className="main-screen">
      {/* Header */}
      <div className="main-header">
        <div className="user-info" id="userInfo">
          {/* can put things like game progress (.e.g "4/10 apps unlocked!") */}
        </div>
        <h1>Mes Applications</h1>
      </div>

      {/* Loading state */}
      {/* <div id="loading" className="loading-state">
        <div className="spinner"></div>
        <p>Chargement des applications...</p>
      </div> */}

      {/* Apps grid */}
      <div id="apps-grid" className="apps-grid">
        {/* Apps seront générées dynamiquement */}
        {apps.map(app => (
          <a
            key={app.id}
            className="app-card"
            style={{borderTop: `4px solid ${app.color}`}}
            href={app.type === "settings" ? "/workshop2026/settings" : `/workshop2026/app_${app.id}`}
          >
            <div className="app-icon" style={{color: app.color}}>{app.icon}</div>
            <div className="app-name">{app.name}</div>
            <div className="app-description">{app.description || ""}</div>
          </a>
        ))}
      </div>

      {/* Error state */}
      <div id="error-state" className="error-state hidden">
        <div className="error-icon">⚠️</div>
        <p>Impossible de charger les applications</p>
        {/* <button onclick="loadApps()" className="retry-btn">Réessayer</button> */}
      </div>
    </div>
  );
}
async function fetchApps() {
  // const response = await fetch("endpoint to app");           // Real API
  const response = await fetch("/workshop2026/mock/apps.json");         // Mock

  if (response.ok) return await response.json();
  else return {error: "pas de données"};
}

async function loadApps() {
  // Reset states
  showElement('loading');
  hideElement('apps-grid');
  hideElement('error-state');

  try {
    const data = await fetchApps();

    // Générer la grille d'apps
    generateAppsGrid(data.apps);

    hideElement('loading');
    showElement('apps-grid');

  } catch (error) {
    console.error('❌ Erreur lors du chargement:', error);
    hideElement('loading');
    showElement('error-state');
  }
}

function generateAppsGrid(apps) {
  const gridEl = document.getElementById('apps-grid');
  if (!gridEl) return;

  gridEl.innerHTML = '';

  apps.forEach(app => {
    const appCard = createAppCard(app);
    gridEl.appendChild(appCard);
  });
}

function createAppCard(app) {
  const card = document.createElement('a');
  card.className = 'app-card';
  card.style.borderTop = `4px solid ${app.color}`;

  // Navigation selon le type d'app
  if (app.type === 'settings') {
    card.href = 'settings.html';
  } else {
    card.href = `app.html?id=${app.id}`;
  }

  card.innerHTML = `
    <div class="app-icon" style="color: ${app.color}">${app.icon}</div>
    <div class="app-name">${app.name}</div>
    <div class="app-description">${app.description || ''}</div>
  `;

  return card;
}