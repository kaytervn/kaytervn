/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useCallback, useState } from "react";
import { getStorageData } from "../services/storages";
import { useGlobalContext } from "../components/config/GlobalProvider";
import {
  ENV,
  LOCAL_STORAGE,
  PING_INTERVAL,
  SOCKET_CMD,
} from "../types/constant";
import {
  decryptClientField,
  encryptClientField,
} from "../services/encryption/clientEncryption";

const useWebSocket = () => {
  const { isUnauthorized } = useGlobalContext();
  const [message, setMessage] = useState<any>(null);
  const ws = useRef<WebSocket | null>(null);
  const pingInterval = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  const getToken = () => getStorageData(LOCAL_STORAGE.ACCESS_TOKEN);

  const cleanup = useCallback(() => {
    ws.current?.close();
    ws.current = null;
    pingInterval.current && clearInterval(pingInterval.current);
    pingInterval.current = null;
    reconnectTimeout.current && clearTimeout(reconnectTimeout.current);
    reconnectTimeout.current = null;
  }, []);

  const sendMessage = useCallback((msg: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const request = encryptClientField(JSON.stringify(msg));
      ws.current.send(JSON.stringify({ request }));
      return true;
    }
    return false;
  }, []);

  const pingServer = useCallback(() => {
    const token = getToken();
    if (!token || !ws.current || ws.current.readyState !== WebSocket.OPEN)
      return;

    sendMessage({
      cmd: SOCKET_CMD.CMD_CLIENT_PING,
      token,
    });
  }, [sendMessage]);

  const initializeWebSocket = useCallback(() => {
    const token = getToken();
    if (!token) return;

    const socket = new WebSocket(ENV.MSA_SOCKET_URL);
    ws.current = socket;

    socket.onopen = () => {
      pingServer();
      pingInterval.current = setInterval(pingServer, PING_INTERVAL);
    };

    socket.onmessage = (event) => {
      try {
        const { response } = JSON.parse(event.data);
        setMessage(JSON.parse(decryptClientField(response) || ""));
      } catch (error) {
        console.error("WebSocket message parsing error:", error);
        setMessage(null);
      }
    };

    socket.onclose = () => {
      cleanup();
      if (isMounted.current && !isUnauthorized) {
        reconnectTimeout.current = setTimeout(connect, 2000);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      socket.close();
    };
  }, [isUnauthorized]);

  const connect = useCallback(() => {
    if (!isMounted.current || ws.current || isUnauthorized) return;
    cleanup();
    initializeWebSocket();
  }, [isUnauthorized]);

  useEffect(() => {
    isMounted.current = true;

    if (isUnauthorized) {
      cleanup();
    } else {
      connect();
    }

    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, [isUnauthorized, connect, cleanup]);

  return { message, sendMessage };
};

export default useWebSocket;
