import { GoogleGenAI } from "@google/genai";
import { ENV, GEMINI_MODEL } from "../static/constant.js";
import { makeErrorResponse, makeSuccessResponse } from "./apiService.js";

const ai = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });

const sendMessageGenAi = async (req, res) => {
  try {
    const { history, message } = req.body;

    if (!message) {
      return makeErrorResponse({
        res,
        message: "Message is required",
      });
    }

    const chat = ai.chats.create({
      model: GEMINI_MODEL,
      history: history || [],
      config: {
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_ONLY_HIGH",
          },
        ],
      },
    });

    const response = await chat.sendMessage({ message });

    return makeSuccessResponse({
      res,
      data: { answer: response.text },
    });
  } catch (error) {
    return makeErrorResponse({
      res,
      message: error.message,
    });
  }
};

export { sendMessageGenAi };
