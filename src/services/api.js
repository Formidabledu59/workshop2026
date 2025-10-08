import config from '@/config/api';

class ApiService {
  constructor() {
    this.baseUrl = config.API_BASE_URL;
    this.endpoints = config.endpoints;
  }

  async makeRequest(url, options = {}) {
    try {
      console.log(`🌐 API Call: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;
      
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  // Récupérer toutes les apps
  async fetchApps() {
    const url = `${this.baseUrl}${this.endpoints.apps}`;
    return await this.makeRequest(url);
  }

  // Récupérer une app spécifique avec ses questions
  async fetchApp(appId) {
    const url = `${this.baseUrl}${this.endpoints.app}/${appId}`;
    return await this.makeRequest(url);
  }

  // Enregistrer un score
  async saveScore(scoreData) {
    const url = `${this.baseUrl}${this.endpoints.scores}`;
    return await this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(scoreData),
    });
  }

  // Récupérer les scores d'un utilisateur
  async getUserScores(userEmail, appId = null) {
    let url = `${this.baseUrl}${this.endpoints.scores}?user_email=${userEmail}`;
    if (appId) url += `&app_id=${appId}`;
    return await this.makeRequest(url);
  }

  // Récupérer les statistiques
  async getStats() {
    const url = `${this.baseUrl}${this.endpoints.stats}`;
    return await this.makeRequest(url);
  }
}

// Instance singleton
const apiService = new ApiService();

// Export des fonctions pour compatibilité avec ton code existant
export const fetchApps = () => apiService.fetchApps();
export const fetchApp = (appId) => apiService.fetchApp(appId);
export const saveScore = (scoreData) => apiService.saveScore(scoreData);
export const getUserScores = (userEmail, appId) => apiService.getUserScores(userEmail, appId);
export const getStats = () => apiService.getStats();

export default apiService;
