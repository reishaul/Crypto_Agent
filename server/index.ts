import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// חיבור למונגו
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// נקודת בדיקה שהשרת עובד
app.get('/', (req, res) => {
  res.send('Moveo Crypto Advisor API is running');
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});