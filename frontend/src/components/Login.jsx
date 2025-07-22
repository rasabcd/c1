import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const submitHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/login`, form, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(res);
      if (res.status === 200) {
        setForm({
          username: "",
          password: "",
        });
        navigate("/Home");
        toast.success("login successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };
  return (
    <div className="min-w-96 mx-auto min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        {/* Username */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a username"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="********"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={submitHandler}
          className="w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
        <p className="mt-4 text-sm text-center text-black">
          Don't have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
