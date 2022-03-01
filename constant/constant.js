const mongoose = require("mongoose");

const constants = {
  clusterUri: () => {
    return (
      "mongodb+srv://" +
      process.env.DB_USER +
      ":" +
      process.env.DB_PASS +
      "@musala-db-cluster.8m0no.mongodb.net/musala-test-db?retryWrites=true&w=majority"
    );
  },
  connectToRemoteClusterDB: () => {
    console.log("connectToRemoteClusterDB");

    const clusterUri =
      "mongodb+srv://" +
      process.env.DB_USER +
      ":" +
      process.env.DB_PASS +
      "@musala-db-cluster.8m0no.mongodb.net/musala-test-db?retryWrites=true&w=majority";

    return mongoose.connect(clusterUri, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  },
  connectToLocalMachineDB: () => {
    console.log("connectToLocalMachineDB");
    return mongoose.connect(process.env.MONGODB_URI, {
      // return mongoose.connect("mongodb://localhost:2717", {
      dbName: process.env.DB_NAME,
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  },
};

module.exports = constants;
