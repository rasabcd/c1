import React, { useState } from "react";
import { Code, Filter, Hash, Search, Target, Trophy, Zap } from "lucide-react";
import axios from "axios";
import ProblemList from "./ProblemList";

const tags = [
  "implementation",
  "dp",
  "math",
  "greedy",
  "brute force",
  "data structures",
  "constructive algorithms",
  "graphs",
  "sortings",
  "binary search",
  "dfs and similar",
  "trees",
  "number theory",
  "combinatorics",
  "two pointers",
  "bitmasks",
  "dsu",
  "geometry",
  "strings",
  "hashing",
];

const contestTypes = [
  "All Codeforces Contests",
  "Div. 1",
  "Div. 2",
  "Div. 3",
  "Div. 4",
  "Div. 1 + Div. 2",
  "Educational",
  "CodeTON",
  "Global",
];

const problemSlots = ["A", "B", "C", "D", "E", "F", "G", "H"];

const ProblemSelection = () => {
  const [contestType, setContestType] = useState("All Codeforces Contests");
  const [ratingFrom, setRatingFrom] = useState(800);
  const [ratingTo, setRatingTo] = useState(3500);
  const [tag, setTag] = useState("");
  const [slot, setSlot] = useState("");
  const [showProblems, setShowProblems] = useState(false);
  const codeforcesHandle = localStorage.getItem("codeforcesHandle");
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getContestInfoCached = async (contestId) => {
    const key = `contestInfo_${contestId}`;
    const cached = localStorage.getItem(key);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      // 1 day = 24 * 60 * 60 * 1000 ms = 86,400,000 ms
      if (now - timestamp < 24 * 60 * 60 * 1000) {
        return data;
      }

      // If cache is older than 1 day, remove it
      localStorage.removeItem(key);
    }

    const response = await axios.get(
      `https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=1`
    );

    if (response.data.status === "OK") {
      const cacheData = {
        data: response.data.result,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
      return response.data.result;
    }

    throw new Error("Failed to fetch contest info");
  };

  const handleFetch = async () => {
    setIsLoading(true);
    try {
      const submissionsRes = await axios.get(
        `https://codeforces.com/api/user.status?handle=${codeforcesHandle}`
      );
      const submissions = submissionsRes.data.result;

      const solvedSet = new Set();
      const attemptedContests = new Set();

      submissions.forEach((sub) => {
        if (
          sub.author.participantType === "CONTESTANT" &&
          sub.problem.contestId
        ) {
          attemptedContests.add(sub.problem.contestId);
          if (sub.verdict === "OK") {
            solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
          }
        }
      });

      const newfilteredProblems = [];

      for (const contestId of attemptedContests) {
        const ContestInfo = await getContestInfoCached(contestId);
        const contestName = ContestInfo.contest.name;

        if (
          contestType === "All Codeforces Contests" ||
          contestName.includes(contestType)
        ) {
          for (const problem of ContestInfo.problems) {
            const rating = problem.rating;
            const problemSlot = problem.index;
            const problemKey = `${contestId}-${problemSlot}`;

            if (solvedSet.has(problemKey)) continue;
            if (rating < ratingFrom || rating > ratingTo) continue;
            if (slot && !problemSlot.includes(slot)) continue;
            if (tag && tag !== "All Tags" && !problem.tags.includes(tag))
              continue;

            newfilteredProblems.push({
              name: problem.name,
              contestId,
              index: problem.index,
              rating,
              tags: problem.tags,
            });
          }
        }
      }

      setFilteredProblems(newfilteredProblems);
      setShowProblems(true);
    } catch (error) {
      console.log("Error fetching problems:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="w-full bg-white sticky top-0 z-20 border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Upsolve as your wish 🚀
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Filter Problems
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Trophy className="w-4 h-4 text-indigo-600" />
                <span>Contest Type</span>
              </label>
              <select
                value={contestType}
                onChange={(e) => setContestType(e.target.value)}
                className="w-full text-black bg-white border border-gray-300 rounded-xl px-4 py-3"
              >
                {contestTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Zap className="w-4 h-4 text-green-600" />
                <span>Min Rating</span>
              </label>
              <input
                type="number"
                min="800"
                max="3500"
                step="100"
                value={ratingFrom}
                onChange={(e) => setRatingFrom(Number(e.target.value))}
                className="w-full text-black bg-white border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Target className="w-4 h-4 text-red-600" />
                <span>Max Rating</span>
              </label>
              <input
                type="number"
                min="800"
                max="3500"
                step="100"
                value={ratingTo}
                onChange={(e) => setRatingTo(Number(e.target.value))}
                className="w-full text-black bg-white border border-gray-300 rounded-xl px-4 py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Hash className="w-4 h-4 text-purple-600" />
                <span>Tags</span>
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full text-black bg-white border border-gray-300 rounded-xl px-4 py-3"
              >
                <option value="">All Tags</option>
                {tags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Search className="w-4 h-4 text-orange-600" />
                <span>Problem Slot</span>
              </label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="w-full text-black bg-white border border-gray-300 rounded-xl px-4 py-3"
              >
                <option value="">Any Slot</option>
                {problemSlots.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-600 font-medium">
                  Fetching problems...
                </span>
              </div>
            ) : (
              <button
                onClick={handleFetch}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Fetch Problems
              </button>
            )}
          </div>
        </section>
      </main>

      {showProblems && <ProblemList problems={filteredProblems} />}
    </div>
  );
};

export default ProblemSelection;
