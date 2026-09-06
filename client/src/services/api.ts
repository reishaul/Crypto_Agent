import axios from 'axios';

// כתובת השרת המקומי שלנו
const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_URL,
});

export default API;

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Something went wrong' };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Login failed' };
  }
};

export const saveOnboardingPreferences = async (email: string, preferences: { cryptoAssets: string[]; investorType: string; contentTypes: string[] }) => {
  try {
    const response = await axios.post(`${API_URL}/user/onboarding`, {
      email,
      preferences,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Something went wrong' };
  }
};

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getUserProfile = async (email: string) => {
  try {
    const response = await axios.get(`${API_URL}/user/profile/${email}`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Failed to fetch user profile' };
  }
};

export const saveFeedback = async (payload: { userId: string; contentId: string; contentType: string; vote: 'like' | 'dislike' }) => {
  try {
    const response = await axios.post(`${API_URL}/feedback`, payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Failed to save feedback' };
  }
};


export interface CryptoMeme {
  id: number;
  title: string;
  imageUrl: string;
  postUrl: string;
  score: number;
  author: string;
  license: string;
}

export const getMemes = async (): Promise<CryptoMeme[]> => {
  try {
    const response = await axios.get(`${API_URL}/memes`);

    return (response.data.memes || []).map((meme: CryptoMeme) => ({
      ...meme,
      imageUrl: meme.imageUrl.startsWith('http')
        ? meme.imageUrl
        : meme.imageUrl,
    }));
  } catch (error: any) {
    throw error.response?.data || {
      error: 'Failed to fetch memes'
    };
  }
};