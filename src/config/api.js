// Configuration des URLs de ton API backend - CORRECTION
const config = {
  // Toujours pointer vers ton serveur Alwaysdata
  API_BASE_URL: 'https://workshop2526.alwaysdata.net',
  
  // Endpoints corrigés selon tes vraies routes
  endpoints: {
    apps: '/api/apps',       
    app: '/api/app',         
    scores: '/scores',       
    questions: '/questions', 
    stats: '/api/stats'      
  }
};

export default config;
