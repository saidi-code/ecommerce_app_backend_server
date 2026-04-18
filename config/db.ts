import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
        console.error("Error connecting to MongoDB:", err);
    });
    mongoose.connection.on("disconnected", () => {
        console.log("Disconnected from MongoDB");
    });

    try {
        await mongoose.connect(process.env.DB_URI+"/" + process.env.DB_NAME);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }   
}
export default connectDB;