import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const analyzeToken = async (tokenId) => {
  try {
    const response = await api.post('/analyze', { tokenId });
    return response;
  } catch (error) {
    if (error.response?.status === 405) {
      throw new Error('Method not allowed. Please check API configuration.');
    }
    throw new Error(error.response?.data?.error || 'Failed to analyze token');
  }
};

export const getAnalysisStatus = async (tokenId) => {
  try {
    const response = await api.get(`/analyze/${tokenId}/status`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get analysis status');
  }
};

export const getOngoingAnalyses = async () => {
  try {
    const response = await api.get('/analyze/ongoing');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch ongoing analyses:', error);
    return []; // Return empty array on error
  }
};

export const visualizeToken = async (tokenId) => {
  try {
    const response = await api.get(`/visualize/${tokenId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // Return null for not found
    }
    throw new Error(error.response?.data?.error || 'Failed to visualize token');
  }
};

export default api;
