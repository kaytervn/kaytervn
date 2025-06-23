import express from "express";
import cors from "cors";
import { swaggerDocs, swaggerUi } from "./config/swaggerConfig.js";
import { corsOptions, ENV, RELOAD_INTERVAL } from "./static/constant.js";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { reloadWebsite } from "./utils/cron.js";
import { cacheRouter } from "./routes/cacheRouter.js";
import { mediaRouter } from "./routes/mediaRouter.js";
import { embeddingRouter } from "./routes/embeddingRouter.js";
import dbConfig from "./config/dbConfig.js";
import { geminiRouter } from "./routes/geminiRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const httpServer = createServer(app);

app.use(cors(corsOptions));
app.use(express.json({ limit: "1000mb" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/v1/cache", cacheRouter);
app.use("/v1/media", mediaRouter);
app.use("/v1/embedding", embeddingRouter);
app.use("/v1/gemini", geminiRouter);

app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

const PORT = ENV.SERVER_PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
dbConfig();
setInterval(reloadWebsite, RELOAD_INTERVAL);
