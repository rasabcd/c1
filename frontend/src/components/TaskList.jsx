import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircle,
  Circle,
  Trash2,
  CheckCheck,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";

const TaskList = ({ stats, setStats }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solvedProblems, setSolvedProblems] = useState({});
  const [editingDeadline, setEditingDeadline] = useState(null);
  const [newDeadline, setNewDeadline] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const totalTasks = tasks.length;
    const totalProblems = tasks.reduce(
      (acc, task) => acc + (task.problems?.length || 0),
      0
    );

    const solvedCount = Object.entries(solvedProblems).filter(
      ([_, solved]) => solved
    ).length;

    const completedTasks = tasks.filter(
      (task) =>
        task.problems?.length > 0 &&
        task.problems.every((p) => solvedProblems[p._id?.toString()])
    ).length;

    const pendingTasks = totalTasks - completedTasks;
    const pendingProblems = totalProblems - solvedCount;

    setStats({
      totalProblems,
      solvedProblems: solvedCount,
      pendingProblems,
      totalTasks,
      completedTasks,
      pendingTasks,
    });
  }, [solvedProblems, tasks]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/tasks", {
        withCredentials: true,
      });
      setTasks(Array.isArray(res.data) ? res.data : []);
      const stored = JSON.parse(localStorage.getItem("solvedProblems")) || {};
      setSolvedProblems(stored);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSolved = (problemId) => {
    const id = problemId.toString();
    const updated = {
      ...solvedProblems,
      [id]: !solvedProblems[id],
    };
    setSolvedProblems(updated);
    localStorage.setItem("solvedProblems", JSON.stringify(updated));
  };

  const markTaskCompleted = (task) => {
    const updated = { ...solvedProblems };
    task.problems?.forEach((p) => (updated[p._id?.toString()] = true));
    setSolvedProblems(updated);
    localStorage.setItem("solvedProblems", JSON.stringify(updated));
    toast.success("Marked all problems as solved");
  };

  const deleteTask = async (taskId) => {
    try {
      const taskToDelete = tasks.find((t) => t._id === taskId);
      const problemIdsToRemove =
        taskToDelete?.problems?.map((p) => p._id?.toString()) || [];

      await axios.delete(`http://localhost:8000/api/tasks/${taskId}`, {
        withCredentials: true,
      });

      setSolvedProblems((prev) => {
        const updated = { ...prev };
        problemIdsToRemove.forEach((id) => delete updated[id]);
        localStorage.setItem("solvedProblems", JSON.stringify(updated));
        return updated;
      });

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

 const deleteProblem = async (taskId, problemId) => {
  try {
    const res = await axios.patch(
      `http://localhost:8000/api/tasks/${taskId}/remove-problem`,
      { problemId },
      { withCredentials: true }
    );

    // ✅ Update tasks list
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, problems: res.data.problems } : task
      )
    );

    // ✅ Remove from solvedProblems if it exists
    setSolvedProblems((prev) => {
      const updated = { ...prev };
      if (updated[problemId]) {
        delete updated[problemId];
        localStorage.setItem("solvedProblems", JSON.stringify(updated));
      }
      return updated;
    });

    toast.success("Problem removed");
  } catch (err) {
    console.error(err.response?.data || err.message);
    toast.error("Failed to remove problem");
  }
};

  const updateDeadline = async (taskId) => {
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/tasks/${taskId}/deadline`,
        { deadline: newDeadline },
        { withCredentials: true }
      );

      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? res.data.task : task))
      );

      toast.success("Deadline updated");
    } catch (err) {
      toast.error("Failed to update deadline");
    } finally {
      setEditingDeadline(null);
      setNewDeadline("");
    }
  };

  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        📋 Your Tasks
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks available.</p>
      ) : (
        <div className="space-y-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {task.name}
                  </h2>
                  {task.deadline && (
                    <p
                      className={`text-sm mt-1 ${
                        new Date(task.deadline) < new Date()
                          ? "text-red-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      ⏰{" "}
                      {new Date(task.deadline).toLocaleString(undefined, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                      {new Date(task.deadline) < new Date() && (
                        <span className="ml-2 font-semibold">(Overdue)</span>
                      )}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => markTaskCompleted(task)}
                    className="text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <CheckCheck size={16} />
                    Complete
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-700 bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>

              {/* Deadline Input */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays size={16} />
                {editingDeadline === task._id ? (
                  <>
                    <input
                      type="datetime-local"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="border px-2 py-1 rounded text-sm"
                    />
                    <button
                      onClick={() => updateDeadline(task._id)}
                      className="text-blue-600 hover:underline"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setEditingDeadline(null);
                        setNewDeadline("");
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingDeadline(task._id);
                      setNewDeadline(
                        task.deadline
                          ? new Date(task.deadline).toISOString().slice(0, 16)
                          : ""
                      );
                    }}
                    className="underline hover:text-blue-600"
                  >
                    {task.deadline ? "Edit Deadline" : "Set Deadline"}
                  </button>
                )}
              </div>

              {/* Problem List */}
              {!task.problems || task.problems.length === 0 ? (
                <p className="italic text-gray-500">No problems added.</p>
              ) : (
                <ul className="space-y-3">
                  {task.problems.map((problem) => {
                    const id = problem._id?.toString();
                    return (
                      <li
                        key={id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
                      >
                        <label className="flex items-center gap-3 w-full cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!solvedProblems[id]}
                            onChange={() => toggleSolved(id)}
                            className="accent-green-500 w-5 h-5"
                          />
                          <a
                            href={problem.link}
                            target="_blank"
                            rel="noreferrer"
                            className={`text-sm font-medium ${
                              solvedProblems[id]
                                ? "line-through text-green-600"
                                : "text-blue-700"
                            }`}
                          >
                            {problem.name}
                            {problem.rating && (
                              <span className="ml-2 text-xs text-gray-400">
                                ({problem.rating})
                              </span>
                            )}
                          </a>
                        </label>

                        <div className="flex gap-2 items-center">
                          {solvedProblems[id] ? (
                            <CheckCircle
                              size={18}
                              className="text-green-500"
                            />
                          ) : (
                            <Circle size={18} className="text-gray-400" />
                          )}
                          <button
                            onClick={() =>
                              deleteProblem(task._id, problem._id)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
