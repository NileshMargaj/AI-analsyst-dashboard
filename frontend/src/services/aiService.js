/**
 * AI Query Service - Frontend API client
 * Handles natural language queries to backend AI endpoint
 */

const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:3000/api/ai' 
  : (import.meta.env.VITE_API_BASE ? `${import.meta.env.VITE_API_BASE}/api/ai` : 'https://ai-analsyst-dashboard-backend.onrender.com/api/ai');

/**
 * Send natural language query for AI analysis
 * @param {string} datasetId - Dataset ID from upload
 * @param {string} query - Natural language: "Top 5 products by revenue"
 * @returns {Promise<Object>} - {chartData, insight, rawData, metadata}
 */
export const queryAI = async (datasetId, query) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required. Please login.');
  }

  const response = await fetch(`${API_BASE}/${datasetId}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

