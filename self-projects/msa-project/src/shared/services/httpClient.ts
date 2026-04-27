import { minimatch } from "minimatch";
import { jwtDecode } from "jwt-decode";
import type { ApiResponse, FetchOptions } from "@/shared/types/api.types";
import type { JwtPayload } from "@/shared/types/common.types";
import { ENV } from "@/shared/types/env.types";
import {
  AUTH_TYPE,
  API_HEADER,
  LOCAL_STORAGE,
  METHOD,
} from "@/shared/constants";
import {
  encryptClientField,
  decryptClientField,
} from "./encryption/clientEncryption";
import { encryptAES, generateMd5, zipString } from "@/shared/utils/crypto";
import {
  formatJavaDate,
  generateRandomString,
  generateTimestamp,
} from "@/shared/utils/format";
import { getErrorMessage } from "@/shared/utils/validation";
import { getStorageData, isValidJWT, removeSessionCache } from "./storage";

/**
 * Endpoints excluded from request/response encryption.
 * Uses glob patterns matched by minimatch.
 */
const NOT_ENCRYPT_ENDPOINTS = ["/v1/cloudinary/**"];

const DELIM = "|";

/** Build an encrypted authorization header: encryptClientField(nonce|authValue) */
const buildAuthHeader = (nonce: string, authValue: string): string | null => {
  return encryptClientField([nonce, authValue].join(DELIM));
};

/** Decrypt a response payload: strip nonce prefix after decryption */
const decryptResponse = (encrypted: string | undefined): string | null => {
  if (!encrypted) return null;
  try {
    const data = decryptClientField(encrypted);
    if (!data) return null;
    return data.split(DELIM)[1] ?? null;
  } catch {
    return null;
  }
};

/**
 * Determine if an endpoint should be encrypted based on exclusion patterns.
 */
const shouldEncrypt = (endpoint: string): boolean => {
  return !NOT_ENCRYPT_ENDPOINTS.some((pattern) => minimatch(endpoint, pattern));
};

/**
 * Filter payload: remove null/undefined values.
 * For GET requests, also remove empty strings.
 */
const filterPayload = (
  payload: Record<string, unknown>,
  isGet: boolean,
): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (value === null || value === undefined) return false;
      if (isGet && typeof value === "string" && value.trim() === "")
        return false;
      return true;
    }),
  );
};

/**
 * Core HTTP client with built-in encryption layer.
 *
 * All encryption/decryption (AES payload, RSA headers, message signatures)
 * is handled transparently — callers only pass/receive clean data.
 *
 * @param onUnauthorized - callback invoked on 401 responses
 * @param onSessionRefresh - callback invoked on successful (non-401) responses
 */
export async function httpClient(
  options: FetchOptions,
  onUnauthorized?: () => void,
  onSessionRefresh?: () => void,
): Promise<ApiResponse> {
  // Clone options to avoid mutation
  let { endpoint } = options;
  let payload = options.payload;
  const isFormData = payload instanceof FormData;
  const isGet = options.method === METHOD.GET;

  // Filter and prepare payload
  if (payload && !isFormData) {
    payload = filterPayload(payload as Record<string, unknown>, isGet);
  }

  // For GET: convert payload to query string
  if (isGet && payload && !isFormData) {
    const queryString = new URLSearchParams(
      payload as Record<string, string>,
    ).toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
    payload = undefined;
  }

  // --- Security parameters ---
  const nonce = generateTimestamp();
  const fingerSecret = generateRandomString(9);
  const clientRequestId = generateRandomString(16);
  const timestamp = formatJavaDate(new Date());
  const apiKey = generateMd5(timestamp + ENV.API_KEY + fingerSecret);

  // Build fingerprint from token (if bearer auth)
  const token = getStorageData(LOCAL_STORAGE.ACCESS_TOKEN);
  let fingerprint: string | null;
  if (isValidJWT(token) && options.authType === AUTH_TYPE.BEARER) {
    const decoded = jwtDecode<JwtPayload>(token);
    fingerprint = zipString(
      [decoded.user_id, fingerSecret, decoded.username].join(DELIM),
    );
  } else {
    fingerprint = zipString(fingerSecret);
  }

  try {
    const url = `${options.apiUrl}${endpoint}`;
    const isEncryptedEndpoint = shouldEncrypt(options.endpoint);

    // --- Encrypt payload ---
    let finalPayload = payload;
    let messageSignature: string | undefined;

    if (isEncryptedEndpoint) {
      if (isFormData) {
        messageSignature = generateMd5(
          timestamp + clientRequestId + ENV.CLIENT_KEY,
        );
      } else {
        const rawBody = finalPayload ? JSON.stringify(payload) : "";
        const encryptedPayload = encryptAES(clientRequestId, rawBody);
        finalPayload = { request: encryptedPayload };
        messageSignature = generateMd5(
          timestamp + rawBody + clientRequestId + ENV.CLIENT_KEY,
        );
      }
    }

    // --- Build headers ---
    const headers: Record<string, string> = {
      ...options.headers,
      ...(isEncryptedEndpoint && messageSignature
        ? {
            [API_HEADER.MESSAGE_SIGNATURE]:
              encryptClientField(messageSignature) ?? "",
            [API_HEADER.TIMESTAMP]: encryptClientField(timestamp) ?? "",
            [API_HEADER.CLIENT_REQUEST_ID]:
              encryptClientField(clientRequestId) ?? "",
            [API_HEADER.X_API_KEY]: encryptClientField(apiKey) ?? "",
            [API_HEADER.X_FINGERPRINT]:
              encryptClientField(fingerprint ?? "") ?? "",
          }
        : {}),
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    };

    // Auth header
    switch (options.authType) {
      case AUTH_TYPE.BEARER: {
        if (isValidJWT(token)) {
          const authVal = buildAuthHeader(nonce, `Bearer ${token}`);
          if (authVal) headers[API_HEADER.AUTHORIZATION] = authVal;
        }
        break;
      }
      case AUTH_TYPE.BASIC: {
        const credentials = btoa(`${ENV.CLIENT_ID}:${ENV.CLIENT_SECRET}`);
        const authVal = buildAuthHeader(nonce, `Basic ${credentials}`);
        if (authVal) headers[API_HEADER.AUTHORIZATION] = authVal;
        break;
      }
    }

    // --- Fetch ---
    const response = await fetch(url, {
      method: options.method,
      headers,
      body:
        options.method !== METHOD.GET && finalPayload
          ? isFormData
            ? (finalPayload as FormData)
            : JSON.stringify(finalPayload)
          : undefined,
    });

    // --- Handle file download ---
    const disposition = response.headers
      .get("content-disposition")
      ?.toLowerCase();
    if (disposition?.includes("attachment")) {
      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = disposition.split("filename=")[1]?.replace(/"/g, "");
      if (!filename) return { result: false, message: "File download failed" };

      link.href = urlBlob;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);
      return { result: true, message: "File downloaded successfully" };
    }

    // --- Parse response ---
    const contentType = response.headers.get("content-type")?.toLowerCase();
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    // Handle 401
    if (response.status === 401) {
      removeSessionCache();
      onUnauthorized?.();
      return { result: false, message: "Unauthorized" };
    }

    // Refresh session on success
    onSessionRefresh?.();

    // --- Decrypt response ---
    try {
      const decrypted = decryptResponse(
        (responseData as { response?: string })?.response,
      );
      if (!decrypted) return responseData as ApiResponse;

      const res = JSON.parse(decrypted) as ApiResponse;
      if (!res.result) {
        return { ...res, message: getErrorMessage(res) };
      }
      return res;
    } catch {
      return responseData as ApiResponse;
    }
  } catch (err: unknown) {
    const errorObj = err as { code?: string; message?: string } | null;
    return {
      result: false,
      message: getErrorMessage(errorObj),
    };
  }
}
