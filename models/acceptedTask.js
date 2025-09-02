const mongoose=require("mongoose");

const AcceptedTaskSchema=new mongoose.Schema({
    taskId:{type:mongoose.Schema.Types.ObjectId,ref:"Task"},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    status:{type:String,default:"accepted"},
    description:String
});

module.exports=mongoose.model("AcceptedTask",AcceptedTaskSchema);