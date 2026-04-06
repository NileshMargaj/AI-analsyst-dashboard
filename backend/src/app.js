import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import csv from 'csv-parser';
import fs from 'fs';


const app = express();



app.use(cors());
app.use(express.json());



export default app;