const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const constants = require("../constant/constant");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      const messages = errors
        .array()
        .map((error) => {
          return error.msg + " in " + error.param + " field";
        })
        .join(". ");

      const error = new Error("Validation failed. " + messages);
      error.statusCode = 422;

      throw error;
    } catch (error) {
      next(error);
      // Stop setting header after error has been sent
      return;
    }
  }

  if (!req.file) {
    try {
      const error = new Error(
        "No valid image provided. Please attach a valid image."
      );
      error.statusCode = 422;
      throw error;
    } catch (error) {
      next(error);
      // Stop setting header after error has been sent
      return;
    }
  }

  const fullname = req.body.fullname;
  const phonenumber = req.body.phonenumber;
  const email = req.body.email;
  const role = req.body.role;
  const password = req.body.password;
  const profileImgUrl = req.file.path;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullname: fullname,
      phonenumber: phonenumber,
      email: email,
      role: role,
      password: hashedPassword,
      profileImgUrl: profileImgUrl,
    });

    const result = await user.save();

    const token = jwt.sign(
      {
        userId: result._id.toString(),
        fullname: fullname,
        phonenumber: phonenumber,
        email: email,
        role: role,
        profileImgUrl: profileImgUrl,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      data: {
        userId: result._id.toString(),
        fullname: fullname,
        phonenumber: phonenumber,
        email: email,
        role: role,
        profileImgUrl: profileImgUrl,
        token: token,
      },
      code: 201,
      message: "Welcome ! You are now a member. Your account has been created!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      try {
        const error = new Error(
          "email or password invalid. Please verify your credentials."
        );
        error.statusCode = 401;
        error.data = [];
        throw error;
      } catch (error) {
        next(error);
        // Stop setting header after error has been sent
        return;
      }
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      try {
        const error = new Error(
          "email or password invalid. Please verify your credentials."
        );
        error.statusCode = 401;
        error.data = [];
        throw error;
      } catch (error) {
        next(error);
        // Stop setting header after error has been sent
        return;
      }
    }

    loadedUser = user;

    const token = jwt.sign(
      {
        userId: loadedUser._id.toString(),
        fullname: loadedUser.fullname,
        phonenumber: loadedUser.phonenumber,
        email: loadedUser.email,
        role: loadedUser.role,
        profileImgUrl: loadedUser.profileImgUrl,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const loginMessage = "Welcome back" + ` ${loadedUser.fullname}` + "!";

    res.status(201).json({
      data: {
        token: token,
        userId: loadedUser._id.toString(),
        fullname: loadedUser.fullname,
        phonenumber: loadedUser.phonenumber,
        email: loadedUser.email,
        role: loadedUser.role,
        profileImgUrl: loadedUser.profileImgUrl,
      },
      code: 201,
      message: loginMessage,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
