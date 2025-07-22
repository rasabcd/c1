import Problem from "../Models/problemModel.js";

const getProblemsByTask = async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  try {
    const problems = await Problem.find({
      user: req.id,         // Ensures problems belong to the logged-in user
      task: taskId          // Filters only problems under the given task
    }).sort({ createdAt: -1 });

    res.status(200).json({ problems });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ error: "Error fetching problems for this task" });
  }
};

export default getProblemsByTask;
