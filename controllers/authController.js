const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
// Register

exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered", user });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Login
// Login

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ error: "Password Wrong" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Get User by ID
// Get User by ID

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Update User
// Update User

exports.updateUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const updatedData = {};

    if (username) updatedData.username = username;
    if (password) updatedData.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User updated", user });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Delete User
// Delete User

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.json({ error: err.message });
  }
};
