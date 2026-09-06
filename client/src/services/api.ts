import axios from 'axios';

//this file is for the AI API service, which is separate from the main API service

// Define the base URL for the API
const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

const API =axios.create({
  baseURL: API_URL,
});

// Create an Axios instance with the base URL
export default API;


// Function to fetch AI advice based on investor type and crypto assets
export const registerUser = async (name: string, email: string, password: string) => {
  try{
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });

    if(response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } 
  catch (error: any){
    throw error.response?.data || { error: 'Something went wrong' };
  }
};

// Function to log in a user and store the JWT token in local storage
export const loginUser = async (email: string, password: string) => {
  try{
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } 
  catch(error: any){
    throw error.response?.data || { error: 'Login failed'};
  }
};

// Function to log out a user by removing the JWT token from local storage
export const saveOnboardingPreferences =async (email: string, preferences: { cryptoAssets: string[]; investorType: string; contentTypes: string[] }) => {
  try{
    const response = await axios.post(`${API_URL}/user/onboarding`, {
      email,
      preferences,
    });
    return response.data;
  } 
  catch (error: any){
    throw error.response?.data || { error: 'Something went wrong' };
  }
};

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// Function to fetch user profile data using the stored JWT token for authentication
export const getUserProfile = async (email: string) => {
  try{
    const response =await axios.get(`${API_URL}/user/profile/${email}`, getAuthHeaders());
    return response.data;
  } 
  catch(error: any){
    throw error.response?.data || { error: 'Failed to fetch user profile' };
  }
};

// Function to save user feedback (like/dislike) for specific content
export const saveFeedback= async (payload: { userId: string; contentId: string; contentType: string; vote: 'like' | 'dislike' }) => {
  try{
    const response = await axios.post(`${API_URL}/feedback`, payload);
    return response.data;
  } 
  catch (error: any){
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