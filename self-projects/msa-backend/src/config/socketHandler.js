import { SOCKET_CMD } from "../utils/constant.js";
import {
  handleSendMsgInvalidToken,
  socketSuccessResponse,
} from "../services/socketService.js";
import { isValidSession } from "../services/cacheService.js";
import { decodeToken } from "../services/jwtService.js";
import CaroGame from "./caroGame.js";

const game = new CaroGame();
const ACTIVE_SESSIONS = new Map(); // username - socket.id

const getActiveSessions = () => {
  return ACTIVE_SESSIONS;
};

const handleClearClientSessions = (socket) => {
  for (const [username, id] of ACTIVE_SESSIONS.entries()) {
    if (id === socket.id) {
      ACTIVE_SESSIONS.delete(username);
      break;
    }
  }
};

const clientPingHandler = (io, socket) => {
  socket.on(SOCKET_CMD.CLIENT_PING, (msg) => {
    try {
      const { username, sessionId } = decodeToken(msg.token);
      if (username) {
        if (!isValidSession(username, sessionId)) {
          handleSendMsgInvalidToken(socket);
        }
        ACTIVE_SESSIONS.set(username, socket.id);
        socket.join(username);
        io.to(username).emit(
          SOCKET_CMD.CLIENT_PING,
          socketSuccessResponse({
            message: "Ping success with username: " + username,
          })
        );
      } else {
        handleSendMsgInvalidToken(socket);
      }
    } catch {
      handleSendMsgInvalidToken(socket);
    }
  });
};

const caroGameHandler = (io, socket) => {
  game.players.add(socket.id);

  socket.emit("game-state", {
    board: game.gameState,
    currentPlayer: game.currentPlayer,
    gameActive: game.gameActive,
  });

  socket.on("make-move", ({ index, player }) => {
    const result = game.makeMove(index, player, socket.id);

    if (result.success) {
      io.emit("move-made", {
        index,
        player,
        currentPlayer: game.currentPlayer,
        gameActive: game.gameActive,
      });

      if (result.gameOver) {
        io.emit("game-over", {
          winner: player,
          winningCells: result.winningCells,
        });
      }
    }
  });

  socket.on("restart-game", () => {
    game.resetGame();
    io.emit("game-reset", {
      board: game.gameState,
      currentPlayer: game.currentPlayer,
      gameActive: game.gameActive,
    });
  });
};

const setupSocket = (io) => {
  // io.use(socketAuth);
  io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);

    clientPingHandler(io, socket);
    caroGameHandler(io, socket);

    socket.on("disconnect", () => {
      console.log("Socket disconnected: ", socket.id);
      game.players.delete(socket.id);
      handleClearClientSessions(socket);
    });
  });
};

export { setupSocket, getActiveSessions };
