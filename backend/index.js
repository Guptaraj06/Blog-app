import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import cors from "cors";
import postRouter from "./routes/post.js";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, { retryWrites: true })
  .then(async () => {
    // const indexes = await Post.collection.indexes();
    // console.log(indexes);
    // await Post.collection.dropIndex("userId_1"); // Replace with the correct index name
    // console.log("Index dropped successfully");
    console.log("Mongodb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ success: false, status, message });
});

app.listen(3000, () => {
  console.log("server running on port number 3000!!!!!!!!!!!!!");
});
