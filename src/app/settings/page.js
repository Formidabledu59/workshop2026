'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Settings() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(
    (typeof window !== 'undefined' ? localStorage.getItem('userEmail') : '') || ''
  );

  const saveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userEmail', userEmail);
      alert('Paramètres sauvegardés !');
    }
  };

  const goHome = () => {
    router.push('/home-menu');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button className="back-btn" onClick={goHome}>← Retour</button>
        <h1>⚙️ Paramètres</h1>
      </div>

      <div className="settings-content">
        <div className="setting-item">
          <label htmlFor="userEmail">📧 Email utilisateur :</label>
          <input
            id="userEmail"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="votre.email@exemple.com"
          />
        </div>

        <button className="save-btn" onClick={saveSettings}>
          💾 Sauvegarder
        </button>
      </div>

      <style jsx>{`
        .settings-container {
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .settings-header {
          display: flex;
          align-items: center;
          margin-bottom: 30px;
        }
        .back-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 10px 15px;
          border-radius: 25px;
          cursor: pointer;
          margin-right: 20px;
        }
        .settings-content {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 30px;
          backdrop-filter: blur(10px);
        }
        .setting-item {
          margin-bottom: 20px;
        }
        .setting-item label {
          display: block;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .setting-item input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
        .setting-item input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        .save-btn {
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          border: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        }
        .save-btn:hover {
          background: white;
        }
      `}</style>
    </div>
  );
}