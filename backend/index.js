import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});

import app from "./src/app.js";
import connectDB from "./src/db/db.js";


const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});