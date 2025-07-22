import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const ProblemList = ({ problems }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [existingTasks, setExistingTasks] = useState([]);

  const openModal = async (problem) => {
    setSelectedProblem(problem);
    setShowModal(true);
    setNewTask("");

    try {
      const res = await axios.get("http://localhost:8000/api/tasks", {
        withCredentials: true,
      });
      setExistingTasks(res.data || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to load tasks");
    }
  };

  const handleAdd = async () => {
    if (!newTask.trim()) {
      toast.error("Please enter or select a task name.");
      return;
    }

    try {
      let taskId;

      // 1. Check if task with same name already exists
      const existingTask = existingTasks.find(
        (task) => task.name.toLowerCase() === newTask.trim().toLowerCase()
      );

      if (existingTask) {
        taskId = existingTask._id;
      } else {
        // 2. Create new task
        const taskResponse = await axios.post(
          "http://localhost:8000/api/create",
          {
            name: newTask.trim(),
          },
          { withCredentials: true }
        );

        taskId = taskResponse.data.task._id;

        // Add new task to list
        setExistingTasks((prev) => [...prev, taskResponse.data.task]);

        toast.success("New task created successfully");
      }

      // 3. Add problem to that task
      await axios.post(
        "http://localhost:8000/api/addProblem",
        {
          contestId: selectedProblem.contestId,
          index: selectedProblem.index,
          name: selectedProblem.name,
          link: `https://codeforces.com/problemset/problem/${selectedProblem.contestId}/${selectedProblem.index}`,
          taskId,
        },
        { withCredentials: true }
      );

      toast.success("Problem added to task successfully!");
      setShowModal(false);
      setNewTask("");
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      toast.error(`Failed: ${message}`);
      console.error("Error adding problem:", message);
    }
  };


  return (
    <div className="p-4 w-full max-w-7xl mx-auto grid gap-4">
      {problems.map((problem, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow p-6 flex justify-between items-center border border-gray-200 min-h-[100px] w-full"
        >
          <div className="w-[80%] overflow-hidden">
            <a
              href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline text-lg break-words"
            >
              {problem.name}
            </a>
            <p className="text-sm text-gray-700 mt-1 break-words">
              Rating: {problem.rating || "Unrated"} | Tags:{" "}
              {problem.tags.join(", ")}
            </p>
          </div>
          <button
            onClick={() => openModal(problem)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add to To-Do
          </button>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white text-black p-8 rounded-2xl w-full max-w-md shadow-2xl space-y-6 relative border border-gray-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl transition"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-center">
              Add Problem to Task
            </h2>

            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter new task name..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            />

            <div className="text-center text-sm text-gray-600">
              or choose existing task
            </div>

            <select
              onChange={(e) => setNewTask(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            >
              <option value="">-- Select Task --</option>
              {existingTasks.map((task, idx) => (
                <option key={idx} value={task.name}>
                  {task.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAdd}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-md"
            >
              ➕ Add Problem
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemList;
