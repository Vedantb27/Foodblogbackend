const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Checking credentials for email:", email);
    console.log("Password from request:", password);
    // Find user by email
    const user = await User.findOne({ email });
    console.log("User found:", user);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  
    // Ensure user object has password field
    if (!user.password) {
      console.log("User does not have a password field:", user);
      return res.status(400).json({ message: "Invalid credentials" });
    }
  
    // Trim and convert passwords to lowercase for case-insensitive comparison
    const trimmedPassword = password.trim().toLowerCase();
    const trimmedUserPassword = user.password.trim().toLowerCase();
  
    // Compare plaintext passwords
    if (trimmedPassword !== trimmedUserPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  
    // If passwords match, generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};

module.exports = {
    login
};
