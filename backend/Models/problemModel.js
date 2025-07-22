import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  contestId: { type: Number, required: true },
  index: { type: String, required: true }, // e.g., "A", "B", etc.
  name: { type: String, required: true },
  link: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "solved"],
    default: "pending",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: false, // If problem belongs to a task
  },
}, { timestamps: true });

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
