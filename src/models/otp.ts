import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    otp: {
      type: String,
      required: true, // store HASHED otp
    },

    expiresAt: {
      type: Date,
      required: true,
      //   index: { expires: 0 }, // TTL index
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Otp", otpSchema);
