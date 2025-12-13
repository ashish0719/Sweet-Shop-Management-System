const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");

const { addSweet } = require("../controllers/sweet.controller");

router.post("/", protect, adminOnly, addSweet);

module.exports = router;
