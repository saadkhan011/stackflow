import express from "express";
import Post from "../models/post.js";
import auth from "../middleware/auth.js";

const postRouter = express.Router();

postRouter.get("/", async function (req, res) {
  try {
    const result = await Post.find({});
    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
});

postRouter.post("/", auth, async function (req, res) {
  const data = req.body;
  try {
    if (!data.question || !data.category) {
      res.status(200).json({ message: "Question and Category is required" });
      return;
    }
    const result = await Post.create(data);
    if (result) {
      res.status(200).json({ message: "Success!" });
      return;
    } else {
      res.status(200).send({ message: "Error occured!" });
      return;
    }
  } catch (error) {
    res.status(200).json({ message: "Error" });
    return;
  }
});

postRouter.delete("/:id", auth, async function (req, res) {
  const id = req?.params?.id;
  try {
    const result = await Post.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: "Success!" });
      return;
    } else {
      res.status(200).json({ message: "Error occured!" });
      return;
    }
  } catch (error) {
    res.status(200).json({ message: error.message });
    return;
  }
});

postRouter.patch("/:id", auth, async function (req, res) {
  const id = req.params.id;
  const data = req.body;
  try {
    const result = await Post.findByIdAndUpdate(id, data);
    if (result) {
      res.status(200).json({ message: "Success!" });
      return;
    } else {
      res.status(200).json({ message: "Error occured!" });
      return;
    }
  } catch (error) {
    res.status(200).json({ message: error.message });
    return;
  }
});

postRouter.post("/:id/like", async (req, res) => {
  console.log(req.body);
  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, likedBy: { $ne: req.body.userId } },
    { $push: { likedBy: req.body.userId } },
    { new: true }
  );

  if (!post) {
    return res.status(400).json({ message: "User already liked this post" });
  }

  res.status(200).json(post);
});

postRouter.post("/:id/dislike", async (req, res) => {
  console.log(req.body);
  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, dislikedBy: { $ne: req.body.userId } },
    { $push: { dislikedBy: req.body.userId } },
    { new: true }
  );

  if (!post) {
    return res.status(400).json({ message: "User already liked this post" });
  }

  res.status(200).json(post);
});

export default postRouter;
