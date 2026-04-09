import express from "express";
import { upload } from "../utils/multer.js";
import {
  uploadCSV,
  analyzeDataset,
  queryDataset,
  getColumnStats,
  groupAndAnalyze,
  filterAndExport,
  getDataset,
  getAllDatasets
} from "../controllers/upload.controller.js";
import ensureIsUserAuthenticated from "../middlewares/userAuthentcate.middleware.js"

const router = express.Router();

//! Get all datasets (list view)
router.get("/uploads", ensureIsUserAuthenticated, getAllDatasets);

//! Upload CSV file
router.post("/upload", ensureIsUserAuthenticated, upload.single("file"), uploadCSV);

//! Get full dataset with pagination
router.get("/:datasetId", ensureIsUserAuthenticated, getDataset);

//! Analyze dataset metadata and schema
router.get("/:datasetId/analyze", ensureIsUserAuthenticated, analyzeDataset);

//! Get column-specific statistics
router.get("/:datasetId/column/:columnName/stats", ensureIsUserAuthenticated, getColumnStats);

//! Group and analyze data
router.post("/:datasetId/group", ensureIsUserAuthenticated, groupAndAnalyze);

//! Execute complex query
router.post("/:datasetId/query", ensureIsUserAuthenticated, queryDataset);

//! Filter and export data
router.post("/:datasetId/export", ensureIsUserAuthenticated, filterAndExport);

export default router;