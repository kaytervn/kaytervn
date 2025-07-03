import { getConfigValue } from "../config/appProperties.js";
import { makeErrorResponse } from "../services/apiService.js";
import { CONFIG_KEY } from "../utils/constant.js";

const nLessonsAuth = () => {
  return async (req, res, next) => {
    try {
      const apiKey = req.headers["x-api-key"];
      if (!apiKey || getConfigValue(CONFIG_KEY.X_API_KEY) !== apiKey) {
        return makeErrorResponse({
          res,
          data: {
            code: "INVALID-API-KEY",
          },
          message: "Full authentication is required to access this resource",
        });
      }
      next();
    } catch (error) {
      return makeErrorResponse({ res, message: error.message });
    }
  };
};

export default nLessonsAuth;
