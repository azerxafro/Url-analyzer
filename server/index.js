import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { analyzeURLExternal } from './services/urlAnalyzer.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration - allow all origins in development
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many requests, please try again later.' }
});

// API Routes
app.post('/api/analyze', limiter, async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const result = await analyzeURLExternal(url);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'An unexpected error occurred',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});