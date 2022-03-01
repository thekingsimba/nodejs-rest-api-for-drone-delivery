const express = require("express");
const droneController = require("../controllers/drone");
const droneValidator = require("../validators/drone-validators");

const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

// GET /api/drone/drone-list
router.get("/drone-list", isAuth, droneController.getDronesList);

// GET /api/drone/drone-list-by-state/< droneState >
router.get(
  "/drone-list-by-state/:droneState",
  isAuth,
  droneController.getDronesListByState
);

// GET /api/drone/get-single-drone/< droneId >
router.get(
  "/get-single-drone/:droneId",
  isAuth,
  droneController.getSingleDrone
);

// POST /api/drone/create-drone
router.post(
  "/create-drone",
  isAuth,
  isAdmin,
  droneValidator,
  droneController.createDrone
);

// PUT /api/drone/update-drone/< droneId >
router.put(
  "/update-drone/:droneId",
  isAuth,
  isAdmin,
  droneValidator,
  droneController.updateDrone
);

// DELETE /api/drone/delete-drone/< droneId >
router.delete(
  "/delete-drone/:droneId",
  isAuth,
  isAdmin,
  droneController.deleteDrone
);

module.exports = router;
