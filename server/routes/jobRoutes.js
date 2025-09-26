import express from 'express';
import { getJobs, createJob, deleteJob, recommendJobs } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route: get all jobs
router.get('/', getJobs);

// Protected: create a job
router.post('/', protect, createJob);

// Protected: delete a job
router.delete('/:id', protect, deleteJob);

// Protected: AI recommendation
router.post('/recommend', protect, recommendJobs);

export default router;
