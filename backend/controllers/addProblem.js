import Problem from "../Models/problemModel.js";
import Task from "../Models/taskModel.js"; // <-- needed for task update

const addProblem = async (req, res) => {
  try {
    const { contestId, index, name, link, taskId } = req.body;

    if (!contestId || !index || !name || !link) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Create and save the new problem
    const newProblem = new Problem({
      contestId,
      index,
      name,
      link,
      user: req.id, // from auth middleware
      task: taskId || null,
    });

    const savedProblem = await newProblem.save();

    // If taskId is provided, push the problem to that task
    if (taskId) {
      const task = await Task.findById(taskId);

      if (!task) {
        return res.status(404).json({ message: "Task not found." });
      }

      // Check ownership
      if (String(task.user) !== String(req.id)) {
        return res.status(403).json({ message: "Unauthorized access to task." });
      }

      // Push problem ID to task.problems array
      task.problems.push(savedProblem._id);
      await task.save();
    }

    res.status(201).json({
      message: "Problem added successfully.",
      problem: savedProblem,
    });

  } catch (error) {
    console.error("Error adding problem:", error.message);
    res.status(500).json({ message: "Server error while adding problem." });
  }
};

export default addProblem;
