//const User = require("../models/User");
import User from "../models/User.js"

const handleCivicLogin = async (req, res) => {
  try {
    const { civicId, email, name, avatarUrl } = req.body;

    if (!civicId) {
      return res.status(400).json({ error: "Civic ID is required." });
    }

    let user = await User.findOne({ civicId });

    if (!user) {
      user = await User.create({
        civicId,
        email,
        name,
        avatarUrl,
      });
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Civic login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default  { handleCivicLogin };
