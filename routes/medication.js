const express = require("express");
const medicationController = require("../controllers/medication");
const medicationValidator = require("../validators/medication-validators");

const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

// GET /api/medication/medication-list
router.get("/medication-list", isAuth, medicationController.getMedicationsList);

// GET /api/medication/get-single-medication/< medicationId >
router.get(
  "/get-single-medication/:medicationId",
  isAuth,
  medicationController.getSingleMedication
);

// POST /api/medication/create-medication
router.post(
  "/create-medication",
  isAuth,
  isAdmin,
  medicationValidator,
  medicationController.createMedication
);

// PUT /api/medication/update-medication/< medicationId >
router.put(
  "/update-medication/:medicationId",
  isAuth,
  isAdmin,
  medicationValidator,
  medicationController.updateMedication
);

// DELETE /api/medication/delete-medication/< medicationId >
router.delete(
  "/delete-medication/:medicationId",
  isAuth,
  isAdmin,
  medicationController.deleteMedication
);

module.exports = router;
