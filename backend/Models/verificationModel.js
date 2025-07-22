import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    codeforcesHandle: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // TTL: delete this document after 600s (10 minutes)
    },
  },
  {
    timestamps: true,
  }
);
const Verification = mongoose.model("Verification", verificationSchema);
export default Verification;
