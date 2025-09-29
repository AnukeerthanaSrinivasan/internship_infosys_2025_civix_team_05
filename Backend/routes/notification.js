const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");
const auth=require("../middleware/authMiddleware");

router.post("/add", async (req, res) => {
  try {
    const { userId, message} = req.body;
    const notification = new Notification({ userId, message });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/get",auth,async (req, res) => {
  try {
    const userId=req.user.id;
    const notifications = await Notification.find({userId:userId});
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/update",auth,async (req, res) => {
  try {
    const { notificationId} = req.body;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
