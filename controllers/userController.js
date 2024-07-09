const { User } = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Register a new user
const createdUser = asyncHandler(async (req, res) => {
  const { username, email, password, profile } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  user = new User({
    username,
    email,
    password,
    profile
  });

  await user.save();

  const payload = {
    user: {
      id: user._id
    }
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 360000 },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
});

// Login a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ msg: 'Invalid Credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ msg: 'Invalid Credentials' });
  }

  const payload = {
    user: {
      id: user._id
    }
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 360000 },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
  const { username, email, profile } = req.body;
  const userFields = { username, email, profile };

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndRemove(req.params.id);
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = {
  createdUser,
  getAllUsers,
  loginUser,
  getUserById,
  updateUser,
  deleteUser
};
