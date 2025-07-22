import React from "react";
import Register from "./components/register.jsx";
import HomePage from "./components/HomePage.jsx";
import Login from "./components/login.jsx";
import ProblemSelection from "./components/ProblemSelection.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TodoPage from "./components/TodoPage.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Home",
    element: <HomePage />,
  },
   {
    path: "/ProblemSelection",
    element: <ProblemSelection />,
  },
   {
    path: "/TodoPage",
    element: <TodoPage />,
  },
]);
const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
