const express = require("express");
const AcceptedTask = require("../models/acceptedTask");
const auth=require("../middleware/authMiddleware");
const request=require("../models/request");

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



router.get("/myrequesttasks",auth,async(req,res)=>
{
    try{
        const userId=req.user.id;
        const myRequests=await AcceptedTask.find({userId});
        const tasks=await request.find({requester:userId});
        const results={...myRequests,...tasks}; 
        res.json(results);     
    }       
    catch(err)
    {
        res.status(500).json(err.message);
    }   
}
);



module.exports = router;