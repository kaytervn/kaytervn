const users = new Map();
const rooms = new Map();

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    const clientId = socket.id;
    console.log(`Client connected: ${clientId}`);
    users.set(clientId, null);

    socket.on("disconnect", () => {
      const room = users.get(clientId);
      if (room) {
        console.log(`Client disconnected: ${clientId} from room: ${room}`);
        users.delete(clientId);
        io.to(room).emit("userDisconnected", clientId);
        printLog("disconnect", clientId, room);
      }
    });

    socket.on("joinRoom", (room) => {
      const clientsInRoom = io.sockets.adapter.rooms.get(room)?.size || 0;
      if (clientsInRoom === 0) {
        socket.join(room);
        socket.emit("created", room);
        users.set(clientId, room);
        rooms.set(room, clientId);
      } else if (clientsInRoom === 1) {
        socket.join(room);
        socket.emit("joined", room);
        users.set(clientId, room);
        socket.emit("setCaller", rooms.get(room));
      } else {
        socket.emit("full", room);
      }
      printLog("joinRoom", clientId, room);
    });

    socket.on("ready", (room) => {
      io.to(room).emit("ready", room);
      printLog("ready", clientId, room);
    });

    socket.on("candidate", (payload) => {
      const { room } = payload;
      io.to(room).emit("candidate", payload);
      printLog("candidate", clientId, room);
    });

    socket.on("offer", (payload) => {
      const { room, sdp } = payload;
      io.to(room).emit("offer", sdp);
      printLog("offer", clientId, room);
    });

    socket.on("answer", (payload) => {
      const { room, sdp } = payload;
      io.to(room).emit("answer", sdp);
      printLog("answer", clientId, room);
    });

    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      printLog("leaveRoom", clientId, room);
    });
  });

  const printLog = (header, clientId, room) => {
    if (!room) return;
    const clientsInRoom = io.sockets.adapter.rooms.get(room)?.size || 0;
    console.log(
      `#ConnectedClients - ${header} => room: ${room}, count: ${clientsInRoom}`
    );
  };
};

export { setupSocket };
