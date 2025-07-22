import Task from "../Models/taskModel.js";
import Problem from "../Models/problemModel.js";
export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Delete all problems associated with this task
    await Problem.deleteMany({ task: taskId });

    // Delete the task itself
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: "Task and its problems deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
