const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator/check");

const Medication = require("../models/medication");

exports.getMedicationsList = async (req, res, next) => {
  try {
    let dbMedications = await Medication.find();

    if (!dbMedications) {
      const error = new Error("Could not get any medication.");
      error.statusCode = 404;
      throw error;
    }

    const medications = dbMedications.map((medication) => {
      return {
        medicationId: medication._id.toString(),
        name: medication.name,
        weight: medication.weight,
        code: medication.code,
        imgUrl: medication.imgUrl,
      };
    });

    res.status(200).json({
      data: medications,
      code: 200,
      message: "Medications fetched successfully.",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSingleMedication = async (req, res, next) => {
  const medicationId = req.params.medicationId;

  const dbMedication = await Medication.findById(medicationId);

  try {
    if (!dbMedication) {
      const error = new Error("Could not find such a medication.");
      error.statusCode = 404;
      throw error;
    }

    const medicationFound = {
      medicationId: dbMedication._id.toString(),
      name: dbMedication.name,
      weight: dbMedication.weight,
      code: dbMedication.code,
      imgUrl: dbMedication.imgUrl,
    };

    res.status(200).json({
      data: medicationFound,
      code: 200,
      message: "Medication detail fetched!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createMedication = async (req, res, next) => {
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
        "No valid image provided. Please attach a valid Medication image."
      );
      error.statusCode = 422;
      throw error;
    } catch (error) {
      next(error);
      // Stop setting header after error has been sent
      return;
    }
  }
  const name = req.body.name;
  const weight = req.body.weight;
  const code = req.body.code;
  const imgUrl = req.file.path;

  const medication = new Medication({
    name: name,
    weight: weight,
    code: code,
    imgUrl: imgUrl,
  });

  try {
    await medication.save();

    res.status(200).json({
      data: {
        medicationId: medication._id.toString(),
        name: name,
        weight: weight,
        code: code,
        imgUrl: imgUrl,
      },
      code: 200,
      message: "The medication has been created successfully!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateMedication = async (req, res, next) => {
  const medicationId = req.params.medicationId;
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
  const name = req.body.name;
  const weight = req.body.weight;
  const code = req.body.code;

  if (req.file) {
    imgUrl = req.file.path;
  }
  if (!imgUrl) {
    const error = new Error("No file picked. Medication Image is required ");
    error.statusCode = 422;
    throw error;
  }
  try {
    const medication = await Medication.findById(medicationId);
    if (!medication) {
      const error = new Error("Could not find that medication.");
      error.statusCode = 404;
      throw error;
    }

    if (imgUrl !== medication.imgUrl) {
      clearImage(medication.imgUrl);
    }

    medication.imgUrl = imgUrl;
    medication.name = name;
    medication.weight = weight;
    medication.code = code;

    const result = await medication.save();
    res
      .status(200)
      .json({ message: "Medication updated!", medication: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteMedication = async (req, res, next) => {
  const medicationId = req.params.medicationId;
  try {
    const medication = await Medication.findById(medicationId);

    if (!medication) {
      const error = new Error("Could not find that medication.");
      error.statusCode = 404;
      throw error;
    } else {
      clearImage(medication.imgUrl);
      await Medication.findByIdAndRemove(medicationId);
      res.status(200).json({ message: "Medication Deleted successfully." });
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
