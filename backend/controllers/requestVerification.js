import User from "../Models/userModel.js";
import Verification from "../Models/verificationModel.js";
import bcrypt from "bcryptjs";
import axios from "axios";
const requestVerification = async (req, res) => {
  try {
    const { fullName, username, codeforcesHandle, password, confirmPassword } =
      req.body;

    if (
      !fullName ||
      !username ||
      !codeforcesHandle ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { codeforcesHandle }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Codeforces handle already registered" });
    }
    const cfResponse = await axios.get(
      `https://codeforces.com/api/user.info?handles=${codeforcesHandle}`
    );
    const status = cfResponse.data.status;
    if (status !== "OK") {
      return res
        .status(400)
        .json({ message: "No user with this codeoforces handle" });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password do not match" });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    await Verification.findOneAndUpdate(
      { codeforcesHandle },
      { fullName, username, codeforcesHandle, password: hashedPassword, code },
      { upsert: true, new: true }
    );
    return res.json({ code });
  } catch (error) {
    console.error("Verification error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export default requestVerification;
