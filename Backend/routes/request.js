
const express=require("express");
const auth=require("../middleware/authMiddleware");
const request=require("../models/request");
const task=require("../models/task");
const router = express.Router();

router.get("/requests", auth, async (req, res) => {
    try {
      const userid=req.user.id;
      const tasks=await task.find({userId:userid});
      const taskIds=tasks.map(t=>t._id);
      const requests = await request.find({ task: { $in: taskIds } });
      res.json(requests);
    } catch (err) {
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