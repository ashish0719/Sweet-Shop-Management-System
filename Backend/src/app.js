const express = require("express");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://sweet-shop-frontend.vercel.app',
    /^https:\/\/.*\.vercel\.app$/
  ];
  
  if (origin) {
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      return allowed.test(origin);
    });
    
    if (isAllowed) {
      res.header("Access-Control-Allow-Origin", origin);
    } else {
      res.header("Access-Control-Allow-Origin", "*");
    }
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }
  
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const { protect } = require("./middlewares/auth.middleware");
const { adminOnly } = require("./middlewares/admin.middleware");
const sweetRoutes = require("./routes/sweet.routes");

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// test-only routes

app.get("/", (req, res) => {
  res.send("Welcome to the Sweet Shop Backend!");
});

app.use("/api/sweets", sweetRoutes);

module.exports = app;
