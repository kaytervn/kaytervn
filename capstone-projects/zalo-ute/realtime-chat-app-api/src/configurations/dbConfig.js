import mongoose from "mongoose";
import initDb from "./initDbConfig.js";

export default () =>
  mongoose
    .connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME })
    .then(() => {
      console.log("Connected to the database");
      initDb();
    })
    .catch((error) => {
      console.log("Error connecting to the database: ", error);
    });
