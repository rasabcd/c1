import User from "../Models/userModel.js";
import axios from "axios";

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const codeforcesHandle = user.codeforcesHandle;

    const cfRes = await axios.get(
      `https://codeforces.com/api/user.info?handles=${codeforcesHandle}`
    );

    const cfData = cfRes.data.result[0];
     console.log(user.codeforcesHandle);
    res.json({
      username: user.username,
      fullName: user.fullName,
      codeforcesHandle: user.codeforcesHandle,
      avatar: cfData.avatar,
      rating: cfData.rating,
      rank: cfData.rank,
      maxRating: cfData.maxRating,
      maxRank: cfData.maxRank,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
export default getUserProfile;
