import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createError from "../error.js";

// // CreateError function
// function createError(status, message) {
//   const error = new Error(message);
//   error.status = status;
//   return error;
// }

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    console.log("User found:", user); // Log user found

    if (!user) return next(createError(404, "User not found"));
    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    console.log("Password correct:", isCorrect); // Log password check result

    if (!isCorrect) {
      console.log("Invalid password"); // Log invalid password
      return next(createError(400, "Wrong credentials"));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (err) {
    next(err);
  }
};
export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).send("User has been created!");
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};
