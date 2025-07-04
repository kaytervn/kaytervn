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

      const socket = io(ENV.MSA_API_URL);

      socketRef.current = socket;

      socket.on("connect", () => {
        // console.log("Socket connected:", socket.id);

        socket.emit(SOCKET_CMD.CLIENT_PING, { token });

        socket.on(SOCKET_CMD.CLIENT_PING, (res) => {
          // console.log(res.message);
        });
      });

      socket.on("disconnect", () => {
        // console.log("Socket disconnected");
      });

      socket.on("connect_error", (err) => {
        // console.error("Socket connect error:", err.message);
      });
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        // console.log("Socket disconnected due to missing token");
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
