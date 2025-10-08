'use client'

import Image from "next/image";
import { useRouter } from 'next/navigation';
import "@/app/home-menu/page.css";
import { showElement, hideElement } from "@/utils/helpers.js"
import { useEffect, useState } from "react";

export default function HomeMenu() {
  const router = useRouter();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetchApps().then((data) => {
      setApps(data.apps);
    });
  }, []);

  const isHttp = (url) => /^https?:\/\/[^\s]+$/.test(url);
  const isBase64 = (data) => /^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+$/.test(data);

  const handleAppClick = (app) => {
    console.log('🎯 App cliquée:', app);
    
    if (app.type === "quiz") {
      router.push(`/quiz/${app.id}`);
    } else if (app.type === "settings") {
      router.push('/settings');
    } else {
      console.log('Type app non géré:', app.type);
    }
  };

  return (
    <div className="main-screen">
      <div className="main-header">
        <div className="user-info" id="userInfo">
        </div>
        <h1>Mes Applications</h1>
      </div>

      <div id="apps-grid" className="apps-grid">
        {apps.map(app => (
          <div // ❌ Change <a> en <div>
            key={app.id}
            className="app-card"
            style={
              isHttp(app.background_url) || isBase64(app.background_url) ? {
                backgroundImage: `url(${app.background_url})`
              } : {
                background: app.background_url
              }
            }
            onClick={() => handleAppClick(app)}
          >
            <div className="app-icon">
              {isHttp(app.icon) || isBase64(app.icon) ? (
                <Image src={app.icon} fill={true} alt={`${app.name} app icon`} />
              ) : (
                <span>{app.icon}</span>
              )} 
            </div>
          </div>
        ))}
      </div>

      <div id="error-state" className="error-state hidden">
        <div className="error-icon">⚠️</div>
        <p>Impossible de charger les applications</p>
      </div>
    </div>
  );
}

async function fetchApps() {
  const response = await fetch("https://workshop2526.alwaysdata.net/api/apps");
  if (response.ok) return await response.json();
  else return {error: "pas de données"};
}