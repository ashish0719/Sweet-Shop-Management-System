const Sweet = require("../models/Sweet");

exports.getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find({});
    const sweetsResponse = sweets.map((sweet) => {
      const sweetObj = {
        id: sweet._id.toString(),
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
      };
      if (sweet.imageUrl) {
        sweetObj.image = sweet.imageUrl;
      }
      return sweetObj;
    });

    return res.status(200).json(sweetsResponse);
  } catch (error) {
    console.error("GET SWEETS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

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
