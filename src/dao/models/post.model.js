import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  thumbnail: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const postModel = mongoose.model("posts", postSchema);

export default postModel;