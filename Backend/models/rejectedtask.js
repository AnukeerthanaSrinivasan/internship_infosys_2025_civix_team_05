const mongoose=require("mongoose");
const request = require("./request");

const Rejectedtaskschema=new mongoose.Schema({
    taskId:{type:mongoose.Schema.Types.ObjectId,ref:"Task"},
    rejecter:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    requester:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    status:{type:String,default:"accepted"},
    description:String
});

module.exports=mongoose.model("RejectedTask",Rejectedtaskschema);