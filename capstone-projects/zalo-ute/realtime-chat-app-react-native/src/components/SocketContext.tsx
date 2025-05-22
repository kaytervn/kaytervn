import React, { createContext, useContext, useState, ReactNode } from "react";

import { Socket } from "socket.io-client";

const SocketContext = createContext<{
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}>({
  socket: null,
  setSocket: () => {},
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
