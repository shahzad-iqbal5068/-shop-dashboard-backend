import User from "./models/User";
import express from "express";
import { connectDB } from "./db";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { verifyToken } from "./middlewares/authMiddlware";
import authRoutes from "./routes/authRoutes";

// load then env variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 5000;

app.use("/api/auth", authRoutes);
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Server is running");
});

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start", error);
  }
};

startServer();
