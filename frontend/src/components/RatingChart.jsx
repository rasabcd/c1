import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const RatingChart = ({ handle }) => {
  const [ratingData, setRatingData] = useState([]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await axios.get(
          `https://codeforces.com/api/user.rating?handle=${handle}`
        );
        const formatted = res.data.result.map((entry) => ({
          name: entry.contestName,
          rating: entry.newRating,
          date: new Date(entry.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
        }));
        setRatingData(formatted);
      } catch (error) {
        console.error("Error fetching rating history", error);
      }
    };

    fetchRating();
  }, [handle]);

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white/70 backdrop-blur-md border border-white/30 max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        📈 Codeforces Rating Progress
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={ratingData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#475569" }}
            angle={-30}
            textAnchor="end"
            height={60}
          />
          <YAxis
            domain={["dataMin - 100", "dataMax + 100"]}
            tick={{ fontSize: 12, fill: "#475569" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#f8fafc", borderRadius: "10px", border: "none" }}
            labelStyle={{ color: "#334155", fontWeight: "bold" }}
            itemStyle={{ color: "#1e40af" }}
          />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="url(#colorGradient)"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 1, stroke: "#6366f1", fill: "#a5b4fc" }}
            activeDot={{ r: 6, stroke: "#1e3a8a", strokeWidth: 2, fill: "#ffffff" }}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingChart;
