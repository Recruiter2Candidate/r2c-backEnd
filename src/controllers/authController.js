// This file handles user sign-up (registration) and log-in functionality. When a user registers, it checks if they already exist, creates a new user, and generates a token for secure access. When a user logs in, it checks their credentials (email and password), and if valid, generates a token for secure access.

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Enable or disable debug logs
const DEBUG = true;

// Function to get the current timestamp
const getTimeStamp = () => {
  return new Date().toISOString(); // Returns the current timestamp in ISO 8601 format
};

// Register user
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body; // Get user data from the request body

  // Check if any of these field is empty, if its empty throw error
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    // Check if the user already exists in the database, if the email exists already in the datbase send a error message
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // If user doesn't exist, create a new user
    const user = await User.create({ firstName, lastName, email, password });

    // Generate a token for the new user without expiration
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    if (DEBUG) console.log("Generated Token:", token);

    // Respond with the user data and their token, user created successfully
    res.status(201).json({ user: { firstName, lastName, email }, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error }); // handle unexpected error
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body; // Get login details from the request body

  // Check if any field is empty, if any is empty send an error message
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    // Check if the user exists in the database, if user.email exists in the databse send an eror message
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // This bit will be for password authentication to compare if the provided password tallys with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" }); // Send an error message if passwords don't match
    }

    // Generate a token for the logged-in user without expiration
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    // Debug log with timestamp
    if (DEBUG) {
      console.log(`[${getTimeStamp()}] Generated Token:`, token);
    }

    // Respond with the user data and their token
    res.status(200).json({
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error }); // handle unexpected error
  }
};

const logOutUser = async (req, res) => {
  try {
    res.status(200).json({ message: "User logged out successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error });
  }
};

module.exports = { registerUser, loginUser, logOutUser };
