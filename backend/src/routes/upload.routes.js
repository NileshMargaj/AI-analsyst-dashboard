import express from "express";
import { upload } from "../utils/multer.js";
import {
  uploadCSV,
  analyzeDataset,
  queryDataset,
  getColumnStats,
  filterAndExport,
  getDataset,
  getAllDatasets
} from "../controllers/upload.controller.js";
import ensureIsUserAuthenticated from "../middlewares/userAuthentcate.middleware.js"

const router = express.Router();

//! Get all datasets (PUBLIC - no auth)
router.get("/public", getAllDatasets);

//! Get all datasets (AUTH required)
router.get("/uploads", ensureIsUserAuthenticated, getAllDatasets);

//! Upload CSV file
router.post("/upload", ensureIsUserAuthenticated, upload.single("file"), uploadCSV);

//! Get full dataset with pagination
router.get("/:datasetId", ensureIsUserAuthenticated, getDataset);

//! Analyze dataset metadata and schema
router.get("/:datasetId/analyze", ensureIsUserAuthenticated, analyzeDataset);

//! Get column-specific statistics
router.get("/:datasetId/column/:columnName/stats", ensureIsUserAuthenticated, getColumnStats);



//! Execute complex query
router.post("/:datasetId/query", ensureIsUserAuthenticated, queryDataset);

//! Filter and export data
router.post("/:datasetId/export", ensureIsUserAuthenticated, filterAndExport);

export default router;
