import express from "express";
import mongoose from "mongoose";
import { postsRoutes } from "./routes/postsRoutes.js";
import { usersRoutes } from "./routes/usersRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({ limit: "200mb" }));

app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);
app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/client/dist/index.html"))
);
mongoose
  .connect(process.env.DB_URI, { dbName: "demo_db" })
  .then(() => {
    console.log("Successfully connect to DB");
    app.listen(4000, () => console.log("Listening at 4000"));
  })
  .catch((err) => console.log(err));
