import Embedding from "../models/embeddingModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const deleteFaceId = async (req, res) => {
  try {
    const user_id = req.params.id;
    await Embedding.deleteMany({ user_id });
    return makeSuccessResponse({
      res,
      message: "Face ID deleted successfully",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListEmbeddings = async (req, res) => {
  try {
    const data = await Embedding.find({}, "user_id").lean();
    return makeSuccessResponse({
      res,
      data: { content: data },
    });
  } catch (error) {
    return makeErrorResponse({
      res,
      message: error.message,
    });
  }
};

export { deleteFaceId, getListEmbeddings };
