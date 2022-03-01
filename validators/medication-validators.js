const { body } = require("express-validator/check");

const medicationValidator = [
  body("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Medication name is required")
    .custom((value) => {
      const isAccepted = /^[A-Za-z0-9\-\_]*$/g.test(value);
      if (!isAccepted) {
        throw new Error(
          "A name should contain only letters, numbers, ‘-‘ or ‘_’"
        );
      }
      return true;
    }),

  body("weight")
    .not()
    .isEmpty()
    .isNumeric()
    .isFloat({ gt: 0 })
    .withMessage("Medication weight must be a positive number"),

  body("code")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Medication code is required")
    .custom((value) => {
      const isAccepted = /^[A-Z0-9\_]*$/g.test(value);
      if (!isAccepted) {
        throw new Error(
          "A code allow only upper case letters, underscore and numbers"
        );
      }
      return true;
    }),
];

module.exports = medicationValidator;
