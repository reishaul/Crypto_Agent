import express, { type Request, type Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import User from './models/User.js';
import aiRoutes from './routes/aiRoutes.js';
import { verifyToken } from './middleware/auth.js';

import bcrypt from 'bcryptjs';
import memesData from './memes.json' with { type: 'json' };

interface CryptoMeme {
  id: number;
  title: string;
  imageUrl: string;
  postUrl: string;
  score: number;
  author: string;
  license: string;
}

const memes = memesData as CryptoMeme[];

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

app.use(express.json());


app.use(cors());

app.use('/memes', express.static('memes')); // Serve static meme images
app.use('/api/ai', aiRoutes);


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

    const passwordHash = await bcrypt.hash(password, 10);
    // יצירת משתמש חדש (שומרים את הסיסמה כפי שהיא או מוצפנת)
    const newUser = new User({
      name,
      email,
      passwordHash, // בהמשך אפשר להוסיף הצפנה עם bcrypt
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
      return res.status(400).json({
        error: 'User not found. Please register.'
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return res.status(400).json({
        error: 'Invalid password'
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      JWT_SECRET,
      {
        expiresIn: '24h'
      }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });

  } catch (err) {
    res.status(500).json({
      error: 'Server error during login'
    });
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



app.get('/api/memes', (req: Request, res: Response) => {
  try {
    if (!memes || memes.length === 0) {
      return res.status(200).json({
        memes: [],
        message: 'No memes available'
      });
    }

    return res.status(200).json({
      memes: memes
    });

  } catch (error) {
    console.error('Meme error:', error);

    return res.status(500).json({
      error: 'Unable to load memes'
    });
  }
});

// נתיב לקבלת תובנות AI אמיתיות מ-OpenRouter
app.post('/api/ai-insight', async (req, res) => {
  try {
    const { investorType, cryptoAssets } = req.body;

    // מפתח API חינמי של OpenRouter (תוכל להחליף או לשמור במשתנה סביבה .env)
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'your-openrouter-api-key-here';

    const prompt = `You are a professional crypto financial advisor. The user has an "${investorType || 'Standard'}" investor profile and tracks these assets: ${cryptoAssets?.join(', ') || 'Bitcoin, Ethereum'}. Give a short, sharp, professional, and realistic 2-sentence market insight tailored to this profile.`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-chat', // או כל ממודל חינמי אחר זמין ב-OpenRouter כמו mistralai/mistral-7b-instruct
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000', // דרישת חובה של OpenRouter
          'X-Title': 'Crypto Dashboard'
        }
      }
    );

    const insightText = response.data.choices[0]?.message?.content || 'Monitor your risk management closely in current market conditions.';
    
    res.status(200).json({ insight: insightText });
  } catch (err: any) {
    console.error('OpenRouter API Error:', err.response?.data || err.message);
    
    // במקרה של תקלת מפתח או רשת, מחזירים גיבוי איכותי כדי שהאתר לא יישבר
    res.status(200).json({ 
      insight: `Based on your crypto assets tracking: Maintain disciplined risk management and watch key resistance levels closely.` 
    });
  }
});




// הגדרת ה-Schema
const feedbackSchema = new mongoose.Schema({
  userId: String,
  contentId: String,
  contentType: String,
  vote: {
    type: String,
    enum: ['like', 'dislike']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// הנתיב בשרת
app.post('/api/feedback', async (req, res) => {
  try {
    const { userId, contentId, contentType, vote } = req.body;

    // שמירת הפידבק החדש במסד הנתונים
    const newFeedback = new Feedback({ userId, contentId, contentType, vote });
    await newFeedback.save();

    res.json({ message: 'Feedback saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error saving feedback' });
  }
});