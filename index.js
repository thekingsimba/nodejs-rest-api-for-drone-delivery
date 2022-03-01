const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const constants = require("./constant/constant");
const { batteryLevelReporter } = require("./jobs/reportBatteryJob");

const authRoutes = require("./routes/auth");
const droneRoutes = require("./routes/drone");
const medicationRoutes = require("./routes/medication");
const medicationOrderRoutes = require("./routes/medication-order");

const app = express();

const { config } = require("dotenv");
config();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const fileExtension = "." + file.mimetype.split("/")[1];
    req.fileExtension = fileExtension === ".jpeg" ? "" : fileExtension;
    cb(
      null,
      new Date().toISOString() +
        "-" +
        file.originalname.split(" ").join("") +
        req.fileExtension
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/drone", droneRoutes);
app.use("/api/medication", medicationRoutes);
app.use("/api/medication-order", medicationOrderRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    code: status,
    message: message,
    error: data,
  });
});

constants
  .connectToLocalMachineDB()
  //.connectToRemoteClusterDB()
  .then((result) => {
    app.listen(process.env.PORT);
    console.log("listening at port:" + process.env.PORT);
    batteryLevelReporter();
  })
  .catch((err) => console.log("dbconnection err:", err));
