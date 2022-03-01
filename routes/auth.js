const express = require("express");
const authController = require("../controllers/auth");
const userValidator = require("../validators/user-validators");
const router = express.Router();

// api/auth/signup 
router.post("/signup", userValidator, authController.signup);

// api/auth/login 
router.post("/login", authController.login);

module.exports = router;
