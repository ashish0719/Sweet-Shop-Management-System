const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");

const { getSweets, searchSweets, addSweet, updateSweet } = require("../controllers/sweet.controller");

router.get("/", getSweets);
router.get("/search", searchSweets);
router.post("/", protect, adminOnly, addSweet);
router.put("/:id", protect, adminOnly, updateSweet);

module.exports = router;
