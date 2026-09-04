export interface UserPreferences {
  cryptoAssets: string[];
  investorType: string;
  contentTypes: string[];
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  preferences?: UserPreferences;
}