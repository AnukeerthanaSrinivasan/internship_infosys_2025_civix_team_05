
const express=require("express");
const auth=require("../middleware/authMiddleware");
const request=require("../models/request");
const task=require("../models/task");
const router = express.Router();
router.get("/requests", auth, async (req, res) => {
  try {
    const userid = req.user.id;

    // Get all tasks created by the logged-in user
    const tasks = await task.find({ userId: userid });
    const taskIds = tasks.map(t => t._id);

    // Fetch requests and populate both requester and task details
    const requests = await request
      .find({ task: { $in: taskIds } })
      .populate("requester", "firstName email")   // only fetch name & email from requester
      .populate("task", "title description"); // only fetch title & description from task

    res.json(requests);
  } catch (err) {
    res.status(500).json(err.message);
  }
});


router.post("/addrequest",auth,async(req,res)=>{
    try{
        const userId=req.user.id; 
        const {taskId,description}=req.body;

        const existingrequest=await request.findOne({task:taskId,requester:userId});
        if(existingrequest)
        {
            return res.status(400).json({error:"Request already exists for this task by the user"});
        }
        else{       
            const newRequest=new request({
            task:taskId,
            requester:userId,
            description,
            status:"pending"
        });
        await newRequest.save();
        res.json(newRequest);
    }
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
});


module.exports=router;