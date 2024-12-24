import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { analyzeURLExternal } from './services/urlAnalyzer.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting - 5 requests per hour per IP
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/api', limiter);

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'An unexpected error occurred',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// API Routes
app.post('/api/analyze', async (req, res, next) => {
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

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

// Handle all other routes by serving the index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Apply error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});