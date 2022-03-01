const Drone = require("../models/drone");
const cron = require("node-cron");
var fs = require("fs");

const fsWriteLineInFile = (msg) => {
  const stream = fs.createWriteStream("./jobs/daily-report.txt", {
    flags: "a",
  });

  stream.once("open", (fd) => {
    stream.write(msg + "\r\n");
  });
};

exports.batteryLevelReporter = () => {
  cron.schedule("0 59 23 * * *", async () => {
    // write battery report every 24h
    const splittedDate = new Date().toISOString().split("T")[0];

    const reportTitle =
      "=========== Report of " + splittedDate + " ============== ";

    fsWriteLineInFile(reportTitle);

    try {
      let dbDrones = await Drone.find();

      if (!dbDrones.length) {
        throw new Error("Unable to set the drone battery report.");
      }

      const drones = dbDrones.map((drone) => {
        return {
          serialNumber: drone.serialNumber,
          batteryCapacity: drone.batteryCapacity,
        };
      });

      drones.forEach((item) => {
        fsWriteLineInFile(
          "Serial number " +
            item.serialNumber +
            " " +
            "Battery capacity " +
            item.batteryCapacity
        );
      });
    } catch (err) {
      fsWriteLineInFile(err.message + "\r\n");
      console.log("Err: " + err.message);
    }
  });
};
