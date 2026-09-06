
// This file contains TypeScript interfaces for user preferences and user profile data.
// The UserPreferences interface defines the structure for storing user preferences related to crypto assets, investor type, and content types.
export interface UserPreferences{
  cryptoAssets: string[];
  investorType: string;
  contentTypes: string[];
}

// The UserProfile interface defines the structure for storing user profile information, including a unique identifier, name, email, and optional preferences.
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  preferences?: UserPreferences;
}