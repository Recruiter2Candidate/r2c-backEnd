// This file contains a function that checks if a user is authorized to access certain routes. It looks for a token in the request’s headers, verifies the token, and checks if the user exists in the database. If everything checks out, it lets the user continue; if not, it returns an error.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Enable or disable debug logs
const DEBUG = true;

const validateUser = async (req, res, next) => {
  // Check if the Authorization header exists
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message:
        "No token provided or invalid token format. Authorization denied.",
    });
  }

  try {
    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the decoded token contains the required data
    if (!decoded.id) {
      return res.status(403).json({ message: "Access denied. Invalid token." });
    }

    // Find the user in the database using the ID from the token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(403)
        .json({ message: "Access denied. User not found." });
    }

    //If User found, attach user details to the request for further use
    req.user = user;
    if (DEBUG) console.log("User validated successfully:", user.email);
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res
      .status(403)
      .json({ message: "Access denied. Invalid token.", error: error.message });
  }
};

module.exports = validateUser;
