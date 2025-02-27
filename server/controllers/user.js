import createError from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const update = async (req, res, next) => {
  console.log("Update request received");
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only uour account"));
  }
};

export const deleteUser = async (req, res, next) => {
  console.log("Delete request received");
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can delete only uour account"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Subscription successful");
  } catch (err) {
    next(err);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json("Unubscription successful");
  } catch (err) {
    next(err);
  }
};

export const like = async (req, res, next) => {
  const userID = req.user.id;
  const videoId = req.params.id;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: userID },
      $pull: { dislikes: userID },
    });

    res.status(200).json("The video has been liked");
  } catch (err) {
    next(err);
  }
};

export const dislike = async (req, res, next) => {
  const userID = req.user.id;
  const videoId = req.params.id;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: userID },
      $pull: { likes: userID },
    });
    res.status(200).json("The video has been disliked");
  } catch (err) {
    next(err);
  }
};
