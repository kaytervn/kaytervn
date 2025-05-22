import { useState, useCallback } from "react";
import { remoteUrl } from "../types/constant";

interface FetchOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
}

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(
    async (endpoint: string, options: FetchOptions) => {
      setLoading(true);
      setError(null);

      try {
        const accessToken = await localStorage.getItem("accessToken");
        let url = `${remoteUrl}${endpoint}`;
        const headers: Record<string, string> = {
          Authorization: `Bearer ${accessToken}`,
          ...options.headers,
        };

        if (!(options.body instanceof FormData)) {
          headers["Content-Type"] = "application/json";
        }

        const response = await fetch(url, {
          method: options.method,
          headers,
          body:
            options.method !== "GET" && options.body
              ? options.body instanceof FormData
                ? options.body
                : JSON.stringify(options.body)
              : undefined,
        });

        const contentType = response.headers.get("content-type");
        const data = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();
        return data;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createMethod =
    (method: FetchOptions["method"]) =>
    (endpoint: string, bodyOrParams?: any) => {
      let queryString = "";
      if (method === "GET" && bodyOrParams) {
        queryString = `?${new URLSearchParams(bodyOrParams).toString()}`;
      }

      return fetchData(endpoint + queryString, {
        method,
        body: method !== "GET" ? bodyOrParams : undefined,
      });
    };

  return {
    get: createMethod("GET"),
    post: createMethod("POST"),
    put: createMethod("PUT"),
    del: createMethod("DELETE"),
    loading,
    error,
  };
};

export default useFetch;
