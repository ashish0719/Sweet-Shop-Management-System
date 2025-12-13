const User = require("../models/User");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    user: {
      email: user.email,
    },
  });
};
