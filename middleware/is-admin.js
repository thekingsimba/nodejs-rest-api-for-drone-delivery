const User = require("../models/user");

module.exports = async (req, res, next) => {
  let isError = false;
  let user;

  if (!req.userId) {
    isError = true;
  } else {
    user = await User.findById(req.userId);
    if (!user) {
      isError = true;
    }
  }

  if (isError) {
    try {
      const error = new Error("Please login with your credentials.");
      error.statusCode = 401;
      error.data = [];
      throw error;
    } catch (error) {
      next(error);
      // Stop setting header after error has been sent
      return;
    }
  }

  if (user.role !== "ADMIN") {
    // only ADMIN is authorized
    try {
      const error = new Error(
        "Sorry you are not authorized to perform this action. Only an ADMIN can do it !"
      );
      error.statusCode = 403;
      error.data = [];
      throw error;
    } catch (error) {
      next(error);
      // Stop setting header after error has been sent
      return;
    }
  }
  req.role = user.role;

  next();
};
