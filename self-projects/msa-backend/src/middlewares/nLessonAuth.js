import { makeErrorResponse } from "../services/apiService.js";
import { ENV } from "../utils/constant.js";

const nLessonsAuth = () => {
  return async (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || ENV.X_API_KEY !== apiKey) {
      return makeErrorResponse({
        res,
        data: {
          code: "INVALID-API-KEY",
        },
        message: "Full authentication is required to access this resource",
      });
    }
    next();
  };
};

export default nLessonsAuth;
