/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { ENV, LOCAL_STORAGE, SOCKET_CMD } from "../types/constant";
import { getStorageData } from "../services/storages";

type EventHandler = (...args: any[]) => void;

const useSocket = () => {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const token = getStorageData(LOCAL_STORAGE.ACCESS_TOKEN, null);
    if (token) {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
      }

      const socket = io(ENV.MSA_NODEJS_API_URL);

      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit(SOCKET_CMD.CMD_CLIENT_PING, { token });

        socket.on(SOCKET_CMD.CMD_CLIENT_PING, (res) => {});
      });

      socket.on("disconnect", () => {});

      socket.on("connect_error", (err) => {});
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  const emit = useCallback((event: string, payload?: any) => {
    socketRef.current?.emit(event, payload);
  }, []);

  const on = useCallback((event: string, handler: EventHandler) => {
    socketRef.current?.on(event, handler);
  }, []);

  const off = useCallback((event: string, handler?: EventHandler) => {
    socketRef.current?.off(event, handler);
  }, []);

  return { emit, on, off };
};

export default useSocket;
