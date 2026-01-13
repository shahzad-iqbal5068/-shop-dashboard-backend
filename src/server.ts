import express from "express";
import { connectDB } from "./db";
import { Permission } from "./types/permisisons";
import User from "./models/User";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { verifyToken } from "./middlewares/authmiddlware";
import authRoutes from "./routes/authRoutes";

// load then env variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 5000;

app.use("/api", authRoutes);
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Server is running");
});
app.post(
  "/api/register",
  async (req: express.Request, res: express.Response) => {
    // console.log(req.body);
    res.send("user register succesfully ");
  }
);

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
