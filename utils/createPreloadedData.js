const preloadDataList = require("./preload-data-list");
const Drone = require("../models/drone");
const User = require("../models/user");
const Medication = require("../models/medication");
const constants = require("../constant/constant");
const { config } = require("dotenv");
const bcrypt = require("bcryptjs");
const process = require("process");
config();
const createPreloadedData = async () => {
  // create one ADMIN for preload data ==============================================
  const hashedPassword = await bcrypt.hash(
    preloadDataList.userAdmin.password,
    10
  );

  const user = new User({
    ...preloadDataList.userAdmin,
    password: hashedPassword,
  });

  try {
    await user.save().then((resp) => {
      console.log(" ==> A user with role ADMIN created in preloaded data");
    });
  } catch (error) {
    console.log("preloaded ADMIN user skipped");
  }

  // create one CLIENT for preload data ==================================================
  const hashedPasswordClient = await bcrypt.hash(
    preloadDataList.userClient.password,
    10
  );

  const userClient = new User({
    ...preloadDataList.userClient,
    password: hashedPasswordClient,
  });

  try {
    await userClient.save().then((resp) => {
      console.log(" ==> A user with role CLIENT created in preloaded data");
    });
  } catch (error) {
    console.log("preloaded CLIENT user skipped");
  }

  // create 10 drones ================================
  for (const droneObject of preloadDataList.droneList) {
    const droneInstance = new Drone({ ...droneObject });
    try {
      await droneInstance.save().then((resp) => {
        console.log(" ==> A new drone object added in preload data");
      });
    } catch (error) {
      console.log("A drone object creation skipped");
    }
  }

  // create 5 medication ================================
  for (const medicationObject of preloadDataList.medicationList) {
    const medication = new Medication({ ...medicationObject });
    try {
      await medication.save().then((resp) => {
        console.log(" ==> A new medication object added in preload data");
      });
    } catch (error) {
      console.log("A medication object creation skipped");
    }
  }

  process.exit(); // stop the process when task of preload is done
};

constants
  //.connectToRemoteClusterDB()
  .connectToLocalMachineDB()
  .then(async (result) => {
    console.log("Mongodb connected for data preloading ...");
    await createPreloadedData();
  })
  .catch((err) => console.log("dbconnection err:", err));
