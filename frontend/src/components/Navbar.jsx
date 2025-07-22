import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";    
import axios from "axios";
const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        { withCredentials: true }
      ); // clear cookie
      toast.success("logout successfully");
      navigate("/login"); // redirect to login
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Logout failed", error);
    }
  };
  return (
    <nav className="bg-white text-purple-700 px-8 py-5 shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / App Name */}
        <div className="text-2xl font-extrabold text-purple-800 tracking-wide">
          Codeforces Upsolver
        </div>

        {/* Menu Items */}
        <div className="space-x-8 text-base font-semibold">
          <Link to="/TodoPage" className="hover:text-purple-500 transition-colors">
            📝 To-Do List
          </Link>
          <Link
            to="/ProblemSelection"
            className="hover:text-purple-500 transition-colors"
          >
            🎯 Problem Selection
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-purple-500 transition-colors"
          >
            🔒 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
