import React, { useEffect, useState } from "react";
import TodoHeader from "./TodoHeader";
import axios from "axios";
import TaskList from "./TaskList";

const TodoPage = () => {
  const [stats, setStats] = useState({
    totalProblems: 0,
    solvedProblems: 0,
    pendingProblems: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });


  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <TodoHeader stats={stats} />
      <TaskList stats={stats} setStats={setStats}/>

      {/* Todo list component goes here */}
    </div>
  );
};

export default TodoPage;
