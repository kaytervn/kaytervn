import express from "express";
import dbConfig from "./configurations/dbConfig.js";
import "dotenv/config.js";
import cors from "cors";
import job from "./utils/cron.js";
import { swaggerDocs, swaggerUi } from "./configurations/swaggerConfig.js";
import { userRouter } from "./routes/userRouter.js";
import { roleRouter } from "./routes/roleRouter.js";
import { fileRouter } from "./routes/fileRouter.js";
import { permissionRouter } from "./routes/permissionRouter.js";
import { corsOptions } from "./static/constant.js";
import { postRouter } from "./routes/postRouter.js";
import { commentRouter } from "./routes/commentRouter.js";
import { conversationRouter } from "./routes/conversationRouter.js";
import { conversationMemberRouter } from "./routes/conversationMemberRouter.js";
import { friendshipRouter } from "./routes/friendshipRouter.js";
import { messageReactionRouter } from "./routes/messageReactionRouter.js";
import { messageRouter } from "./routes/messageRouter.js";
import { notificationRouter } from "./routes/notificationRouter.js";
import { postReactionRouter } from "./routes/postReactionRouter.js";
import { commentReactionRouter } from "./routes/commentReactionRouter.js";
import { storyViewRouter } from "./routes/storyViewRouter.js";
import { storyRouter } from "./routes/storyRouter.js";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { setupSocketHandlers } from "./utils/utils.js";
import { statisticRouter } from "./routes/StatisticRouter.js";
import { settingRouter } from "./routes/settingRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors(corsOptions));
app.use(express.json({ limit: "200mb" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/v1/user", userRouter);
app.use("/v1/role", roleRouter);
app.use("/v1/file", fileRouter);
app.use("/v1/permission", permissionRouter);
app.use("/v1/post", postRouter);
app.use("/v1/comment", commentRouter);
app.use("/v1/conversation", conversationRouter);
app.use("/v1/conversation-member", conversationMemberRouter);
app.use("/v1/friendship", friendshipRouter);
app.use("/v1/message-reaction", messageReactionRouter);
app.use("/v1/message", messageRouter);
app.use("/v1/notification", notificationRouter);
app.use("/v1/post-reaction", postReactionRouter);
app.use("/v1/comment-reaction", commentReactionRouter);
app.use("/v1/story-view", storyViewRouter);
app.use("/v1/story", storyRouter);
app.use("/v1/statistic", statisticRouter);
app.use("/v1/setting", settingRouter);

app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

job.start();

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
dbConfig();
setupSocketHandlers(io);

export { io };
