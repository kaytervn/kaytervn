import { makeErrorResponse } from "../services/apiService.js";
import { ENV } from "../static/constant.js";

const auth = () => {
  return async (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || ENV.X_API_KEY !== apiKey) {
      return makeErrorResponse({
        res,
        message: "Full authentication is required to access this resource",
      });
    }
    next();
  };
};

export default auth;
