const { body } = require("express-validator/check");

const medicationValidator = [
  body("droneId")
    .trim()
    .not()
    .isEmpty()
    .withMessage("The drone identifier is required")
    .isString()
    .withMessage("The drone identifier for medication must be a string "),

  body("details")
    .exists()
    .withMessage("The medication order details is missing "),

  body("details.*.medicationId")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Medication identifier is required")
    .isString()
    .withMessage("Medication identifier must be a string"),

  body("details.*.quantity")
    .not()
    .isEmpty()
    .isNumeric()
    .withMessage("Medication quantity must be a positive number"),
];

module.exports = medicationValidator;
