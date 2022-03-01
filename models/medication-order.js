const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicationOrderSchema = new Schema({
  details: [
    {
      medicationId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalWeight: {
    type: Number,
    required: true,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  droneId: {
    type: Schema.Types.ObjectId,
    ref: "Drone",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("MedicationOrder", medicationOrderSchema);
