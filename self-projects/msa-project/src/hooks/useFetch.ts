/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from "react";
import useEncryption from "./useEncryption";
import { useGlobalContext } from "../config/GlobalProvider";
import {
  encryptAES,
  formatJavaDate,
  generateMd5,
  generateRandomString,
  generateTimestamp,
  zipString,
} from "../services/utils";
import {
  API_HEADER,
  AUTH_TYPE,
  ENV,
  LOCAL_STORAGE,
  METHOD,
  TEXT,
} from "../services/constant";
import { minimatch } from "minimatch";
import { jwtDecode } from "jwt-decode";
import {
  getStorageData,
  isValidJWT,
  removeSessionCache,
} from "../services/storages";
import { encryptClientField } from "../services/encryption/clientEncryption";

interface FetchOptions {
  apiUrl: string;
  endpoint: string;
  method: string;
  payload?: any;
  authType: string;
  headers?: Record<string, string>;
}

const useFetch = () => {
  const NOT_ENCRYPT_ENPOINTS = ["/v1/cloudinary/**"];
  const { refreshSessionTimeout, setIsUnauthorized } = useGlobalContext();
  const { getAuthHeader, clientDecryptIgnoreNonce } = useEncryption();
  const [loading, setLoading] = useState(false);

  const handleFetch = useCallback(async (options: FetchOptions) => {
    setLoading(true);

    const nonce = generateTimestamp();
    const fingerSecret = generateRandomString(9);
    const clientRequestId = generateRandomString(16);
    const timestamp = formatJavaDate(new Date());
    const apiKey = generateMd5(timestamp + ENV.API_KEY + fingerSecret);
    let messageSignature: string | undefined;
    let fingerprint: any;

    const token = getStorageData(LOCAL_STORAGE.ACCESS_TOKEN);
    if (isValidJWT(token) && AUTH_TYPE.BEARER === options.authType) {
      const decoded: any = jwtDecode(token);
      fingerprint = zipString(
        [decoded.user_id, fingerSecret, decoded.username].join("|")
      );
    } else {
      fingerprint = zipString(fingerSecret);
    }
    try {
      const url = `${options.apiUrl}${options.endpoint}`;
      const isFormData = options.payload instanceof FormData;
      const isEncryptedEndpoint = !NOT_ENCRYPT_ENPOINTS.some((pattern) =>
        minimatch(options.endpoint, pattern)
      );

      let finalPayload = options.payload;
      if (isEncryptedEndpoint) {
        if (isFormData) {
          messageSignature = generateMd5(
            timestamp + clientRequestId + ENV.CLIENT_KEY
          );
        } else {
          const rawBody = finalPayload ? JSON.stringify(options.payload) : "";
          const encryptedPayload = encryptAES(clientRequestId, rawBody);
          finalPayload = { request: encryptedPayload };
          messageSignature = generateMd5(
            timestamp + rawBody + clientRequestId + ENV.CLIENT_KEY
          );
        }
      }

      const headers: Record<string, any> = {
        ...options.headers,
        ...(isEncryptedEndpoint && {
          [API_HEADER.MESSAGE_SIGNATURE]: encryptClientField(messageSignature),
          [API_HEADER.TIMESTAMP]: encryptClientField(timestamp),
          [API_HEADER.CLIENT_REQUEST_ID]: encryptClientField(clientRequestId),
          [API_HEADER.X_API_KEY]: encryptClientField(apiKey),
          [API_HEADER.X_FINGERPRINT]: encryptClientField(fingerprint),
        }),
        ...(!isFormData && {
          "Content-Type": "application/json",
        }),
      };

      // Auth header
      switch (options.authType) {
        case AUTH_TYPE.BEARER: {
          if (isValidJWT(token)) {
            headers[API_HEADER.AUTHORIZATION] = getAuthHeader(
              nonce,
              `Bearer ${token}`
            );
          }
          break;
        }
        case AUTH_TYPE.BASIC: {
          const credentials = btoa(`${ENV.CLIENT_ID}:${ENV.CLIENT_SECRET}`);
          headers[API_HEADER.AUTHORIZATION] = getAuthHeader(
            nonce,
            `Basic ${credentials}`
          );
          break;
        }
      }

      // Fetch API
      const response = await fetch(url, {
        method: options.method,
        headers,
        body:
          options.method !== METHOD.GET && finalPayload
            ? isFormData
              ? finalPayload
              : JSON.stringify(finalPayload)
            : undefined,
      });

      const disposition = response.headers
        .get("content-disposition")
        ?.toLowerCase();
      const isFileDownload = disposition?.includes("attachment");
      if (isFileDownload) {
        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const filename = disposition?.split("filename=")[1]?.replace(/"/g, "");

        if (!filename)
          return { result: false, message: "File download failed" };

        link.href = urlBlob;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(urlBlob);

        return { result: true, message: "File downloaded successfully" };
      }

      // Handle JSON or text
      const contentType = response.headers.get("content-type")?.toLowerCase();
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      if (response.status === 401) {
        removeSessionCache();
        setIsUnauthorized(true);
      } else {
        refreshSessionTimeout();
      }

      // Decrypt response
      try {
        return JSON.parse(
          clientDecryptIgnoreNonce(responseData?.response) || ""
        );
      } catch {
        return responseData;
      }
    } catch (err: any) {
      return { result: false, message: err.message || TEXT.REQUEST_FAILED };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApi = (options: FetchOptions) => {
    if (options.payload && !(options.payload instanceof FormData)) {
      options.payload = Object.fromEntries(
        Object.entries(options.payload).filter(([_, value]: any) => {
          if (value === null || value === undefined) return false;
          if (
            options.method === METHOD.GET &&
            typeof value === "string" &&
            value.trim() === ""
          ) {
            return false;
          }
          return true;
        })
      );
    }
    if (options.method === METHOD.GET && options.payload) {
      const queryString = new URLSearchParams(
        options.payload as any
      ).toString();
      if (queryString) {
        options.endpoint += `?${queryString}`;
      }
      options.payload = null;
    }

    return handleFetch(options);
  };

  return {
    fetchApi,
    loading,
  };
};

export default useFetch;
