import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userRouter = express.Router();
const secretkey = process.env.SECRET_KEY;
userRouter.get("/", function (req, res) {
  res.send("Welcome");
});

userRouter.post("/register", async function (req, res) {
  let data = req.body;
  try {
    if (!req.body.email || !req.body.password || !req.body.name || !req.body.lastname) {
      res.status(200).json({ message: "All fields are required" });
      return;
    }
    const result = await User.findOne({ email: req.body.email });
    if (result) res.status(200).json({ message: "Email already exists" });
    let salt = bcrypt.genSaltSync(10);
    let hash = await bcrypt.hash(data.password, salt);
    data.password = hash;
    const newUser = await User.create(data);
    const token = jwt.sign({ user_id: newUser._id, email: newUser.email }, secretkey);
    res.status(200).json({ message: newUser, token });
  } catch (error) {
    res.status(200).json({ message: "error Occured" });
  }
});

userRouter.post("/login", async function (req, res) {
  let data = req.body;
  console.log(data);
  try {
    if (!data.email || !data.password) return res.status(200).json({ message: "Email or password is required" });
    const newUser = await User.findOne({ email: data.email });

    if (!newUser) return res.status(200).json({ message: "Email or password is incorrect" });
    const isPasswordCorrect = await bcrypt.compare(data.password, newUser.password);
    if (!isPasswordCorrect) return res.status(200).json({ message: "Email or password is incorrect" });
    console.log(isPasswordCorrect);
    const token = jwt.sign({ user_id: newUser._id, email: newUser.email }, secretkey);

    res.status(200).json({ message: newUser, token });
  } catch (error) {
    res.status(200).json({ message: "error occured" });
  }
});

export default userRouter;
