import express from 'express';
import cors from 'cors';
import uploadRoutes from "./routes/upload.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import userRoutes from "./routes/user.routes.js";
import multer from 'multer';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();

//! Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], 
  credentials: true                
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    env_openai: !!process.env.OPENAI_API_KEY ? 'SET' : 'MISSING',
    env_jwt: !!process.env.JWT_SECRET ? 'SET' : 'MISSING',
    timestamp: new Date().toISOString()
  });
});

//! Base routes
app.use("/auth", userRoutes);
app.use("/api", uploadRoutes);
app.use("/api/ai", aiRoutes);

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: `File too large (max 1MB)` });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  next(err);
};

app.use(multerErrorHandler);

export default app;

