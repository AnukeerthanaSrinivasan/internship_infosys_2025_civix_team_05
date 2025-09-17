
const express=require("express");
const auth=require("../middleware/authMiddleware");
const request=require("../models/request");

const router = express.Router();

router.get("/requests", auth, async (req, res) => {
    try{
    const userId = req.user.id;
const requests = await request.aggregate([
  {
    $lookup: {
      from: "tasks",            // join with tasks collection
      localField: "task_id",    // field in requests
      foreignField: "_id",      // field in tasks
      as: "task"
    }
  },
  { $unwind: "$task" },         // flatten the joined task array
  { $match: { "task.user_id": userId } },  // only tasks created by this user
  {
    $project: {                 // keep only request schema fields
      _id: 1,
      task_id: 1,
      requester_id: 1,
      status: 1
    }
  }
]);
res.json(requests);
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
});



router.post("/addrequest",auth,async(req,res)=>{
    try{
        const userId=req.user.id; 
        const {taskId,description}=req.body;
        const newRequest=new request({
            task:taskId,
            requester:userId,
            description,
            status:"pending"
        });
        await newRequest.save();
        res.json(newRequest);
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }
});


module.exports=router;