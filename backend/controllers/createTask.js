import Task from "../Models/taskModel.js";

const createTask = async (req, res) => {
  try {
    const userId = req.id; // set by auth middleware
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Task name is required" });
    }

    const newTask = new Task({
      name,
      user: userId,
      problems: [], // empty initially
    });

    const savedTask = await newTask.save();

    res.status(201).json({ task: savedTask });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
};

export default createTask;
