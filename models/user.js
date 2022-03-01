const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImgUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
