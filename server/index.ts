import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js'; //
import aiRoutes from './routes/aiRoutes.js';

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
      return res.status(400).json({ error: 'האימייל כבר רשום במערכת' });
    }

    // יצירת משתמש חדש (שומרים את הסיסמה כפי שהיא או מוצפנת)
    const newUser = new User({
      name,
      email,
      passwordHash: password, // בהמשך אפשר להוסיף הצפנה עם bcrypt
    });

    await newUser.save();
    res.status(201).json({ message: 'ההרשמה בוצעה בהצלחה', user: { name: newUser.name, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ error: 'שגירת שרת פנימית בהרשמה' });
  }
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

// נקודת קצה לשليפת נתוני משתמש והעדפות
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

app.use('/api/ai', aiRoutes);

// נקודת קצה לניתוח AI
app.post('/api/ai/advice', async (req, res) => {
  try {
    const { investorType, cryptoAssets } = req.body;
    
    let advice = `בהתאם לפרופיל ה${investorType} שלך ולמעקב אחרי ${cryptoAssets.join(', ')}: `;
    if (investorType === 'conservative') {
      advice += 'מומלץ לשמור על פיזור רחב ולהתמקד בנכסים מרכזיים ויציבים בלבד.';
    } else if (investorType === 'aggressive') {
      advice += 'נראה שיש מקום לשילוב הזדמנויות צמיחה גבוהה, אך הקפד על ניהול סיכונים קפדני.';
    } else {
      advice += 'מומלץ לבצע איזון תיק תקופתי ולעקוב אחרי מגמות השוק.';
    }

    res.status(200).json({ advice });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate AI advice' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});