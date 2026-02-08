import { RegisterUser } from "./../types/user";
import express from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import Otp from "../models/otp";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../utils/sendOtp";
import { hashValue, compareHashValue } from "../utils/bcryptHelper";
// Login Controller
const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your account before login",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    const match = await compareHashValue(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        permissions: user.permissions,
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "15m" },
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout Controller
const logout = (req: express.Request, res: express.Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logout successful" });
};
//Register Controller
const RegisterUser = async (req: express.Request, res: express.Response) => {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    //create user with default role and empty permissions
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role: "salesperson", // DEFAULT ROLE
      permissions: [], // EMPTY PERMISSIONS
      isVerified: false,
    });

    // Remove old OTP if exists
    await Otp.deleteMany({ userId: newUser._id });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await hashValue(otp);
    // Save OTP to DB
    await Otp.create({
      userId: newUser._id,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    // Send OTP email
    await sendOtpEmail(email, otp);

    return res.status(201).json({
      message: "Registration successful. OTP sent to email",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifyOtp = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { email, otp } = req.body;
    // console.log(email, otp);

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User found:", user);
    // 2. Find OTP
    const otpRecord = await Otp.findOne({ userId: user._id });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    // 3. Check expiry
    if (otpRecord.expiresAt < new Date()) {
      await otpRecord.deleteOne();
      return res.status(400).json({ message: "OTP expired" });
    }

    // 4. Compare OTP
    const isOtpValid = await compareHashValue(otp, otpRecord.otp);

    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 5. Verify user
    user.isVerified = true;
    await user.save();

    // 6. Delete OTP
    await otpRecord.deleteOne();

    return res.json({ message: "Account verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default { login, logout, RegisterUser, verifyOtp };
