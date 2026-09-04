import express, { type Request, type Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js'; //
import aiRoutes from './routes/aiRoutes.js';
import { verifyToken } from './middleware/auth.js';

import axios from 'axios';

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; //

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/ai', aiRoutes);
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// חיבור ל-MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// נקודת קצה להרשמה (Register)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'The email is already registered in the system' });
    }

    // יצירת משתמש חדש (שומרים את הסיסמה כפי שהיא או מוצפנת)
    const newUser = new User({
      name,
      email,
      passwordHash: password, // בהמשך אפשר להוסיף הצפנה עם bcrypt
    });

    await newUser.save();
    res.status(201).json({ message: 'registration successful', user: { name: newUser.name, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// בקובץ השרת הראשי או בנתיבי ה-auth שלך
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ error: 'User not found. Please register.' });
    }
    
    // בדיקת סיסמה פשוטה (או השוואת hash אם מוגדר)
    if (user.passwordHash !== password) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.get('/api/user/profile', verifyToken, async (req: any, res) => {
  // נתוני המשתמש מגיעים מ-req.user.email
});

// נקודת קצה לשמירת העדפות אונבורדינג
app.post('/api/user/onboarding', async (req, res) => {
  try {
    const { email, preferences } = req.body;
    
    const user = await User.findOneAndUpdate(
      { email },
      { preferences },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Preferences saved successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error saving preferences' });
  }
});

// נקודת קצה לשליפת נתוני משתמש והעדפות
app.get('/api/user/profile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching user profile' });
  }
});


app.get('/api/users/profile', async (req, res) => {
  try {
    const email = typeof req.query.email === 'string' ? req.query.email : undefined;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error loading profile' });
  }
});
app.use('/api/ai', aiRoutes);

// נקודת קצה לניתוח AI
app.post('/api/ai/advice', async (req, res) => {
  try {
    const { investorType, cryptoAssets } = req.body;
    
    let advice = `Based on your ${investorType} profile and tracking ${cryptoAssets.join(', ')}: `;
    if (investorType === 'conservative') {
      advice += 'Tip: recommended to focus on stable assets and avoid high-risk investments.';
    } else if (investorType === 'aggressive') {
      advice += 'It seems there is room for combining high-growth opportunities, but be cautious about risk management.';
    } else {
      advice += 'It is recommended to perform a diversified portfolio and follow market trends.';
    }

    res.status(200).json({ advice });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate AI advice' });
  }
});


// נתיב שרת לחדשות קריפטו
// נתיב חדשות פנימי מאובטח בשרת
app.get('/api/news', (req, res) => {
  const dynamicNews = [
    {
      title: 'Bitcoin Surges Past Key Resistance Level Amid Strong Institutional Inflows',
      source: { title: 'CryptoPulse' },
      published_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // לפני 30 דקות
      url: 'https://coindesk.com'
    },
    {
      title: 'Ethereum Layer 2 Adoption Reaches All-Time High in Transaction Volume',
      source: { title: 'BlockDaily' },
      published_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // לפני שעה וחצי
      url: 'https://cointelegraph.com'
    },
    {
      title: 'Global Regulators Announce New Unified Framework for Digital Asset Compliance',
      source: { title: 'FinTech Watch' },
      published_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // לפני 3 שעות
      url: 'https://bloomberg.com'
    },
    {
      title: 'Solana DeFi Ecosystem Expands With Major Liquidity Milestone',
      source: { title: 'DeFi Pulse' },
      published_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // לפני 5 שעות
      url: 'https://decrypt.co'
    }
  ];

  res.status(200).json({ results: dynamicNews });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});