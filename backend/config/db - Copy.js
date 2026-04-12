import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect(process.env.DB_URL).then(() => {
        console.log('MongoDB connected successfully');
    }).catch((err) => {
        console.log('MongoDB connection failed', err.message);
    });
};