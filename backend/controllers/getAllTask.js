    import Task from "../Models/taskModel.js";

    const getAllTasks = async (req, res) => {
    try {
        const userId = req.id; // Set by auth middleware

        // Fetch tasks and populate the problems field
        const tasks = await Task.find({ user: userId })
        .populate({
            path: "problems",
            match: { user: userId }, // Ensure only problems that belong to this user
        })
        .lean();

        res.status(200).json(tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
    };

    export default getAllTasks;
