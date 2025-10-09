'use client'

import Image from "next/image";
import "@/app/home-menu/page.css";
import { showElement, hideElement } from "@/utils/helpers.js"
import { useEffect, useState } from "react";
import Link from "next/link";
 

export default function HomeMenu() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetchApps().then((data) => {
      setApps(data.apps);
    });
  }, []);

  const isHttp = (url) => /^https?:\/\/[^\s]+$/.test(url);
  const isBase64 = (data) => /^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+$/.test(data);

  return (
    // Écran principal
    <div className="main-screen" style={{backgroundImage: "url(./wallpapers/undertale.jpg)"}}>
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
          <Link
            key={app.id}
            className="app-card"
            style={
              isHttp(app.iconBackground) || isBase64(app.iconBackground) ? {
                backgroundImage: `url(${app.iconBackground})`
              } : {
                background: app.iconBackground
              }
            }
            href={app.type === "settings" ? "/settings" : `/application/${app.id}`}
          >
            <div className="app-icon">
              {isHttp(app.iconIcon) || isBase64(app.iconIcon) ? (
                <Image src={app.iconIcon} fill={true} alt={`${app.name} app icon`} />
              ) : (
                <span>{app.iconIcon}</span>
              )} 
            </div>
          </Link>
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
  const response = await fetch("https://workshop2526.alwaysdata.net/api/apps");           // Real API
  // const response = await fetch("./mock/apps.json");         // Mock

  if (response.ok) return await response.json();
  else return {error: "pas de données"};
}
