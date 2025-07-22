import { getActiveSessions } from "../config/socketHandler.js";
import { ERROR_CODE, SOCKET_CMD } from "../utils/constant.js";
import { io } from "../index.js";
import { removeKey } from "./cacheService.js";

const socketErrorResponse = ({ code, message, data }) => {
  return { result: false, code, message, data };
};

const socketSuccessResponse = ({ message, data }) => {
  return { result: true, message, data };
};

const handleSendMsgInvalidToken = (socket) => {
  socket.emit(
    SOCKET_CMD.CMD_LOCK_DEVICE,
    socketErrorResponse({
      code: ERROR_CODE.INVALID_TOKEN,
      message: "Invalid token",
    })
  );
};

const handleSendMsgLockDevice = (username) => {
  removeKey(username);
  const oldSocketId = getActiveSessions().get(username);
  if (oldSocketId) {
    io.to(oldSocketId).emit(
      SOCKET_CMD.CMD_LOCK_DEVICE,
      socketErrorResponse({
        code: ERROR_CODE.INVALID_SESSION,
        message: "Invalid session",
      })
    );
    io.sockets.sockets.get(oldSocketId)?.leave(username);
  }
};

export {
  socketErrorResponse,
  socketSuccessResponse,
  handleSendMsgInvalidToken,
  handleSendMsgLockDevice,
};
