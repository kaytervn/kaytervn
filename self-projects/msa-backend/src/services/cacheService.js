import { getLruCache } from "../config/appProperties.js";

const putKey = (key, session) => {
  const cache = getLruCache();
  cache.set(key, { session });
};

const getKey = (key) => {
  const cache = getLruCache();
  return cache.get(key);
};

const removeKey = (key) => {
  const cache = getLruCache();
  cache.delete(key);
};

const isValidSession = (key, session) => {
  try {
    const value = getKey(key);
    return value && value.session === session;
  } catch {
    return false;
  }
};

const putPublicKey = (key, publicKey) => {
  try {
    const cache = getLruCache();
    const existingData = getKey(key);
    if (!existingData) {
      return;
    }
    cache.set(key, { ...existingData, publicKey }, { noUpdateTTL: true });
  } catch {
    return;
  }
};

export { putKey, getKey, isValidSession, putPublicKey, removeKey };
