import express from 'express';
import { queryDatasetAI } from '../controllers/ai.controller.js';
import ensureIsUserAuthenticated from '../middlewares/userAuthentcate.middleware.js';

const router = express.Router();

// AI Query endpoint: POST /api/ai/:datasetId/query
router.post('/:datasetId/query', ensureIsUserAuthenticated, queryDatasetAI);

export default router;

