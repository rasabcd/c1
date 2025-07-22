import React from "react";

const TodoHeader = ({ stats }) => {
  const {
    totalProblems,
    solvedProblems,
    pendingProblems,
    totalTasks,
    completedTasks,
    pendingTasks,
  } = stats;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        📋 My To-Do List
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm text-gray-600">Total Problems</p>
          <p className="text-xl font-semibold text-blue-700">{totalProblems}</p>
        </div>
        <div className="bg-green-50 p-4 rounded">
          <p className="text-sm text-gray-600">Solved</p>
          <p className="text-xl font-semibold text-green-600">{solvedProblems}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-xl font-semibold text-yellow-600">{pendingProblems}</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded">
          <p className="text-sm text-gray-600">Total Tasks</p>
          <p className="text-xl font-semibold text-indigo-700">{totalTasks}</p>
        </div>
        <div className="bg-teal-50 p-4 rounded">
          <p className="text-sm text-gray-600">Completed Tasks</p>
          <p className="text-xl font-semibold text-teal-700">{completedTasks}</p>
        </div>
        <div className="bg-red-50 p-4 rounded">
          <p className="text-sm text-gray-600">Pending Tasks</p>
          <p className="text-xl font-semibold text-red-600">{pendingTasks}</p>
        </div>
      </div>
    </div>
  );
};

export default TodoHeader;
