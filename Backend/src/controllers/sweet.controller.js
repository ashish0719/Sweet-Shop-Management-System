const Sweet = require("../models/Sweet");

const mapSweetToResponse = (sweet) => {
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
};

exports.getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find({});
    const sweetsResponse = sweets.map(mapSweetToResponse);

    return res.status(200).json(sweetsResponse);
  } catch (error) {
    console.error("GET SWEETS ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    const sweets = await Sweet.find(query);
    const sweetsResponse = sweets.map(mapSweetToResponse);

    return res.status(200).json(sweetsResponse);
  } catch (error) {
    console.error("SEARCH SWEETS ERROR:", error);
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

exports.updateSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity, imageUrl } = req.body;

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    if (name !== undefined) sweet.name = name;
    if (category !== undefined) sweet.category = category;
    if (price !== undefined) sweet.price = price;
    if (quantity !== undefined) sweet.quantity = quantity;
    if (imageUrl !== undefined) sweet.imageUrl = imageUrl || null;

    await sweet.save();

    return res.status(200).json(mapSweetToResponse(sweet));
  } catch (error) {
    console.error("UPDATE SWEET ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteSweet = async (req, res) => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findByIdAndDelete(id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    return res.status(200).json({ message: "Sweet deleted successfully" });
  } catch (error) {
    console.error("DELETE SWEET ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.purchaseSweet = async (req, res) => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    if (sweet.quantity === 0) {
      return res.status(400).json({ message: "Sweet out of stock" });
    }

    sweet.quantity -= 1;
    await sweet.save();

    return res.status(200).json(mapSweetToResponse(sweet));
  } catch (error) {
    console.error("PURCHASE SWEET ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.restockSweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ message: "Sweet not found" });
    }

    sweet.quantity += quantity;
    await sweet.save();

    return res.status(200).json(mapSweetToResponse(sweet));
  } catch (error) {
    console.error("RESTOCK SWEET ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
