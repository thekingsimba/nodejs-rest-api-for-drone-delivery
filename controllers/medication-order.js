const { validationResult } = require("express-validator/check");

const Drone = require("../models/drone");
const MedicationOrder = require("../models/medication-order");
const Medication = require("../models/medication");

exports.getMedicationsOrdersByDrone = async (req, res, next) => {
  const currentPage = +req.query.page || 1;
  const perPage = +req.query.perPage;
  const droneId = req.query.droneId;

  try {
    let totalItems = 0;
    let dbMedicationOrders = [];

    if (droneId && droneId != "") {
      totalItems = await MedicationOrder.find({
        droneId: droneId,
      }).countDocuments();

      dbMedicationOrders = await MedicationOrder.find({ droneId: droneId })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    } else {
      const error = new Error("Please precise the drone you want to check !.");
      error.statusCode = 403;
      throw error;
    }

    if (!dbMedicationOrders) {
      const error = new Error("Could not get any medication order.");
      error.statusCode = 404;
      throw error;
    }

    const medicationsOrders = dbMedicationOrders.map((medicationOrder) => {
      return {
        medicationOrderId: medicationOrder._id.toString(),
        details: medicationOrder.details,
        totalWeight: medicationOrder.totalWeight,
        isDelivered: medicationOrder.isDelivered,
        droneId: medicationOrder.droneId,
        userId: medicationOrder.userId,
      };
    });

    const totalPages = totalItems / perPage;

    res.status(200).json({
      data: {
        medicationsOrders: medicationsOrders,
        totalItems: totalItems,
        totalPages: totalPages,
        currentPage: currentPage,
      },
      code: 200,
      message: "Medications orders fetched successfully.",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMedicationsOrdersList = async (req, res, next) => {
  const currentPage = +req.query.page || 1;
  const perPage = +req.query.perPage;
  const userId = req.query.userId;

  try {
    let totalItems = 0;
    let dbMedicationOrders = [];

    if (userId && userId != "") {
      totalItems = await MedicationOrder.find({
        userId: userId,
      }).countDocuments();

      dbMedicationOrders = await MedicationOrder.find({ userId: userId })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    } else {
      totalItems = await MedicationOrder.find().countDocuments();

      dbMedicationOrders = await MedicationOrder.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    }

    if (!dbMedicationOrders) {
      const error = new Error("Could not get any medication order.");
      error.statusCode = 404;
      throw error;
    }

    const medicationsOrders = dbMedicationOrders.map((medicationOrder) => {
      return {
        medicationOrderId: medicationOrder._id.toString(),
        details: medicationOrder.details,
        totalWeight: medicationOrder.totalWeight,
        isDelivered: medicationOrder.isDelivered,
        droneId: medicationOrder.droneId,
        userId: medicationOrder.userId,
      };
    });

    const totalPages = totalItems / perPage;

    res.status(200).json({
      data: {
        medicationsOrders: medicationsOrders,
        totalItems: totalItems,
        totalPages: totalPages,
        currentPage: currentPage,
      },
      code: 200,
      message: "Medications orders fetched successfully.",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSingleMedicationOrder = async (req, res, next) => {
  const medicationOrderId = req.params.medicationOrderId;

  const dbMedicationOrder = await MedicationOrder.findById(medicationOrderId);

  try {
    if (!dbMedicationOrder) {
      const error = new Error("Could not find such a medication.");
      error.statusCode = 404;
      throw error;
    }

    if (
      req.role !== "ADMIN" &&
      dbMedicationOrder.userId.toString() !== req.userId
    ) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }

    const medicationOrderFound = {
      medicationOrderId: dbMedicationOrder._id.toString(),
      details: dbMedicationOrder.details,
      totalWeight: dbMedicationOrder.totalWeight,
      isDelivered: dbMedicationOrder.isDelivered,
      droneId: dbMedicationOrder.droneId,
      userId: dbMedicationOrder.userId,
    };

    res.status(200).json({
      data: medicationOrderFound,
      code: 200,
      message: "Medication order detail fetched!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createMedicationOrder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      const messages = errors
        .array()
        .map((error) => {
          return error.msg + " in " + error.param + " field";
        })
        .join(". ");

      const error = new Error("Validation failed. " + messages);
      error.statusCode = 422;
      throw error;
    } catch (error) {
      next(error);
      // Stop setting header after error has been sent
      return;
    }
  }

  const details = req.body.details;
  let totalWeight = 0;

  // calculation of total weight
  for (let currentMedicationObject of details) {
    let dbMedication;

    try {
      dbMedication = await Medication.findById(
        currentMedicationObject.medicationId
      );
    } catch (err) {
      const error = new Error(
        "An unavailable medication found in the order details list provided. Please select available medication."
      );
      error.statusCode = 404;
      next(error);
      // Stop setting header after error has been sent
      return;
    }

    if (dbMedication) {
      const currentOrderWeight =
        dbMedication.weight * currentMedicationObject.quantity;
      totalWeight += currentOrderWeight;
    }
  }

  try {
    if (totalWeight > 500) {
      const error = new Error(
        "Oops ! The drone is overloaded. The weight limit is 500gr max. Please Reduce your order quantity !"
      );
      error.statusCode = 403;
      throw error;
    }
  } catch (err) {
    next(err);
    // Stop setting header after error has been sent
    return;
  }

  const droneId = req.body.droneId;

  // assign the drone
  try {
    const drone = await Drone.findById(droneId);
    if (!drone || drone.batteryCapacity < 25 || drone.state !== "IDLE") {
      const error = new Error(
        "The drone selected for this order is not available at the moment."
      );
      error.statusCode = 404;
      throw error;
    }

    //assuming Drone lose 10% battery at every order
    drone.batteryCapacity = drone.batteryCapacity - 10;
    drone.state = "LOADING";

    const result = await drone.save();
    res.status(200).json({ message: "Drone updated!", drone: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

  const userId = req.userId;

  const medicationOrder = new MedicationOrder({
    details: details,
    totalWeight: totalWeight,
    droneId: droneId,
    userId: userId,
  });

  try {
    await medicationOrder.save();

    res.status(200).json({
      data: {
        medicationOrderId: medicationOrder._id.toString(),
        details: details,
        totalWeight: totalWeight,
        droneId: droneId,
        userId: userId,
      },
      code: 200,
      message: "The medications ordered has been successfully sent!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateMedicationOrder = async (req, res, next) => {
  const medicationOrderId = req.params.medicationOrderId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => {
        return error.msg + " in " + error.param + " field";
      })
      .join(". ");

    const error = new Error("Validation failed. " + messages);
    error.statusCode = 422;
    throw error;
  }

  let details = req.body.details;
  const isDelivered = req.body.isDelivered;
  const droneId = req.body.droneId;
  const userId = req.userId;

  try {
    const medicationOrder = await MedicationOrder.findById(medicationOrderId);
    if (!medicationOrder) {
      const error = new Error("Could not find that medication order.");
      error.statusCode = 404;
      throw error;
    }

    if (medicationOrder.userId.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }

    medicationOrder.details = details;

    let totalWeight = 0;

    // calculation of total weight
    for (let currentMedicationObject of details) {
      let dbMedication;

      try {
        dbMedication = await Medication.findById(
          currentMedicationObject.medicationId
        );
      } catch (err) {
        const error = new Error(
          "An unavailable medication found in the order details list provided. Please select available medication."
        );
        error.statusCode = 404;
        next(error);
        // Stop setting header after error has been sent
        return;
      }

      if (dbMedication) {
        const currentOrderWeight =
          dbMedication.weight * currentMedicationObject.quantity;
        totalWeight += currentOrderWeight;
      }
    }

    try {
      if (totalWeight > 500) {
        const error = new Error(
          "Oops ! The drone is overloaded. The weight limit is 500gr max. Please Reduce your order quantity !"
        );
        error.statusCode = 403;
        throw error;
      }
    } catch (err) {
      next(err);
      // Stop setting header after error has been sent
      return;
    }

    medicationOrder.totalWeight = totalWeight;
    medicationOrder.isDelivered = isDelivered;
    medicationOrder.droneId = droneId;
    medicationOrder.userId = userId;

    const result = await medicationOrder.save();

    const medicationOrderUpdated = {
      medicationOrderId: result._id.toString(),
      details: result.details,
      totalWeight: result.totalWeight,
      isDelivered: result.isDelivered,
      droneId: result.droneId,
      userId: result.userId,
    };

    res.status(200).json({
      message: "Medication order updated!",
      medication: medicationOrderUpdated,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteMedicationOrder = async (req, res, next) => {
  const medicationOrderId = req.params.medicationOrderId;
  try {
    const medicationOrder = await MedicationOrder.findById(medicationOrderId);

    if (!medicationOrder) {
      const error = new Error("Could not find that medication order.");
      error.statusCode = 404;
      throw error;
    } else if (medicationOrder.userId.toString() !== req.userId) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    } else {
      await MedicationOrder.findByIdAndRemove(medicationOrderId);
      res
        .status(200)
        .json({ message: "Medication order Deleted successfully." });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
