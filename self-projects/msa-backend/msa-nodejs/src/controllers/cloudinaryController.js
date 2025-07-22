import { getCloudinary } from "../config/cloudinary.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { deleteFileByUrl, isValidUrl } from "../utils/utils.js";

const uploadFile = async (req, res) => {
  const cloudinary = getCloudinary();
  if (!req.file) {
    return makeErrorResponse({ res, message: "No file uploaded" });
  }
  try {
    const uploadResponse = await new Promise((resolve, reject) => {
      const bufferData = req.file.buffer;
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(bufferData);
    });
    return makeSuccessResponse({
      res,
      data: {
        filePath: uploadResponse.secure_url,
        id: uploadResponse.public_id,
      },
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteFile = async (req, res) => {
  const { filePath } = req.body;
  if (!filePath || !isValidUrl(filePath)) {
    return makeErrorResponse({ res, message: "Invalid file path" });
  }
  try {
    await deleteFileByUrl(filePath);
    return makeSuccessResponse({
      res,
      message: "File deleted successfully",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { uploadFile, deleteFile };
