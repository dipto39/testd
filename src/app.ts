import dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? './.env.production' : './.env'
});

import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import apiRoutes from './routes/api';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined');
}

mongoose
  .connect(databaseUrl)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully.');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });

const PORT = process.env.PORT || 8000;
const app = express();



// Security
app.use(helmet());

// CORS
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Default route
app.get('*', (_req: Request, res: Response) => {
  res.send('Welcome to Pet-pals backend!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 App listening on port ${PORT}`);
});
