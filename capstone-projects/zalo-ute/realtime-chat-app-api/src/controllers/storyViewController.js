import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { getListStoryViews } from "../services/storyViewService.js";

const getStoryViews = async (req, res) => {
  try {
    const result = await getListStoryViews(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { getStoryViews };
