const express = require("express");
const { protect } = require("./middlewares/auth.middleware");

const app = express();

app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Sweet Shop Backend!");
});

module.exports = app;
