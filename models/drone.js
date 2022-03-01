const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const droneSchema = new Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true,
  },
  model: {
    type: String,
    required: true,
  },
  weightLimit: {
    type: Number,
    required: true,
  },
  batteryCapacity: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Drone", droneSchema);
