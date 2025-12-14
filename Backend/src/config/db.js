const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/sweet-shop";
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.error("Please make sure MongoDB is running on", process.env.MONGO_URI || "mongodb://localhost:27017");
    process.exit(1);
  }
};

module.exports = connectDB;
