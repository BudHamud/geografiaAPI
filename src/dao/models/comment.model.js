import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
    text: String,
});

const commentModel = mongoose.model("comments", commentSchema);

export default commentModel