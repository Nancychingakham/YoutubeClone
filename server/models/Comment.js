import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
