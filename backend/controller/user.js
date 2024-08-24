import { errorHandler } from "../utils/error.js";
import User from "../model/user.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  if (req.user._id != req.params._id) {
    next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      next(errorHandler(400, "username must be between 7 to 20 characters"));
    }
    if (req.body.username.includes(" ")) {
      next(errorHandler(400, "username cannot contain spaces"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      next(errorHandler(400, "username can only contain letters and numbers"));
    }
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true },
    );
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (err) {
    next(err);
  }
};
