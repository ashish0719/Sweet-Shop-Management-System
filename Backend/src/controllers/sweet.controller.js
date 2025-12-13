const Sweet = require("../models/Sweet");

exports.addSweet = async (req, res) => {
  try {
    const { name, category, price, quantity, imageUrl } = req.body;

    if (!name || !category || !price || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity,
      imageUrl: imageUrl || null,
    });

    return res.status(201).json(sweet);
  } catch (error) {
    console.error("ADD SWEET ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
