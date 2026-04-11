import mongoose from "mongoose";


const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI?.trim();
        if (!uri) {
            throw new Error("MONGO_URI not set in backend/.env. Copy backend/.env.example to .env");
        }
        if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
            console.warn("MONGO_URI missing scheme. Auto-fixing for local dev.");
            uri = "mongodb://" + uri;
        }
        console.log("Connecting to:", uri.replace(/:(.*)@/, ":***@"));
        await mongoose.connect(uri);
        console.log("Database connected successfully..");
        
    } catch (error) {
        console.error("MongoDB Error:", error.message);
        console.log("Server continues without DB. Create backend/.env from .env.example");
    }
};

export default connectDB;
