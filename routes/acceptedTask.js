const express = require("express");
const AcceptedTask = require("../models/acceptedTask");
const auth=require("../middleware/authMiddleware");

const router = express.Router();

router.post("/accept",auth,async(req,res)=>
{
    try{
        const userId=req.user.id;
        const {taskId,description}=req.body;
        const newAcceptedTask=new AcceptedTask({
            taskId,userId,description,status:"pending"
        });
        await newAcceptedTask.save();
        res.json(newAcceptedTask); 
    }
    catch(err)
    {
        res.status(500).json(err.message);
    }   
});



router.get("/myacceptedtasks",auth,async(req,res)=>
{
    try{        
        const acceptedTasks=await AcceptedTask.find({
            userId:req.user.id
        }).populate("userId");
        res.json(acceptedTasks);
    }       
    catch(err)
    {
        res.status(500).json(err.message);
    }   
}
);



module.exports = router;