import express from "express";
import cors from "cors";
import {
  CONFIG_KEY,
  CORS_OPTIONS,
  JSON_LIMIT,
  LIMITER,
  RELOAD_INTERVAL,
} from "./utils/constant.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { reloadWebsite } from "./utils/cron.js";
import {
  checkSystemReady,
  encryptResponseMiddleware,
  verifySignature,
} from "./middlewares/auth.js";
import { keyRouter } from "./routes/keyRouter.js";
import { getConfigValue, initKey } from "./config/appProperties.js";
import { setupSocket } from "./config/socketHandler.js";
import { userRouter } from "./routes/userRouter.js";
import { platformRouter } from "./routes/platformRouter.js";
import { swaggerDocs, swaggerUi } from "./config/swaggerConfig.js";
import { mediaRouter } from "./routes/mediaRouter.js";
import { categoryRouter } from "./routes/categoryRouter.js";
import { lessonRouter } from "./routes/lessonRouter.js";
import { cloudinaryRouter } from "./routes/cloudinaryRouter.js";
import { linkGroupRouter } from "./routes/linkGroupRouter.js";
import { accountRouter } from "./routes/accountRouter.js";
import { backupCodeRouter } from "./routes/backupCodeRouter.js";
import { idNumberRouter } from "./routes/idNumberRouter.js";
import { bankNumberRouter } from "./routes/bankNumberRouter.js";
import { bankRouter } from "./routes/bankRouter.js";
import { linkRouter } from "./routes/linkRouter.js";
import { noteRouter } from "./routes/noteRouter.js";
import { softwareRouter } from "./routes/softwareRouter.js";
import { dataBackupRouter } from "./routes/dataBackupRouter.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: CORS_OPTIONS });

app.use(cors(CORS_OPTIONS));
app.use(express.json({ limit: JSON_LIMIT }));

app.use(LIMITER);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/v1/key", keyRouter);
app.use(checkSystemReady);
// N Lessons API
app.use("/v1/cloudinary", cloudinaryRouter);
app.use("/v1/media", mediaRouter);
app.use("/v1/category", categoryRouter);
app.use("/v1/lesson", lessonRouter);
app.use(verifySignature);
app.use(encryptResponseMiddleware);
// MSA API
app.use("/v1/user", userRouter);
app.use("/v1/platform", platformRouter);
app.use("/v1/link-group", linkGroupRouter);
app.use("/v1/account", accountRouter);
app.use("/v1/backup-code", backupCodeRouter);
app.use("/v1/id-number", idNumberRouter);
app.use("/v1/bank-number", bankNumberRouter);
app.use("/v1/bank", bankRouter);
app.use("/v1/link", linkRouter);
app.use("/v1/note", noteRouter);
app.use("/v1/software", softwareRouter);
app.use("/v1/data-backup", dataBackupRouter);

const PORT = getConfigValue(CONFIG_KEY.PORT) || 6676;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

initKey();
setupSocket(io);
setInterval(reloadWebsite, RELOAD_INTERVAL);
export { io };
