const express = require("express");
const medicationOrderController = require("../controllers/medication-order");
const medicationOrderValidator = require("../validators/medication-order-validators");

const isAuth = require("../middleware/is-auth");
const isClient = require("../middleware/is-client");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

// GET /api/medication-order/medication-order-list-by-drone?droneId=< droneId >&page=< pageNumber >&perPage=< itemsPerPage >
router.get(
  "/medication-order-list-by-drone",
  isAuth,
  isAdmin,
  medicationOrderController.getMedicationsOrdersByDrone
);

// GET /api/medication-order/medication-order-list?userId=< userId >&page=< pageNumber >&perPage=< itemsPerPage >
router.get(
  "/medication-order-list",
  isAuth,
  isAdmin,
  medicationOrderController.getMedicationsOrdersList
);

// GET /api/medication-order/get-single-medication-order/< medicationOrderId >
router.get(
  "/get-single-medication-order/:medicationOrderId",
  isAuth,
  medicationOrderController.getSingleMedicationOrder
);

// POST /api/medication-order/create-medication-order
router.post(
  "/create-medication-order",
  isAuth,
  isClient,
  medicationOrderValidator,
  medicationOrderController.createMedicationOrder
);

// PUT /api/medication-order/update-medication-order/ < medicationOrderId >
router.put(
  "/update-medication-order/:medicationOrderId",
  isAuth,
  isClient,
  medicationOrderValidator,
  medicationOrderController.updateMedicationOrder
);

// DELETE /api/medication-order/delete-medication-order/< medicationOrderId >
router.delete(
  "/delete-medication-order/:medicationOrderId",
  isAuth,
  isClient,
  medicationOrderController.deleteMedicationOrder
);

module.exports = router;
