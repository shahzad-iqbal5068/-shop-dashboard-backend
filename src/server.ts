import express from "express";
import { connectDB } from "./db";
import { Permission } from "./types/permisisons";
import User from "./models/User";
import * as bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.post("/api/register", async (req, res) => {
  console.log(req.body);
  res.send("user register succesfully ");
});
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: "invalid Credentials" });
  }
  const Match = await bcrypt.compare(password, user.password);
  if (!Match) {
    res.status(401).json({ message: "invalid Credentials" });
  }

  res.send({ "user is ": user });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
startServer();
