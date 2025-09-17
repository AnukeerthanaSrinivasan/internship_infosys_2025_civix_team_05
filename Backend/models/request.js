const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  description:String
}, { timestamps: true });

module.exports = mongoose.model("Request", RequestSchema);
