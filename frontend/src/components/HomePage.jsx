import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import CodeforcesProfileCard from "./CodeforcesProfileCard";
import Text from "./Text";
import RatingChart from "./RatingChart";
import axios from "axios";

const HomePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/profile", {
          withCredentials: true,
        });
        setProfile(res.data);
        localStorage.setItem("codeforcesHandle", res.data.codeforcesHandle);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };

    fetchProfile();
  }, []);

  const codeforcesHandle = localStorage.getItem("codeforcesHandle");

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-100 to-violet-200 text-gray-800">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Introduction Text */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-md p-6 border border-white/30">
          <Text profile={profile} />
        </div>

        {/* Codeforces Profile Card */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-md p-6 border border-white/30">
          <CodeforcesProfileCard profile={profile} />
        </div>

        {/* Rating Chart */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md p-6 border border-white/30">
          <RatingChart handle={codeforcesHandle} />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
