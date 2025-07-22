import React from "react";
import { FaBolt, FaStar } from "react-icons/fa";

const CodeforcesProfileCard = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="w-full min-h-[20vh] bg-white border-t border-purple-200 shadow-md flex justify-center items-center">
      <div className="w-full max-w-6xl px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-6">
        
        {/* Avatar and Name */}
        <div className="flex items-center gap-6">
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full border-4 border-purple-600 shadow-md"
          />
          <div>
            <h2 className="text-2xl font-bold text-purple-800">
              {profile.fullName}
            </h2>
            <p className="text-gray-600 text-sm">
              @{profile.username}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium text-purple-700">Handle:</span> {profile.codeforcesHandle}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="text-center">
            <p className="text-sm text-gray-500">Current Rating</p>
            <p className="text-xl font-semibold text-purple-700 flex items-center justify-center gap-2">
              <FaBolt className="text-yellow-500" />
              {profile.rating} <span className="text-sm text-gray-600">({profile.rank})</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Max Rating</p>
            <p className="text-xl font-semibold text-purple-700 flex items-center justify-center gap-2">
              <FaStar className="text-purple-400" />
              {profile.maxRating} <span className="text-sm text-gray-600">({profile.maxRank})</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeforcesProfileCard;
