const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator/check");

const Drone = require("../models/drone");

exports.getDronesListByState = async (req, res, next) => {
  const droneState = req.params.droneState;

  try {
    let dbDrones = await Drone.find({ state: droneState.toUpperCase() });

    if (!dbDrones) {
      const error = new Error("Could not get any drone with this state.");
      error.statusCode = 404;
      throw error;
    }

    const drones = dbDrones.map((drone) => {
      return {
        droneId: drone._id.toString(),
        serialNumber: drone.serialNumber,
        model: drone.model,
        weightLimit: drone.weightLimit,
        batteryCapacity: drone.batteryCapacity,
        state: drone.state,
        imgUrl: drone.imgUrl,
      };
    });

    res.status(200).json({
      data: drones,
      code: 200,
      message: "Drones fetched successfully.",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getDronesList = async (req, res, next) => {
  try {
    let dbDrones = await Drone.find();

    if (!dbDrones) {
      const error = new Error("Could not get any drone.");
      error.statusCode = 404;
      throw error;
    }

    const drones = dbDrones.map((drone) => {
      return {
        droneId: drone._id.toString(),
        serialNumber: drone.serialNumber,
        model: drone.model,
        weightLimit: drone.weightLimit,
        batteryCapacity: drone.batteryCapacity,
        state: drone.state,
        imgUrl: drone.imgUrl,
      };
    });

    res.status(200).json({
      data: drones,
      code: 200,
      message: "Drones fetched successfully.",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSingleDrone = async (req, res, next) => {
  const droneId = req.params.droneId;

  const dbDrone = await Drone.findById(droneId);

  try {
    if (!dbDrone) {
      const error = new Error("Could not find such a drone.");
      error.statusCode = 404;
      throw error;
    }

    const droneFound = {
      droneId: dbDrone._id.toString(),
      serialNumber: dbDrone.serialNumber,
      model: dbDrone.model,
      weightLimit: dbDrone.weightLimit,
      batteryCapacity: dbDrone.batteryCapacity,
      state: dbDrone.state,
      imgUrl: dbDrone.imgUrl,
    };

    res.status(200).json({
      data: droneFound,
      code: 200,
      message: "Drone detail fetched!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createDrone = async (req, res, next) => {
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
  if (!req.file) {
    try {
      const error = new Error(
        "No valid image provided. Please attach valid a Drone image."
      );
      error.statusCode = 422;
      throw error;
    } catch (error) {
      next(error);
      // Stop setting header after error has been sent
      return;
    }
  }
  const serialNumber = req.body.serialNumber;
  const model = req.body.model;
  const weightLimit = req.body.weightLimit;
  const batteryCapacity = req.body.batteryCapacity;
  const state = req.body.state;
  const imgUrl = req.file.path;

  const drone = new Drone({
    serialNumber: serialNumber,
    model: model,
    weightLimit: weightLimit,
    batteryCapacity: batteryCapacity,
    state: state,
    imgUrl: imgUrl,
  });

  try {
    await drone.save();

    res.status(200).json({
      data: {
        droneId: drone._id.toString(),
        serialNumber: serialNumber,
        model: model,
        weightLimit: weightLimit,
        batteryCapacity: batteryCapacity,
        state: state,
        imgUrl: imgUrl,
      },
      code: 200,
      message: "The drone has been created successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateDrone = async (req, res, next) => {
  const droneId = req.params.droneId;
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

  let imgUrl = req.body.imgUrl;
  const serialNumber = req.body.serialNumber;
  const model = req.body.model;
  const weightLimit = req.body.weightLimit;
  const batteryCapacity = req.body.batteryCapacity;
  const state = req.body.state;

  if (req.file) {
    imgUrl = req.file.path;
  }
  if (!imgUrl) {
    const error = new Error("No file picked. Drone Image is required ");
    error.statusCode = 422;
    throw error;
  }
  try {
    const drone = await Drone.findById(droneId);
    if (!drone) {
      const error = new Error("Could not find that drone.");
      error.statusCode = 404;
      throw error;
    }

    if (imgUrl !== drone.imgUrl) {
      clearImage(drone.imgUrl);
    }

    drone.imgUrl = imgUrl;
    drone.serialNumber = serialNumber;
    drone.model = model;
    drone.weightLimit = weightLimit;
    drone.batteryCapacity = batteryCapacity;
    drone.state = state;

    const result = await drone.save();
    res.status(200).json({ message: "Drone updated!", drone: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteDrone = async (req, res, next) => {
  const droneId = req.params.droneId;
  try {
    const drone = await Drone.findById(droneId);

    if (!drone) {
      const error = new Error("Could not find that drone.");
      error.statusCode = 404;
      throw error;
    } else {
      clearImage(drone.imgUrl);
      await Drone.findByIdAndRemove(droneId);
      res.status(200).json({ message: "Drone Deleted successfully." });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
