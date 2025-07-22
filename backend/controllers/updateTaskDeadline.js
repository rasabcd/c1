// controllers/updateTaskDeadline.js
import Task from "../Models/taskModel.js";

export const updateTaskDeadline = async (req, res) => {
  const { taskId } = req.params;
  const { deadline } = req.body;

  if (!deadline) {
    return res.status(400).json({ message: "Deadline is required" });
  }

  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { deadline },
      { new: true }
    ).populate("problems"); // ✅ <-- this ensures problem names etc. are included

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Deadline updated successfully", task });
  } catch (error) {
    console.error("Error updating deadline:", error);
    res.status(500).json({ message: "Server error" });
  }
};
