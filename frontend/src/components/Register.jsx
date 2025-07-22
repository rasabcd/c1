import React from "react";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    codeforcesHandle: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [timer, setTimer] = useState(60);
  const [startCountdown, setStartCountdown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    let interval;
    if (startCountdown && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setConfirmed(true);
    }
    return () => clearInterval(interval);
  }, [startCountdown, timer]);

  useEffect(() => {
    if (showModal) {
      setIsChecked(false); // reset checkbox
      setStartCountdown(false); // reset countdown
      setTimer(60); // reset timer
      setConfirmed(false); // reset confirmation
    }
  }, [showModal]);
  const handleNext = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/requestVerification`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const code = res.data.code;
      if (code) {
        setVerificationCode(code);
        setShowModal(true);
      } else {
        toast.error("Problem in generating the code");
      }
      console.log(code);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };
  const handleRegister = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/register`,
        { codeforcesHandle: form.codeforcesHandle },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res);
      if (res.data.message == "Success") {
        setShowModal(false);
        toast.success("Registration successful! You can now log in.");
        setForm({
          fullName: "",
          username: "",
          codeforcesHandle: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        toast.error(res.data.message || "Registration failed.");
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
          Register
        </h2>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
          />
        </div>

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

        {/* Codeforces Handle */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Codeforces Handle
          </label>
          <input
            value={form.codeforcesHandle}
            onChange={(e) =>
              setForm({ ...form, codeforcesHandle: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., tourist"
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

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-600 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="********"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
        <p className="mt-4 text-sm text-center text-black">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-4">
            {/* Step instructions */}
            <div className="mb-4 bg-blue-50 p-3 rounded text-center">
              <strong>Step 2:</strong> Set your Codeforces first name to:{" "}
              <span className="text-blue-700 font-bold text-xl sm:text-2xl">
                {verificationCode}
              </span>
            </div>

            {/* Confirmation checkbox */}
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                defaultChecked={false}
                checked={isChecked}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsChecked(checked);
                  if (checked) {
                    setStartCountdown(true);
                  } else {
                    setStartCountdown(false);
                    setTimer(60);
                    setConfirmed(false);
                  }
                }}
                className="mr-2 accent-blue-600"
              />
              I have set my full name on Codeforces
            </label>
            {/* Timer (only appears after checkbox click) */}
            {startCountdown && timer > 0 && (
              <p className="text-sm text-gray-600 text-center mb-4">
                Please wait for {timer} second{timer !== 1 ? "s" : ""}...
              </p>
            )}

            {/* Register button */}
            <button
              onClick={handleRegister}
              disabled={!confirmed || timer > 0}
              className={`w-full py-2 rounded transition font-semibold ${
                confirmed
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              aria-label="Register with Codeforces handle verification"
            >
              Register
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Register;
