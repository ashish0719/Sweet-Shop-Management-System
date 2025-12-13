require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/sweet-shop-test";
  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
}, 30000);

afterAll(async () => {
  await mongoose.connection.close();
});
