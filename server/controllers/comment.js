import Comment from "../models/Comment.js";
import Video from "../models/Video.js";
import createError from "../error.js";
import User from "../models/User.js";

export const addComment = async (req, res, next) => {
  const newComment = new Comment({ ...req.body, userID: req.user.id });
  try {
    const savedComment = await newComment.save();
    res.status(200).send(savedComment);
  } catch (err) {
    next(err);
  }
};
export const deleteComment = async (req, res, next) => {
  try {
    const Comment = await Comment.findById(res.params.id);
    const video = Video.findById(res.params.id);
    if (req.user.id === Comment.userID || req.user.id === video.userID) {
      await Comment.findByIdAndDelete(req.params.id);
      req.status(200).json("The comment has been deleted");
    } else {
      return next(createError(403, "You  can only delete your comment"));
    }
  } catch (err) {
    next(err);
  }
};
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};
