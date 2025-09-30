const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendOtp = require("../utils/sendOtp");

const router = express.Router();

// In-memory store for signup OTPs
let pendingsignup = {};

// @POST /signup
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    await sendOtp(email, otpCode);
    pendingsignup[email] = { user, otpCode, otpExpiresAt };

    res.json({ message: "User registered, OTP sent to email", email });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// @POST /verify-otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!pendingsignup[email]) {
      return res.status(400).json({ error: "No signup request found" });
    }

    const { user, otpCode, otpExpiresAt } = pendingsignup[email];

    if (otpCode !== code || otpExpiresAt < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await user.save();
    delete pendingsignup[email]; // clear after successful verification

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ message: "Verified successfully", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @POST /login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// @POST /forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOtp = otpCode;
    user.resetOtpExpiry = otpExpiry;
    await user.save();

    await sendOtp(email, otpCode);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// @POST /reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (!user.resetOtp || user.resetOtp !== otp || user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpiry = null;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
