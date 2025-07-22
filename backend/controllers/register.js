import User from "../Models/userModel.js";
import Verification from "../Models/verificationModel.js";
import axios from "axios";
const register = async (req, res) => {
  try {
    const { codeforcesHandle } = req.body;
    const verifiedUser = await Verification.findOne({ codeforcesHandle });
    if (!verifiedUser) {
      return res.status(400).json({ message: "No verified user found" });
    }
    const cfResponse = await axios.get(
      `https://codeforces.com/api/user.info?handles=${codeforcesHandle}`
    );

    const userInfo = cfResponse.data.result[0];
    const firstName = userInfo.firstName;
    
    
    if (firstName === verifiedUser.code) {
      await User.create({
        username: verifiedUser.username,
        handle: verifiedUser.codeforcesHandle,
        password: verifiedUser.password,
        fullName: verifiedUser.fullName,
        codeforcesHandle: verifiedUser.codeforcesHandle,
      });
      await Verification.deleteOne({ codeforcesHandle });
      return res.status(201).json({ message: "Success" });
    } else {
      return res
        .status(400)
        .json({ message: "First name does not match the code" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ message: "Failed to fetch from Codeforces" });
  }
};
export default register;
