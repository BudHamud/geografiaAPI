import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  content: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments", // En lugar de "Comment", utiliza "comments"
    },
  ],
});

const postModel = mongoose.model("posts", postSchema);

export default postModel;