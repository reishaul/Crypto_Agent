import axios from 'axios';

// כתובת השרת המקומי שלנו
const API_URL = 'http://localhost:5000/api';

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