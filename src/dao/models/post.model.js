import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2'

const postSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  thumbnail: { type: String },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: new Date() }
});

postSchema.plugin(paginate)

const postModel = mongoose.model("posts", postSchema);

export default postModel;