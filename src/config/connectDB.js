// This file handles connecting the app to the database (where we store data). It uses Mongoose to set up the connection to MongoDB. If the connection works, it starts the server; if not, it shows an error and stops the app.

const mongoose = require("mongoose");

const connectToDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to db and running on port", process.env.PORT);
    })
    .catch((err) => {
      console.error("Connection error:", err);
      process.exit(1);
    });
};

module.exports = connectToDB;
