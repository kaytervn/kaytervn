import { LRUCache } from "lru-cache";
import { CACHE_MAX_SIZE, CACHE_TTL } from "../static/constant.js";
import { makeErrorResponse, makeSuccessResponse } from "./apiService.js";
import { formatDateUTC } from "../utils/utils.js";

const cache = new LRUCache({
  max: CACHE_MAX_SIZE,
  ttl: CACHE_TTL,
});

const putKey = async (req, res) => {
  try {
    const { key, session, time } = req.body;
    if (!key || !session || !time) {
      return makeErrorResponse({
        res,
        message: "All fields are required",
      });
    }
    cache.set(key, { session, time });
    return makeSuccessResponse({
      res,
      message: "Key put success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getKey = async (req, res) => {
  try {
    const key = req.params.key;
    const data = cache.get(key);
    if (!data) {
      return makeSuccessResponse({ res, message: "Key not found" });
    }
    return makeSuccessResponse({
      res,
      message: "Get key success",
      data: { key, ...data },
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const removeKey = async (req, res) => {
  try {
    const key = req.params.key;
    const data = cache.get(key);
    if (!data) {
      return makeSuccessResponse({ res, message: "Key not found" });
    }
    cache.delete(key);
    return makeSuccessResponse({
      res,
      message: "Key deleted",
      data: { key, ...data },
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const checkSession = async (req, res) => {
  try {
    const { key, session } = req.body;
    const value = cache.get(key);

    if (value && value.session === session) {
      cache.set(
        key,
        { ...value, time: formatDateUTC() },
        { noUpdateTTL: true }
      );

      return makeSuccessResponse({
        res,
        message: "Check session success",
        data: { isValid: true },
      });
    }

    return makeSuccessResponse({
      res,
      message: "Check session failed",
      data: { isValid: false },
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getKeysByPattern = async (req, res) => {
  try {
    const pattern = req.params.pattern;
    const regex = new RegExp("^" + pattern.replace("*", ".*") + "$");

    const matchedKeys = [];
    for (const key of cache.keys()) {
      if (regex.test(key)) {
        const value = cache.get(key);
        matchedKeys.push({ key, ...value });
      }
    }

    if (matchedKeys.length === 0) {
      return makeSuccessResponse({
        res,
        data: [],
        message: "No matching keys found",
      });
    }

    return makeSuccessResponse({
      res,
      message: "Get keys by pattern success",
      data: matchedKeys,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const removeKeysByPattern = async (req, res) => {
  try {
    const pattern = req.params.pattern;
    const regex = new RegExp("^" + pattern.replace("*", ".*") + "$");

    const deletedKeys = [];
    const keys = Array.from(cache.keys());
    for (const key of keys) {
      if (regex.test(key)) {
        const value = cache.get(key);
        cache.delete(key);
        deletedKeys.push({ key, ...value });
      }
    }

    if (deletedKeys.length === 0) {
      return makeSuccessResponse({
        res,
        data: [],
        message: "No matching keys found",
      });
    }

    return makeSuccessResponse({
      res,
      message: "Remove keys by pattern success",
      data: deletedKeys,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const resetCache = async (req, res) => {
  try {
    cache.clear();
    return makeSuccessResponse({
      res,
      message: "Cache reset success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getAllKeys = async (req, res) => {
  try {
    const allKeys = [];
    for (const [key, value] of cache.entries()) {
      allKeys.push({ key, ...value });
    }

    if (allKeys.length === 0) {
      return makeSuccessResponse({
        res,
        message: "No keys found",
        data: [],
      });
    }

    return makeSuccessResponse({
      res,
      message: "Get all keys success",
      data: allKeys,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getMultiKeys = async (req, res) => {
  try {
    const { keys } = req.body;

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return makeErrorResponse({
        res,
        message: "Keys must be a non-empty array",
      });
    }

    const foundKeys = [];
    for (const key of keys) {
      const value = cache.get(key);
      if (value) {
        foundKeys.push({ key, ...value });
      }
    }

    if (foundKeys.length === 0) {
      return makeSuccessResponse({
        res,
        message: "No matching keys found",
        data: [],
      });
    }

    return makeSuccessResponse({
      res,
      message: "Get keys by list success",
      data: foundKeys,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const putPublicKey = async (req, res) => {
  try {
    const { key, publicKey } = req.body;

    if (!key || !publicKey) {
      return makeErrorResponse({
        res,
        message: "Both key and publicKey are required",
      });
    }

    const existingData = cache.get(key);

    if (!existingData) {
      return makeErrorResponse({
        res,
        message: "Key not found",
      });
    }

    cache.set(key, { ...existingData, publicKey }, { noUpdateTTL: true });

    return makeSuccessResponse({
      res,
      message: "Public key updated successfully",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getPublicKey = async (req, res) => {
  try {
    const key = req.params.key;

    const data = cache.get(key);

    if (!data || !data.publicKey) {
      return makeErrorResponse({
        res,
        data: { publicKey: null },
        message: "Public key not found for the given key",
      });
    }

    return makeSuccessResponse({
      res,
      message: "Get public key success",
      data: { publicKey: data.publicKey },
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export {
  putKey,
  getKey,
  removeKey,
  checkSession,
  getKeysByPattern,
  removeKeysByPattern,
  resetCache,
  getAllKeys,
  getMultiKeys,
  putPublicKey,
  getPublicKey,
};
