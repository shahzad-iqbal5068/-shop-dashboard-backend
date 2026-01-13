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

// here this api is creating for superadmin now i cannot uncommented

// app.post("/api/seed-admin", async (req, res) => {
//   const exists = await User.findOne({ role: "superadmin" });
//   if (exists) {
//     return res.status(400).json({ message: "Super Admin already exists" });
//   }

//   const superAdmin = await User.create({
//     fullname: "shahzad iqbal",
//     email: "choudhuryshahzad5068@gmail.com",
//     password: await bcrypt.hash("shahzad5068@", 10),
//     role: "superadmin",
//     permissions: Object.values(Permission),
//   });

//   res.json({ message: "Super Admin created", superAdmin });
// });
