const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("User is not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const error = new Error("Invalid session. Please login");
    error.statusCode = 401;
    throw error;
  }
  if (!decodedToken) {
    const error = new Error("User is not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.role = decodedToken.role;
  req.userId = decodedToken.userId;
  next();
};
