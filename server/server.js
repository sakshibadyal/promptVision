import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routes/userRoute.js'; // <-- Import your new routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🚀 MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};
connectDB();

// API Endpoints
app.use('/api/user', userRouter); // <-- Hook up the routes!

app.get('/', (req, res) => {
  res.send("promptVision API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});