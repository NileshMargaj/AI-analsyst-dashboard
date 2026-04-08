import express from "express";
import { upload } from "../utils/multer.js";
import { uploadCSV } from "../controllers/upload.controller.js";
import ensureIsUserAuthenticated from "../middlewares/userAuthentcate.middleware.js"

const router = express.Router();


router.post("/upload",ensureIsUserAuthenticated, upload.single("file"), uploadCSV);

export default router;