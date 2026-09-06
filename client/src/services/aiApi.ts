import axios from 'axios';

//this file is for the AI API service, which is separate from the main API service
// Define the base URL for the API
const API_URL = import.meta.env.VITE_API_URL + '/api';

// Create an Axios instance with the base URL
export const getAiAdvice = async (investorType: string, cryptoAssets: string[]) => {
  try{
    const response = await axios.post(`${API_URL}/ai/advice`, {
      investorType,
      cryptoAssets,
    });
    return response.data;
  } 
  catch (error:any) {
    throw error.response?.data || { error: 'Failed to fetch AI advice' };
  }
};