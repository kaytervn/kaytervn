import { v2 as cloudinary } from "cloudinary";
import { getAppProperties } from "./appProperties.js";
import { CONFIG_KEY } from "../utils/constant.js";

let isConfigured = false;

const getCloudinary = () => {
  try {
    const props = getAppProperties();
    const CLOUD_NAME = props[CONFIG_KEY.CLOUD_NAME];
    const CLOUD_API_KEY = props[CONFIG_KEY.CLOUD_API_KEY];
    const CLOUD_API_SECRET = props[CONFIG_KEY.CLOUD_API_SECRET];

    if (!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_API_SECRET) {
      return null;
    }

    if (!isConfigured) {
      cloudinary.config({
        cloud_name: CLOUD_NAME,
        api_key: CLOUD_API_KEY,
        api_secret: CLOUD_API_SECRET,
      });
      isConfigured = true;
    }

    return cloudinary;
  } catch (err) {
    console.error("Error initializing Cloudinary:", err);
    return null;
  }
};

export { getCloudinary };
