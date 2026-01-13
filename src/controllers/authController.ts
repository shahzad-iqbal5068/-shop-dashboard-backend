import express from "express";
import User from "../models/User";
// import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { comparePassword } from "../utils/bcryptHelper";

// Login Controller
export const login = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "invalid Credentials" });
  }
  const Match = await comparePassword(password, user.password);
  if (!Match) {
    return res.status(401).json({ message: "invalid Credentials" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      permissions: user.permissions,
    },
    process.env.JWT_SECRET_KEY as string,
    { expiresIn: "1h" }
  );

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.json({
    message: "Login successful",
    user: { id: user._id, fullname: user.fullname, role: user.role },
  });
};

// Logout Controller
export const logout = (req: express.Request, res: express.Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logout successful" });
};
