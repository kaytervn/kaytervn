import mongoose from "mongoose";
import { CONFIG_KEY } from "../utils/constant.js";
import { getConfigValue } from "./appProperties.js";
import { extractAppNameFromMongoUri } from "../utils/utils.js";

const dbConfig = () => {
  try {
    const uri = getConfigValue(CONFIG_KEY.MONGODB_URI);
    if (!uri) {
      console.log("System not ready");
      return;
    }
    const dbName = extractAppNameFromMongoUri(uri);
    mongoose
      .connect(uri, { dbName })
      .then(() => {
        console.log("Connected to the database");
      })
      .catch((error) => {
        console.log("Error connecting to the database: ", error);
      });
  } catch {
    console.log("DB will not be connected until system is unlocked");
  }
};

export default dbConfig;
