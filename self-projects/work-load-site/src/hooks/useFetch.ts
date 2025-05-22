/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-case-declarations */
import { useState, useCallback } from "react";
import { getStorageData, removeSessionCache } from "../services/storages";
import {
  API_HEADER,
  AUTH_TYPE,
  BASIC_MESSAGES,
  ENV,
  LOCAL_STORAGE,
  METHOD,
} from "../types/constant";
import { useGlobalContext } from "../components/config/GlobalProvider";
import { getAuthHeader } from "../types/utils";
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
  const { refreshSessionTimeout, setIsUnauthorized } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const handleFetch = useCallback(async (options: FetchOptions) => {
    setLoading(true);

    try {
      const { timestamp, messageSignature } = getAuthHeader();
      const url = `${options.apiUrl}${options.endpoint}`;
      const headers: Record<string, string> = {
        ...options.headers,
        [`${API_HEADER.MESSAGE_SIGNATURE}`]:
          encryptClientField(messageSignature),
        [`${API_HEADER.TIMESTAMP}`]: encryptClientField(timestamp),
      };

      switch (options.authType) {
        case AUTH_TYPE.BEARER:
          const token = getStorageData(LOCAL_STORAGE.ACCESS_TOKEN);
          if (token) {
            headers[API_HEADER.AUTHORIZATION] = `Bearer ${encryptClientField(
              token
            )}`;
          }
          break;
        case AUTH_TYPE.BASIC:
          const encodedCredentials = btoa(
            `${ENV.CLIENT_ID}:${ENV.CLIENT_SECRET}`
          );
          headers[API_HEADER.AUTHORIZATION] = `Basic ${encryptClientField(
            encodedCredentials
          )}`;
          break;
        case AUTH_TYPE.NONE:
        default:
          break;
      }

      if (!(options.payload instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(url, {
        method: options.method,
        headers,
        body:
          options.method !== METHOD.GET && options.payload
            ? options.payload instanceof FormData
              ? options.payload
              : JSON.stringify(options.payload)
            : undefined,
      });

      const contentDisposition = response.headers.get("content-disposition");
      const isFileDownload = contentDisposition
        ?.toLowerCase()
        .includes("attachment");

      if (isFileDownload) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        const filename = contentDisposition
          ?.split("filename=")[1]
          ?.replace(/"/g, "");

        if (!filename) {
          return {
            result: false,
            message: "File downloaded failed",
          };
        }

        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { result: true, message: "File downloaded successfully" };
      } else {
        const contentType = response.headers.get("content-type")?.toLowerCase();
        const data = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();

        if (response.status === 401) {
          removeSessionCache();
          setIsUnauthorized(true);
        } else {
          refreshSessionTimeout();
        }

        return data;
      }
    } catch (err: any) {
      return { result: false, message: err.message || BASIC_MESSAGES.FAILED };
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
    }

    return handleFetch(options);
  };

  return {
    fetchApi,
    loading,
  };
};

export default useFetch;
