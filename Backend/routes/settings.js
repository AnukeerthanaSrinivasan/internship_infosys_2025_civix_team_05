const express = require("express");
const auth = require("../middleware/authMiddleware");
const User = require("../models/user");
const router = express.Router();

router.post("/update-profile", auth, async (req, res) => {
  try {
    const userId = req.user.id; 
    const { firstName, lastName, phone, profilepicture } = req.body;
    const updatedData = { firstName, lastName, phone, profilepicture };
    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json(err.message);
  } 
});

module.exports = router;