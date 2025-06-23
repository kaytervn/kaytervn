import mongoose from "mongoose";
import { ENV } from "../static/constant.js";

export default () =>
  mongoose
    .connect(ENV.MONGODB_URI, { dbName: ENV.DB_NAME })
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((error) => {
      console.log("Error connecting to the database: ", error);
    });
