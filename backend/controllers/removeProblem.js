// controllers/taskController.js
import Problem from "../Models/problemModel.js";
import Task from "../Models/taskModel.js";

export const removeProblemFromTask = async (req, res) => {
  const { taskId } = req.params;
  const { problemId } = req.body;

  if (!problemId) {
    return res.status(400).json({ message: "Problem ID is required" });
  }

  try {
    // Remove problem from task's list
    const task = await Task.findByIdAndUpdate(
      taskId,
      { $pull: { problems: problemId } },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Delete the problem document itself
    await Problem.findByIdAndDelete(problemId);

    res.status(200).json({ message: "Problem removed from task and deleted", task });
  } catch (error) {
    console.error("Error removing problem:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
