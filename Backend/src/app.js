const express = require("express");

const app = express();

app.use(express.json());

const { protect } = require("./middlewares/auth.middleware");
const { adminOnly } = require("./middlewares/admin.middleware");

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// test-only routes
app.get("/api/protected", protect, (req, res) => {
  res.status(200).json({ message: "Access granted" });
});

app.get("/api/admin-test", protect, adminOnly, (req, res) => {
  res.status(200).json({ message: "Admin access granted" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Sweet Shop Backend!");
});

module.exports = app;
