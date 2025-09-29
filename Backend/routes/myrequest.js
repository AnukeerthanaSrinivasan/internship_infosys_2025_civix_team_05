const express = require("express");
const AcceptedTask = require("../models/acceptedTask");
const auth=require("../middleware/authMiddleware");
const request=require("../models/request");

const router = express.Router();

router.post("/accept", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId, description, requestId } = req.body;

    // 1. Create AcceptedTask
    const newAcceptedTask = new AcceptedTask({
      taskId,
      userId,
      description,
      status: "accepted",
    });
    await newAcceptedTask.save();

    // 2. Update original Request
    await request.findByIdAndUpdate(requestId, { status: "accepted" });

    res.json({ acceptedTask: newAcceptedTask, message: "Task accepted!" });
  } catch (err) {
    res.status(500).json(err.message);
  }
});


router.get("/myrequesttasks",auth,async(req,res)=>
{
    try{
        const userId=req.user.id;
        const myRequests=await AcceptedTask.find({userId});
        const tasks=await request.find({requester:userId});
        res.json({myRequests,tasks});     
    }       
    catch(err)
    {
        res.status(500).json(err.message);
    }   
}
);



module.exports = router;