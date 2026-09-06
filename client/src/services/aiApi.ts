import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/api';

export const getAiAdvice = async (investorType: string, cryptoAssets: string[]) => {
  try {
    const response = await axios.post(`${API_URL}/ai/advice`, {
      investorType,
      cryptoAssets,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Failed to fetch AI advice' };
  }
};