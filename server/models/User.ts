import mongoose, { Schema, Document } from 'mongoose';
// This file defines the User model for the application, which includes user information and preferences related to crypto assets and 
// content types. The IUser interface extends the Document interface from Mongoose, ensuring that each user document adheres to the defined 
// schema structure.

//interface for the User document, extending Mongoose's Document interface to include user-specific fields and preferences.
export interface IUser extends Document{
  name: string;
  email: string;
  passwordHash: string;
  preferences?: {
    cryptoAssets: string[];
    investorType: string;
    contentTypes: string[];
  };
}

// Define the User schema with fields for name, email, password hash, and preferences. The preferences field is an embedded document
const UserSchema: Schema = new Schema({
  name: { type: String, required: true},
  email:{ type: String, required: true, unique: true },
  passwordHash:{ type: String, required: true},
  preferences: {
    cryptoAssets: { type: [String], default: []},
    investorType: { type: String, default: '' },
    contentTypes: { type: [String], default: [] }
  }
});

export default mongoose.model<IUser>('User', UserSchema);