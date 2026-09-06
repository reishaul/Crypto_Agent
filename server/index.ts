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
//this file is the main server file for the application. It sets up the Express server, connects to MongoDB Atlas, and defines
//  various API endpoints for user authentication, onboarding preferences, AI advice generation, news retrieval, meme serving, and 
// feedback collection. The server also includes middleware for handling CORS and JWT token verification.

// Define the structure of a CryptoMeme object, which includes properties such as id, title, imageUrl, postUrl, score, author, and license.
interface CryptoMeme{
  id: number;
  title: string;
  imageUrl: string;
  postUrl: string;
  score: number;
  author: string;
  license: string;
}

const memes =memesData as CryptoMeme[];// Load memes from the imported JSON file and cast them to the CryptoMeme type for type safety.

dotenv.config();// Load environment variables from a .env file into process.env for secure configuration management.

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';
const JWT_SECRET = process.env.JWT_SECRET || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

app.use(express.json());// Middleware to parse incoming JSON requests and make the data available in req.body.


app.use(cors());// Middleware to enable Cross-Origin Resource Sharing (CORS), allowing the server to accept requests from different origins

app.use('/memes', express.static('memes')); // Serve static meme images
app.use('/api/ai', aiRoutes);


// connect to MongoDB Atlas using Mongoose, logging success or error messages to the console based on the connection outcome.
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// register a new user by checking if the email already exists, hashing the password, and saving the user to the database. 
// Returns appropriate success or error messages.
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password} =req.body;

    // Check if the email is already registered in the system
    const existingUser = await User.findOne({ email });
    if(existingUser){
      return res.status(400).json({ error: 'The email is already registered in the system' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // create a new user instance with the provided name, email, and hashed password. The password is hashed using bcrypt for security.
    const newUser = new User({
      name,
      email,
      passwordHash, // Store the hashed password instead of the plain text password for security
    });

    await newUser.save();
    res.status(201).json({ message: 'registration successful', user: { name: newUser.name, email: newUser.email } });
  } 
  catch (err){
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// post endpoint for user login, which verifies the user's credentials and generates a JWT token upon successful authentication.
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try{
    const{ email, password } =req.body;

    const user = await User.findOne({ email});

    if(!user){
      return res.status(400).json({
        error: 'User not found. Please register.'
      });
    }

    const isValidPassword =await bcrypt.compare(
      password,
      user.passwordHash
    );

    if(!isValidPassword){
      return res.status(400).json({
        error: 'Invalid password'
      });
    }

    const token =jwt.sign(
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

  } 
  catch (err){
    res.status(500).json({
      error: 'Server error during login'
    });
  }
});


//jwt verification middleware is applied to the /api/user/profile route to ensure that only authenticated users can access their profile data.
app.get('/api/user/profile', verifyToken, async (req: any, res) => {

});

// edge point to save user onboarding preferences, which updates the user's document in the database with their selected preferences.
app.post('/api/user/onboarding', async (req, res) => {
  try{
    const{ email, preferences } =req.body;
    
    const user = await User.findOneAndUpdate(
      { email},
      { preferences },
      { new: true}
    );

    if(!user){
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Preferences saved successfully', user });
  } 
  catch (err){
    res.status(500).json({ error: 'Server error saving preferences' });
  }
});

// endpoint to fetch user profile data based on the provided email, returning the user's information if found or an error message if not.
app.get('/api/user/profile/:email', async (req, res) => {
  try{
    const { email} =req.params;
    const user = await User.findOne({ email }).select('-passwordHash');

    if(!user){
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  }
  catch(err){
    res.status(500).json({ error: 'Server error fetching user profile' });
  }
});


// endpoint to fetch user profile data based on the provided email, returning the user's information if found or an error message if not.
app.get('/api/users/profile', async (req, res) => {
  try{
    const email =typeof req.query.email === 'string' ? req.query.email : undefined;

    if(!email){
      return res.status(400).json({ error: 'Email is required' });
    }

    const user =await User.findOne({ email });
    if (!user){
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } 
  catch(err){
    res.status(500).json({ error: 'Server error loading profile' });
  }
});

app.use('/api/ai', aiRoutes);// Use the aiRoutes for any requests starting with /api/ai, allowing for modular route handling and separation of concerns in the codebase.

//endpoint to generate AI advice based on the user's investor type and selected crypto assets, returning tailored investment advice.
app.post('/api/ai/advice', async (req, res) => {
  try{
    const{ investorType, cryptoAssets } = req.body;
    
    let advice = `Based on your ${investorType} profile and tracking ${cryptoAssets.join(', ')}: `;
    if(investorType === 'conservative'){
      advice += 'Tip: recommended to focus on stable assets and avoid high-risk investments.';
    } 
    else if(investorType === 'aggressive'){
      advice += 'It seems there is room for combining high-growth opportunities, but be cautious about risk management.';
    } 
    else{
      advice += 'It is recommended to perform a diversified portfolio and follow market trends.';
    }

    res.status(200).json({ advice});
  } 
  catch (err){
    res.status(500).json({ error: 'Failed to generate AI advice' });
  }
});


// endpoint to fetch dynamic crypto news articles, returning a list of news items with titles, sources, publication times, and URLs.
app.get('/api/news', (req, res) => {
  const dynamicNews = [
    {
      title: 'Bitcoin Surges Past Key Resistance Level Amid Strong Institutional Inflows',
      source: { title: 'CryptoPulse' },
      published_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), 
      url: 'https://coindesk.com'
    },
    {
      title: 'Ethereum Layer 2 Adoption Reaches All-Time High in Transaction Volume',
      source: { title: 'BlockDaily' },
      published_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      url: 'https://cointelegraph.com'
    },
    {
      title: 'Global Regulators Announce New Unified Framework for Digital Asset Compliance',
      source: { title: 'FinTech Watch' },
      published_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      url: 'https://bloomberg.com'
    },
    {
      title: 'Solana DeFi Ecosystem Expands With Major Liquidity Milestone',
      source: { title: 'DeFi Pulse' },
      published_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(), 
      url: 'https://decrypt.co'
    }
  ];

  res.status(200).json({ results: dynamicNews });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// endpoint to fetch static crypto news articles, returning a predefined list of news items with titles, sources, publication times, and URLs.
app.get('/api/memes', (req: Request, res: Response) => {
  try{
    if(!memes || memes.length === 0) {
      return res.status(200).json({
        memes: [],
        message: 'No memes available'
      });
    }

    return res.status(200).json({
      memes: memes
    });

  } 
  catch(error){
    console.error('Meme error:', error);

    return res.status(500).json({
      error: 'Unable to load memes'
    });
  }
});

// endpoint to generate AI insights based on the user's investor type and selected crypto assets, utilizing the OpenRouter API to provide tailored market insights.
app.post('/api/ai-insight', async (req, res) => {
  try{
    const{ investorType, cryptoAssets} = req.body;

    // Use the OpenRouter API to generate a market insight based on the user's investor profile and tracked crypto assets.
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'your-openrouter-api-key-here';

    const prompt = `You are a professional crypto financial advisor. The user has an "${investorType || 'Standard'}" investor profile and tracks these assets: ${cryptoAssets?.join(', ') || 'Bitcoin, Ethereum'}. Give a short, sharp, professional, and realistic 2-sentence market insight tailored to this profile.`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-chat', // model name
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000', //temporary referer for local development
          'X-Title': 'Crypto Dashboard'
        }
      }
    );

    const insightText = response.data.choices[0]?.message?.content || 'Monitor your risk management closely in current market conditions.';
    
    res.status(200).json({ insight: insightText });
  } 
  catch (err: any) {
    console.error('OpenRouter API Error:', err.response?.data || err.message);
    
    // Fallback insight in case of an error with the OpenRouter API
    res.status(200).json({ 
      insight: `Based on your crypto assets tracking: Maintain disciplined risk management and watch key resistance levels closely.` 
    });
  }
});




// define a Mongoose schema for user feedback, which includes fields for userId, contentId, contentType, vote (like or dislike), and a timestamp for when the feedback was created.
const feedbackSchema =new mongoose.Schema({
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

const Feedback= mongoose.model('Feedback', feedbackSchema);

// endpoint to handle user feedback submissions, which saves the feedback to the database and returns a success message or an error if the operation fails.
app.post('/api/feedback', async (req, res) => {
  try{
    const{ userId, contentId, contentType, vote } = req.body;

    // Create a new feedback document and save it to the database
    const newFeedback =new Feedback({ userId, contentId, contentType, vote });
    await newFeedback.save();

    res.json({ message: 'Feedback saved successfully' });
  } 
  catch (error) {
    res.status(500).json({ error: 'Server error saving feedback' });
  }
});