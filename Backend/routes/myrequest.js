const express = require("express");
const AcceptedTask = require("../models/acceptedTask");
const auth=require("../middleware/authMiddleware");
const request=require("../models/request");
const RejectedTask=require("../models/rejectedtask");

const router = express.Router();
router.post("/accept", auth, async (req, res) => {
  try {
    const accepter = req.user.id;
    const { taskId, requester } = req.body;

    // Update request status
    const updatedRequest = await request.findOneAndUpdate(
      { task: taskId, requester },
      { status: "accepted", accepter },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(400).json({ error: "No such request found" });
    }

    // Save in AcceptedTask collection too
    const acceptedTask = new AcceptedTask({
      task: taskId,
      requester,
      accepter,
      description: updatedRequest.description, // optional if you want
      createdAt: new Date(),
    });
    await acceptedTask.save();

    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/myrequesttasks", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const accepted = await AcceptedTask.find({ requester: userId }).lean();
    const pending = await request.find({ requester: userId }).lean();
    const rejected = await RejectedTask.find({ requester: userId }).lean();

    const results = [
      ...accepted.map(t => ({ ...t, status: "accepted" })),
      ...pending.map(t => ({ ...t, status: "pending" })),
      ...rejected.map(t => ({ ...t, status: "rejected" })),
    ];

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/reject", auth, async (req, res) => {
  try {
    const rejecter = req.user.id;
    const { taskId, requester } = req.body;

    // Update request status
    const updatedRequest = await request.findOneAndUpdate(
      { task: taskId, requester },
      { status: "rejected", rejecter },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(400).json({ error: "No such request found" });
    }

    // Save in RejectedTask collection too
    const rejectedTask = new RejectedTask({
      task: taskId,
      requester,
      rejecter,
      description: updatedRequest.description, // optional if you want
      createdAt: new Date(),
    });
    await rejectedTask.save();

    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;