import express from "express";
import { usersRoutes } from "./routes/usersRoutes.js";
import { authsRoutes } from "./routes/authsRoutes.js";
import mongoose from "mongoose";
import passport from "./passport.js";
import cors from "cors";
import cookieSession from "cookie-session";
import { coursesRoutes } from "./routes/coursesRoutes.js";
import { cartsRoutes } from "./routes/cartsRouter.js";
import { lessonsRoutes } from "./routes/lessonsRoutes.js";
import { documentsRoutes } from "./routes/documentsRoutes.js";
import { commentsRoutes } from "./routes/commentsRoutes.js";
import { invoicesRoutes } from "./routes/invoicesRoutes.js";
import { reviewsRoutes } from "./routes/reviewsRoutes.js";
import { invoiceItemsRoutes } from "./routes/invoiceItemsRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import job from "./utils/cron.js";
import dotenv from "dotenv";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: ["key1"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "200mb" }));

app.use("/api/users", usersRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/invoiceItems", invoiceItemsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/auth", authsRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/client/dist/index.html"))
);

// job.start();

// Connect to the MongoDB database
mongoose
  .connect(process.env.MONGODB_URI, { dbName: "db_cookiedu" })
  .then(() => {
    console.log("Connected to the database");
    app.listen(process.env.PORT, () => {
      console.log("Listening on port 5000");
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database: ", error);
  });
