const mongoose = require("mongoose");
const Sweet = require("../models/Sweet");
require("dotenv").config();

const sweetsData = [
  {
    name: "Gulab Jamun",
    category: "Milk",
    price: 5.99,
    quantity: 25,
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400"
  },
  {
    name: "Motichoor Ladoo",
    category: "Dry Fruit",
    price: 8.50,
    quantity: 30,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"
  },
  {
    name: "Kaju Barfi",
    category: "Dry Fruit",
    price: 12.99,
    quantity: 20,
    imageUrl: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400"
  },
  {
    name: "Jalebi",
    category: "Milk",
    price: 6.50,
    quantity: 35,
    imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400"
  },
  {
    name: "Rasgulla",
    category: "Milk",
    price: 5.50,
    quantity: 15,
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400"
  },
  {
    name: "Kesar Pista Barfi",
    category: "Dry Fruit",
    price: 9.99,
    quantity: 18,
    imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400"
  },
  {
    name: "Soan Papdi",
    category: "Sugar-Free",
    price: 7.99,
    quantity: 22,
    imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4bdc5b89?w=400"
  },
  {
    name: "Besan Ladoo",
    category: "Dry Fruit",
    price: 6.99,
    quantity: 28,
    imageUrl: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400"
  },
  {
    name: "Peda",
    category: "Milk",
    price: 7.50,
    quantity: 20,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"
  },
  {
    name: "Badam Halwa",
    category: "Dry Fruit",
    price: 10.99,
    quantity: 12,
    imageUrl: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400"
  },
  {
    name: "Kalakand",
    category: "Milk",
    price: 8.99,
    quantity: 16,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"
  },
  {
    name: "Coconut Barfi",
    category: "Sugar-Free",
    price: 6.75,
    quantity: 24,
    imageUrl: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400"
  },
  {
    name: "Gajar Halwa",
    category: "Dry Fruit",
    price: 9.50,
    quantity: 14,
    imageUrl: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400"
  },
  {
    name: "Rasmalai",
    category: "Milk",
    price: 7.25,
    quantity: 19,
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400"
  },
  {
    name: "Kheer",
    category: "Milk",
    price: 5.75,
    quantity: 26,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"
  }
];

const seedSweets = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Sweet.deleteMany({});
    console.log("Cleared existing sweets");

    const sweets = await Sweet.insertMany(sweetsData);
    console.log(`Successfully seeded ${sweets.length} sweets`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding sweets:", error);
    process.exit(1);
  }
};

seedSweets();

