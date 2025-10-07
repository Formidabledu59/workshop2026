
// ==========================================================================
// VARIABLES GLOBALES
// ==========================================================================

let currentUser = null;
let currentApp = null;
let currentQuiz = null;
let appSettings = {
    theme: 'light',
    fontSize: 'medium',
    background: 'gradient1',
    notifications: true,
    sounds: true
};

// ==========================================================================
// UTILITAIRES
// ==========================================================================

function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    const dateStr = now.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
    });

    // Update all time elements
    const timeElements = document.querySelectorAll('#statusTime, #lockTime, .time');
    timeElements.forEach(el => el.textContent = timeStr);

    const dateElements = document.querySelectorAll('#lockDate');
    dateElements.forEach(el => el.textContent = dateStr);
}

function showElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.remove('hidden');
        element.classList.add('fade-in');
    }
}

function hideElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.classList.add('hidden');
        element.classList.remove('fade-in');
    }
}

function simulateApiCall(url, delay = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`🌐 API Call: ${url}`);
            resolve();
        }, delay);
    });
}

// ==========================================================================
// GESTION UTILISATEUR & LOCALSTORAGE
// ==========================================================================

function loadUserData() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        currentUser = JSON.parse(userData);
        return currentUser;
    }
    return null;
}

function saveUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
    currentUser = userData;
}

function loadSettings() {
    const settings = localStorage.getItem('appSettings');
    if (settings) {
        appSettings = { ...appSettings, ...JSON.parse(settings) };
        applySettings();
    }

    // Charger les données utilisateur dans les champs settings
    if (currentUser) {
        const pseudoInput = document.getElementById('pseudo-input');
        const emailInput = document.getElementById('email-input');
        const ageInput = document.getElementById('age-input');

        if (pseudoInput) pseudoInput.value = currentUser.pseudo || '';
        if (emailInput) emailInput.value = currentUser.email || '';
        if (ageInput) ageInput.value = currentUser.age || '';
    }
}

function saveSettings() {
    // Sauvegarder les paramètres d'apparence
    const themeSelect = document.getElementById('theme-select');
    const fontSizeSelect = document.getElementById('font-size-select');
    const backgroundSelect = document.getElementById('background-select');
    const notificationsToggle = document.getElementById('notifications-toggle');
    const soundsToggle = document.getElementById('sounds-toggle');

    if (themeSelect) appSettings.theme = themeSelect.value;
    if (fontSizeSelect) appSettings.fontSize = fontSizeSelect.value;
    if (backgroundSelect) appSettings.background = backgroundSelect.value;
    if (notificationsToggle) appSettings.notifications = notificationsToggle.checked;
    if (soundsToggle) appSettings.sounds = soundsToggle.checked;

    localStorage.setItem('appSettings', JSON.stringify(appSettings));

    // Sauvegarder les données utilisateur modifiées
    const pseudoInput = document.getElementById('pseudo-input');
    const emailInput = document.getElementById('email-input');
    const ageInput = document.getElementById('age-input');

    if (currentUser && pseudoInput && emailInput && ageInput) {
        currentUser.pseudo = pseudoInput.value;
        currentUser.email = emailInput.value;
        currentUser.age = parseInt(ageInput.value);
        saveUserData(currentUser);
    }

    applySettings();

    // Feedback utilisateur
    alert('✅ Paramètres sauvegardés avec succès!');
}

function applySettings() {
    // Appliquer le thème
    document.documentElement.setAttribute('data-theme', appSettings.theme);

    // Appliquer la taille de police
    const fontSizes = {
        small: '14px',
        medium: '16px',
        large: '18px',
        xlarge: '20px'
    };
    document.documentElement.style.setProperty('--font-size-base', fontSizes[appSettings.fontSize] || '16px');

    // Appliquer le fond d'écran
    const backgrounds = {
        gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        gradient3: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
        solid: '#F2F2F7'
    };

    const lockBackground = document.querySelector('.lock-background');
    if (lockBackground) {
        lockBackground.style.background = backgrounds[appSettings.background] || backgrounds.gradient1;
    }

    // Mettre à jour les sélecteurs
    const themeSelect = document.getElementById('theme-select');
    const fontSizeSelect = document.getElementById('font-size-select');
    const backgroundSelect = document.getElementById('background-select');
    const notificationsToggle = document.getElementById('notifications-toggle');
    const soundsToggle = document.getElementById('sounds-toggle');

    if (themeSelect) themeSelect.value = appSettings.theme;
    if (fontSizeSelect) fontSizeSelect.value = appSettings.fontSize;
    if (backgroundSelect) backgroundSelect.value = appSettings.background;
    if (notificationsToggle) notificationsToggle.checked = appSettings.notifications;
    if (soundsToggle) soundsToggle.checked = appSettings.sounds;
}

// ==========================================================================
// ÉCRAN DE VERROUILLAGE & INSCRIPTION
// ==========================================================================

function showRegistration() {
    showElement('registration-form');
    document.getElementById('registration-form').classList.add('slide-up');
}

function hideRegistration() {
    hideElement('registration-form');
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
        window.location.href = 'main.html';
    }, 1000);
}

// ==========================================================================
// GESTION DES APPS - API MOCK
// ==========================================================================

async function fetchApps() {
    try {
        await simulateApiCall('/mock/apps.json', 800);

        // Simulate loading from mock/apps.json
        const response = await fetch('mock/apps.json').catch(() => {
            // Fallback data si le fichier n'existe pas
            return {
                ok: false
            };
        });

        if (response.ok) {
            return await response.json();
        } else {
            // Données fallback mockées en dur
            return {
                apps: [
                    {
                        id: 1,
                        name: "Quiz Réseaux",
                        icon: "🌐",
                        color: "#4A90E2",
                        type: "quiz",
                        description: "Testez vos connaissances sur les réseaux sociaux"
                    },
                    {
                        id: 2,
                        name: "Quiz Culture",
                        icon: "🎭",
                        color: "#F5A623",
                        type: "quiz",
                        description: "Découvrez la culture française"
                    },
                    {
                        id: 3,
                        name: "Paramètres",
                        icon: "⚙️",
                        color: "#8E8E93",
                        type: "settings",
                        description: "Personnalisez votre expérience"
                    },
                    {
                        id: 4,
                        name: "Mes Scores",
                        icon: "🏆",
                        color: "#50C878",
                        type: "stats",
                        description: "Consultez vos résultats"
                    },
                    {
                        id: 5,
                        name: "À Propos",
                        icon: "ℹ️",
                        color: "#007AFF",
                        type: "info",
                        description: "Informations sur l'application"
                    }
                ]
            };
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement des apps:', error);
        throw error;
    }
}

async function fetchApp(appId) {
    try {
        await simulateApiCall(`/mock/app${appId}.json`, 600);

        // Simulate loading from mock/appX.json
        const response = await fetch(`mock/app${appId}.json`).catch(() => {
            return { ok: false };
        });

        if (response.ok) {
            return await response.json();
        } else {
            // Données fallback mockées selon l'ID
            return getAppFallbackData(appId);
        }
    } catch (error) {
        console.error(`❌ Erreur lors du chargement de l'app ${appId}:`, error);
        throw error;
    }
}

function getAppFallbackData(appId) {
    const appData = {
        1: {
            id: 1,
            name: "Quiz Réseaux",
            type: "quiz",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            questions: [
                {
                    id: 1,
                    text: "Les réseaux sociaux montrent-ils la réalité ?",
                    type: "vrai_faux",
                    answer: "faux",
                    explanation: "Les réseaux sociaux présentent souvent une version idéalisée de la réalité"
                },
                {
                    id: 2,
                    text: "Instagram influence-t-il l'image de soi ?",
                    type: "vrai_faux",
                    answer: "vrai",
                    explanation: "De nombreuses études montrent l'impact d'Instagram sur l'estime de soi"
                }
            ]
        },
        2: {
            id: 2,
            name: "Quiz Culture",
            type: "quiz",
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            questions: [
                {
                    id: 3,
                    text: "Le Pass Culture dépend de quel ministère ?",
                    type: "qcm",
                    choices: ["Culture", "Éducation", "Sports"],
                    answer: "Culture",
                    explanation: "Le Pass Culture est géré par le Ministère de la Culture"
                },
                {
                    id: 4,
                    text: "Le Pass Culture est accessible dès quel âge ?",
                    type: "qcm",
                    choices: ["15 ans", "18 ans", "21 ans"],
                    answer: "18 ans",
                    explanation: "Le Pass Culture est accessible aux jeunes de 18 ans"
                }
            ]
        },
        3: {
            id: 3,
            name: "Paramètres",
            type: "settings"
        },
        4: {
            id: 4,
            name: "Mes Scores",
            type: "stats"
        },
        5: {
            id: 5,
            name: "À Propos",
            type: "info",
            content: "Application Workshop Mobile v1.0\nDéveloppé pour le workshop M1 2025-2026"
        }
    };

    return appData[appId] || { id: appId, name: "App inconnue", type: "unknown" };
}

// ==========================================================================
// AFFICHAGE MAIN.HTML - LISTE DES APPS
// ==========================================================================

async function loadApps() {
    const loadingEl = document.getElementById('loading');
    const gridEl = document.getElementById('apps-grid');
    const errorEl = document.getElementById('error-state');

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

// ==========================================================================
// AFFICHAGE APP.HTML - APP INDIVIDUELLE
// ==========================================================================

async function loadApp(appId) {
    const loadingEl = document.getElementById('app-loading');
    const contentEl = document.getElementById('app-content');
    const errorEl = document.getElementById('app-error');
    const titleEl = document.getElementById('app-title');

    // Reset states
    showElement('app-loading');
    hideElement('app-content');
    hideElement('app-error');

    try {
        const appData = await fetchApp(appId);
        currentApp = appData;

        // Mettre à jour le titre
        if (titleEl) titleEl.textContent = appData.name;

        // Générer le contenu selon le type d'app
        generateAppContent(appData);

        hideElement('app-loading');
        showElement('app-content');

    } catch (error) {
        console.error('❌ Erreur lors du chargement de l\'app:', error);
        hideElement('app-loading');
        showElement('app-error');
    }
}

function generateAppContent(appData) {
    const contentEl = document.getElementById('app-content');
    if (!contentEl) return;

    // Appliquer le fond personnalisé si disponible
    if (appData.background) {
        document.body.style.background = appData.background;
    }

    switch (appData.type) {
        case 'quiz':
            generateQuizContent(appData);
            break;
        case 'stats':
            generateStatsContent(appData);
            break;
        case 'info':
            generateInfoContent(appData);
            break;
        default:
            contentEl.innerHTML = `
                <div class="text-center">
                    <h2>🚧 En construction</h2>
                    <p>Cette application sera bientôt disponible.</p>
                </div>
            `;
    }
}

// ==========================================================================
// GESTION QUIZ
// ==========================================================================

function generateQuizContent(appData) {
    const contentEl = document.getElementById('app-content');
    const template = document.getElementById('quiz-template');

    if (!template) {
        contentEl.innerHTML = '<p>❌ Template quiz non trouvé</p>';
        return;
    }

    // Cloner le template
    const quizEl = template.content.cloneNode(true);
    contentEl.appendChild(quizEl);

    // Initialiser le quiz
    currentQuiz = {
        questions: appData.questions || [],
        currentIndex: 0,
        score: 0,
        userAnswers: []
    };

    displayQuestion();
}

function displayQuestion() {
    if (!currentQuiz || currentQuiz.currentIndex >= currentQuiz.questions.length) {
        showQuizResults();
        return;
    }

    const question = currentQuiz.questions[currentQuiz.currentIndex];
    const questionEl = document.querySelector('.question-text');
    const answersEl = document.querySelector('.answers-container');
    const progressEl = document.querySelector('.progress-fill');
    const progressTextEl = document.querySelector('.progress-text');
    const scoreEl = document.querySelector('.score-value');

    // Mettre à jour l'affichage
    if (questionEl) questionEl.textContent = question.text;
    if (scoreEl) scoreEl.textContent = currentQuiz.score;

    // Barre de progression
    const progress = ((currentQuiz.currentIndex + 1) / currentQuiz.questions.length) * 100;
    if (progressEl) progressEl.style.width = `${progress}%`;
    if (progressTextEl) {
        progressTextEl.textContent = `Question ${currentQuiz.currentIndex + 1} / ${currentQuiz.questions.length}`;
    }

    // Générer les réponses
    if (answersEl) {
        answersEl.innerHTML = '';

        if (question.type === 'vrai_faux') {
            ['Vrai', 'Faux'].forEach(answer => {
                const btn = createAnswerButton(answer, answer.toLowerCase());
                answersEl.appendChild(btn);
            });
        } else if (question.type === 'qcm' && question.choices) {
            question.choices.forEach(choice => {
                const btn = createAnswerButton(choice, choice);
                answersEl.appendChild(btn);
            });
        }
    }
}

function createAnswerButton(text, value) {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = text;
    btn.onclick = () => selectAnswer(value, btn);
    return btn;
}

function selectAnswer(answer, buttonEl) {
    const question = currentQuiz.questions[currentQuiz.currentIndex];
    const isCorrect = answer.toLowerCase() === question.answer.toLowerCase();

    // Sauvegarder la réponse
    currentQuiz.userAnswers.push({
        questionId: question.id,
        answer: answer,
        correct: isCorrect
    });

    // Mettre à jour le score
    if (isCorrect) {
        currentQuiz.score++;
        buttonEl.classList.add('correct');
    } else {
        buttonEl.classList.add('incorrect');
        // Mettre en évidence la bonne réponse
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach(btn => {
            if (btn.textContent.toLowerCase() === question.answer.toLowerCase()) {
                btn.classList.add('correct');
            }
        });
    }

    // Désactiver tous les boutons
    const allButtons = document.querySelectorAll('.answer-btn');
    allButtons.forEach(btn => btn.disabled = true);

    // Afficher le feedback
    setTimeout(() => {
        showQuestionFeedback(question, isCorrect);
    }, 1000);
}

function showQuestionFeedback(question, isCorrect) {
    const feedbackEl = document.querySelector('.quiz-feedback');
    const iconEl = document.querySelector('.feedback-icon');
    const textEl = document.querySelector('.feedback-text');
    const nextBtn = document.querySelector('.next-btn');

    if (feedbackEl) {
        feedbackEl.classList.remove('hidden');

        if (iconEl) iconEl.textContent = isCorrect ? '✅' : '❌';
        if (textEl) textEl.textContent = question.explanation || (isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse.');

        if (nextBtn) {
            nextBtn.onclick = () => {
                feedbackEl.classList.add('hidden');
                currentQuiz.currentIndex++;
                displayQuestion();
            };
        }
    }
}

function showQuizResults() {
    const contentEl = document.getElementById('app-content');
    const percentage = Math.round((currentQuiz.score / currentQuiz.questions.length) * 100);

    contentEl.innerHTML = `
        <div class="quiz-results text-center">
            <h2>🎉 Quiz terminé !</h2>
            <div class="score-display">
                <div class="final-score">${currentQuiz.score} / ${currentQuiz.questions.length}</div>
                <div class="percentage">${percentage}%</div>
            </div>
            <p class="score-message">${getScoreMessage(percentage)}</p>
            <div class="quiz-actions">
                <button class="btn-primary" onclick="restartQuiz()">🔄 Recommencer</button>
                <button class="btn-secondary" onclick="window.location.href='main.html'">🏠 Accueil</button>
            </div>
        </div>
    `;

    // Sauvegarder le score
    saveQuizScore(currentApp.id, currentQuiz.score, currentQuiz.questions.length);
}

function getScoreMessage(percentage) {
    if (percentage >= 90) return "🌟 Excellent ! Vous maîtrisez parfaitement le sujet !";
    if (percentage >= 70) return "👏 Très bien ! Vous avez de bonnes connaissances.";
    if (percentage >= 50) return "👍 Pas mal ! Vous pouvez encore progresser.";
    return "💪 Continuez vos efforts ! La pratique rend parfait.";
}

function restartQuiz() {
    if (currentApp && currentApp.questions) {
        generateQuizContent(currentApp);
    }
}

function saveQuizScore(appId, score, total) {
    const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
    scores.push({
        appId: appId,
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100),
        date: new Date().toISOString(),
        user: currentUser ? currentUser.pseudo : 'Anonyme'
    });
    localStorage.setItem('quizScores', JSON.stringify(scores));
}

// ==========================================================================
// AUTRES TYPES D'APPS
// ==========================================================================

function generateStatsContent() {
    const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
    const contentEl = document.getElementById('app-content');

    if (scores.length === 0) {
        contentEl.innerHTML = `
            <div class="text-center">
                <h2>📊 Mes Scores</h2>
                <p>Aucun quiz complété pour le moment.</p>
                <button class="btn-primary" onclick="window.location.href='main.html'">Commencer un quiz</button>
            </div>
        `;
        return;
    }

    let statsHTML = '<h2>📊 Mes Scores</h2><div class="scores-list">';

    scores.reverse().forEach(score => {
        const date = new Date(score.date).toLocaleDateString('fr-FR');
        statsHTML += `
            <div class="score-item">
                <div class="score-info">
                    <strong>Quiz ${score.appId}</strong>
                    <span class="score-date">${date}</span>
                </div>
                <div class="score-result">
                    <span class="score-value">${score.score}/${score.total}</span>
                    <span class="score-percentage">${score.percentage}%</span>
                </div>
            </div>
        `;
    });

    statsHTML += '</div>';
    contentEl.innerHTML = statsHTML;
}

function generateInfoContent(appData) {
    const contentEl = document.getElementById('app-content');
    contentEl.innerHTML = `
        <div class="info-content text-center">
            <h2>ℹ️ À Propos</h2>
            <div class="app-info">
                <p><strong>Workshop Mobile App</strong></p>
                <p>Version 1.0</p>
                <p>Développé pour le workshop M1 2025-2026</p>
            </div>
            <div class="user-info mt-lg">
                <h3>👤 Utilisateur connecté</h3>
                <p><strong>Pseudo:</strong> ${currentUser ? currentUser.pseudo : 'Non connecté'}</p>
                <p><strong>Email:</strong> ${currentUser ? currentUser.email : 'Non renseigné'}</p>
                <p><strong>Âge:</strong> ${currentUser ? currentUser.age + ' ans' : 'Non renseigné'}</p>
            </div>
        </div>
    `;
}

// ==========================================================================
// FONCTIONS SETTINGS
// ==========================================================================

function changeTheme() {
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        appSettings.theme = themeSelect.value;
        applySettings();
    }
}

function changeFontSize() {
    const fontSizeSelect = document.getElementById('font-size-select');
    if (fontSizeSelect) {
        appSettings.fontSize = fontSizeSelect.value;
        applySettings();
    }
}

function changeBackground() {
    const backgroundSelect = document.getElementById('background-select');
    if (backgroundSelect) {
        appSettings.background = backgroundSelect.value;
        applySettings();
    }
}

function toggleNotifications() {
    const toggle = document.getElementById('notifications-toggle');
    if (toggle) {
        appSettings.notifications = toggle.checked;
    }
}

function toggleSounds() {
    const toggle = document.getElementById('sounds-toggle');
    if (toggle) {
        appSettings.sounds = toggle.checked;
    }
}

function exportData() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const scores = JSON.parse(localStorage.getItem('quizScores') || '[]');
    const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');

    const exportData = {
        user: userData,
        scores: scores,
        settings: settings,
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `workshop_data_${userData.pseudo || 'user'}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('📤 Données exportées avec succès !');
}

function resetApp() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser toutes vos données ?')) {
        localStorage.clear();
        alert('🗑️ Application réinitialisée ! Redirection vers l\'écran de connexion...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// ==========================================================================
// INITIALISATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Charger les données utilisateur
    loadUserData();

    // Charger et appliquer les paramètres
    loadSettings();

    // Démarrer l'horloge
    updateTime();
    setInterval(updateTime, 1000);

    // Logs de debug
    console.log('🚀 App initialisée');
    console.log('👤 Utilisateur:', currentUser);
    console.log('⚙️ Paramètres:', appSettings);
});

// ==========================================================================
// EXPORTS POUR USAGE GLOBAL
// ==========================================================================

// Fonctions exposées globalement pour les onclick dans le HTML
window.showRegistration = showRegistration;
window.hideRegistration = hideRegistration;
window.registerUser = registerUser;
window.loadApps = loadApps;
window.loadApp = loadApp;
window.saveSettings = saveSettings;
window.changeTheme = changeTheme;
window.changeFontSize = changeFontSize;
window.changeBackground = changeBackground;
window.toggleNotifications = toggleNotifications;
window.toggleSounds = toggleSounds;
window.exportData = exportData;
window.resetApp = resetApp;
window.restartQuiz = restartQuiz;
