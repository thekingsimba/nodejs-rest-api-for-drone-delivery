const { body } = require("express-validator/check");

const droneValidator = [
  body("serialNumber")
    .trim()
    .not()
    .isEmpty()
    .withMessage("serialNumber is required")

    .custom((value) => {
      if (value.length > 100) {
        throw new Error("A serial number should be 100 characters maximum");
      }
      return true;
    }),

  body("model")
    .trim()
    .not()
    .isEmpty()
    .withMessage("model is required")
    .custom((value) => {
      const acceptedValue = [
        "Lightweight",
        "Middleweight",
        "Cruiserweight",
        "Heavyweight",
      ];
      if (!acceptedValue.includes(value)) {
        throw new Error(
          "A model should be Lightweight, Middleweight, Cruiserweight or Heavyweight"
        );
      }
      return true;
    }),

  body("weightLimit")
    .not()
    .isEmpty()
    .isNumeric()
    .isFloat({ gt: 0 })
    .withMessage("WeightLimit must be a positive number")
    .custom((value) => {
      if (value > 500) {
        throw new Error("A drone weight limit is 500 gr maximum");
      }
      return true;
    }),

  body("batteryCapacity")
    .not()
    .isEmpty()
    .isNumeric()
    .isFloat({ gt: 0 })
    .withMessage("BatteryCapacity must be a positive number")
    .custom((value) => {
      if (value > 100) {
        throw new Error("A drone maximum battery capacity is 100 percent");
      }
      return true;
    }),

  body("state")
    .trim()
    .not()
    .isEmpty()
    .isString()
    .withMessage("State must be a string")
    .custom((value) => {
      const acceptedValue = [
        "IDLE",
        "LOADING",
        "LOADED",
        "DELIVERING",
        "DELIVERED",
        "RETURNING",
      ];
      if (!acceptedValue.includes(value)) {
        throw new Error(
          "A drone state should be IDLE, LOADING, LOADED, DELIVERING, DELIVERED or RETURNING"
        );
      }
      return true;
    }),
];

module.exports = droneValidator;
