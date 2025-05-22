import { on } from "events";
import { useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";

interface UseSocketNotificationProps {
  userId?: string;
  remoteUrl: string;
  onNewNotification: () => void;
  
}

export const useSocketNotification = ({

  userId,
  remoteUrl,
  onNewNotification
}: UseSocketNotificationProps) => {
  const socketRef = useRef<Socket | null>(null);

  const initializeSocket = useCallback(() => {
    const socket = io(remoteUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socket.on("connect", () => {
      console.log("Socket.IO Connected");
      
      if (userId) {
        socket.emit("JOIN_USER", userId);
        socket.emit("JOIN_NOTIFICATION", userId);
      }
    });

    socket.on("disconnect", (reason: any) => {
      console.log("Socket.IO Disconnected:", reason);
    });

  

    socket.on("NEW_NOTIFICATION", () => {
    console.log("bat soket")
      if (onNewNotification) {
        onNewNotification();
      }
    });

    socketRef.current = socket;

    return () => {
      if (socketRef.current) {
       
        if (userId) {
          socket.emit("LEAVE_USER", userId);
        }
        socket.disconnect();
      }
    };
  }, [
  
    userId,
    remoteUrl,
 
  ]);

  useEffect(() => {
    const cleanup = initializeSocket();
    return cleanup;
  }, [initializeSocket]);

  return socketRef.current;
};

export default useSocketNotification;
