// models/taskModel.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
  deadline: { type: Date }, // ✅ Add this line to store deadline
});

export default mongoose.model("Task", taskSchema);
