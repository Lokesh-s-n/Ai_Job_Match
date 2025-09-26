import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import connectDB from './utils/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

dotenv.config();

const app = express();

// 🌐 CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// 🔧 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('common'));

// 🗄 Connect DB
connectDB();

// 📂 Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('AI Job Match API is running...');
});

// ❌ Not found + Error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

