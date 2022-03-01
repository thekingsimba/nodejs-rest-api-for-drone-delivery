const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Medication", medicationSchema);
