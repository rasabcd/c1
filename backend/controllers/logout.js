const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", " ", { maxAge: 0, httpOnly: true, sameSite: "strict" })
      .json({
        message: "User logged out successfully",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export default logout;
