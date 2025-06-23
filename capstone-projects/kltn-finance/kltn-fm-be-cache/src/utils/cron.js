import cron from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { ACTIVE_SOCKET_INTERVAL, ENV } from "../static/constant.js";
import axios from "axios";
import io from "socket.io-client";
import WebSocket from "ws";

let mediaSocket = null;
let ws = null;

dayjs.extend(utc);
dayjs.extend(timezone);

const activeSocketMedia = () => {
  if (mediaSocket) {
    mediaSocket.disconnect();
    mediaSocket = null;
  }

  mediaSocket = io(ENV.SOCKET_MEDIA_URL, {
    secure: true,
    forceNew: true,
    reconnection: false,
  });

  mediaSocket.on("connect", () => {
    console.log(`[${ENV.SOCKET_MEDIA_URL}] Connected`);

    setTimeout(() => {
      mediaSocket?.disconnect();
      mediaSocket = null;
    }, ACTIVE_SOCKET_INTERVAL);
  });

  mediaSocket.on("disconnect", () => {
    console.log(`[${ENV.SOCKET_MEDIA_URL}] Disconnected`);
  });
};

const activeWebSocketService = () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }

  ws = new WebSocket(ENV.WEBSOCKET_URL);

  ws.on("open", () => {
    console.log(`[${ENV.WEBSOCKET_URL}] Connected`);

    setTimeout(() => {
      ws?.close();
    }, ACTIVE_SOCKET_INTERVAL);
  });

  ws.on("close", () => {
    console.log(`[${ENV.WEBSOCKET_URL}] Disconnected`);
  });
};

const activeCommonServices = () => {
  for (const url of ENV.APP_URLS) {
    axios
      .get(url)
      .then(() => {
        console.log(`[${url}] Reloaded`);
      })
      .catch(() => {
        console.error(`[${url}] Error reloading`);
      });
  }
};

const jobs = {
  // 1 minute
  activeService: new cron.CronJob("* * * * *", async () => {
    activeSocketMedia();
    activeWebSocketService();
    activeCommonServices();
  }),
};

const startAllJobs = () => {
  Object.values(jobs).forEach((job) => job.start());
  console.log("All cron jobs have been started.");
};

const reloadWebsite = () => {
  activeSocketMedia();
  activeWebSocketService();
  activeCommonServices();
};

export { jobs, startAllJobs, reloadWebsite };
