const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");

const { getSweets, addSweet } = require("../controllers/sweet.controller");

router.get("/", getSweets);
router.post("/", protect, adminOnly, addSweet);

module.exports = router;
