'use client'; // Ajoute cette ligne en haut de ton fichier

import React, { useState, useEffect } from 'react';

export default function AppSettings() {
    // États pour chaque paramètre
    const [theme, setTheme] = useState('light');
    const [fontSize, setFontSize] = useState('medium');
    const [background, setBackground] = useState('gradient1');
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [notifications, setNotifications] = useState(false);
    const [sounds, setSounds] = useState(false);
    const [time, setTime] = useState('14:00');

    // Mettre à jour l'heure toutes les secondes
    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date();
            setTime(currentTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}));
        }, 1000);

        return () => clearInterval(interval); // Nettoyage de l'intervalle quand le composant est démonté
    }, []);

    // Gestion des changements de paramètres
    const handleThemeChange = (e) => setTheme(e.target.value);
    const handleFontSizeChange = (e) => setFontSize(e.target.value);
    const handleBackgroundChange = (e) => setBackground(e.target.value);
    const handleNotificationsToggle = () => setNotifications(!notifications);
    const handleSoundsToggle = () => setSounds(!sounds);
    const handleSaveSettings = () => {
        // Sauvegarder les paramètres (ici tu pourrais utiliser localStorage, API, etc.)
        alert('Paramètres sauvegardés!');
    };

    const handleExportData = () => {
        // Exporter les données (ici tu pourrais les envoyer à un serveur, par exemple)
        alert('Données exportées!');
    };

    const handleResetApp = () => {
        // Réinitialiser les paramètres
        setTheme('light');
        setFontSize('medium');
        setBackground('gradient1');
        setPseudo('');
        setEmail('');
        setAge('');
        setNotifications(false);
        setSounds(false);
        alert('Réinitialisation effectuée!');
    };

    return (
        <div className="settings-page">
            {/* Status Bar */}
            <div className="status-bar">
                <span className="time">{time}</span>
                <div className="status-right">
                    <span className="signal">●●●●</span>
                    <span className="wifi">📶</span>
                    <span className="battery">87%</span>
                </div>
            </div>

            {/* Navigation header */}
            <div className="app-header">
                <button className="back-btn" onClick={() => window.history.back()}>
                    <span className="back-icon">←</span> Retour
                </button>
                <h1>Paramètres</h1>
            </div>

            {/* Settings content */}
            <div className="settings-content">
                {/* Apparence */}
                <div className="settings-section">
                    <h3 className="section-title">🎨 Apparence</h3>
                    <div className="setting-item">
                        <div className="setting-label">
                            <span>Thème</span>
                            <small>Choisissez l'apparence de l'application</small>
                        </div>
                        <select value={theme} onChange={handleThemeChange} className="setting-control">
                            <option value="light">🌞 Clair</option>
                            <option value="dark">🌙 Sombre</option>
                            <option value="purple">💜 Violet</option>
                            <option value="blue">💙 Bleu</option>
                        </select>
                    </div>

                    <div className="setting-item">
                        <div className="setting-label">
                            <span>Taille de police</span>
                            <small>Ajustez la taille du texte</small>
                        </div>
                        <select value={fontSize} onChange={handleFontSizeChange} className="setting-control">
                            <option value="small">Petit (14px)</option>
                            <option value="medium">Normal (16px)</option>
                            <option value="large">Grand (18px)</option>
                            <option value="xlarge">Très grand (20px)</option>
                        </select>
                    </div>

                    <div className="setting-item">
                        <div className="setting-label">
                            <span>Fond d'écran</span>
                            <small>Personnalisez le fond de l'application</small>
                        </div>
                        <select value={background} onChange={handleBackgroundChange} className="setting-control">
                            <option value="gradient1">Dégradé bleu</option>
                            <option value="gradient2">Dégradé violet</option>
                            <option value="gradient3">Dégradé rose</option>
                            <option value="solid">Couleur unie</option>
                        </select>
                    </div>
                </div>

                {/* Compte */}
                <div className="settings-section">
                    <h3 className="section-title">👤 Mon Compte</h3>
                    <div className="setting-item">
                        <div className="setting-label">
                            <span>Pseudo</span>
                            <small>Votre nom d'utilisateur</small>
                        </div>
                        <input
                            type="text"
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            className="setting-control"
                            placeholder="Votre pseudo"
                        />
                    </div>

                    <div className="setting-item">
                        <div className="setting-label">
                            <span>Email</span>
                            <small>Votre adresse email</small>
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="setting-control"
                            placeholder="votre.email@example.com"
                        />
                    </div>

                    <div className="setting-item">
                        <div className="setting-label">
                            <span>Âge</span>
                            <small>Votre âge</small>
                        </div>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="setting-control"
                            min="13"
                            max="100"
                        />
                    </div>
                </div>

                {/* Notifications */}
                <div className="settings-section">
                    <h3 className="section-title">🔔 Notifications</h3>
                    <div className="setting-item">
                        <div className="setting-label">
                            <span>Notifications push</span>
                            <small>Recevoir des notifications</small>
                        </div>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={handleNotificationsToggle}
                            />
                            <label></label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-label">
                            <span>Sons</span>
                            <small>Sons des interactions</small>
                        </div>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={sounds}
                                onChange={handleSoundsToggle}
                            />
                            <label></label>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="settings-actions">
                    <button className="btn-primary" onClick={handleSaveSettings}>
                        💾 Sauvegarder les modifications
                    </button>
                    <button className="btn-secondary" onClick={handleExportData}>
                        📤 Exporter mes données
                    </button>
                    <button className="btn-danger" onClick={handleResetApp}>
                        🗑️ Réinitialiser l'application
                    </button>
                </div>

                {/* Footer */}
                <div className="settings-footer">
                    <p>Workshop Mobile App v1.0</p>
                    <p><small>Développé pour le workshop M1 2025-2026</small></p>
                </div>
            </div>
        </div>
    );
}