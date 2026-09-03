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
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { error: 'Something went wrong' };
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