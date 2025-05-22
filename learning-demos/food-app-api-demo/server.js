import express from "express";
import mongoose from "mongoose";
import { foodsRoutes } from "./routes/foodsRoutes.js";
import { usersRoutes } from "./routes/usersRoutes.js";
import job from "./utils/cron.js";
import { Server } from "socket.io";

const app = express();
app.use(express.json({ limit: "200mb" }));
app.use("/api/foods", foodsRoutes);
app.use("/api/users", usersRoutes);
// job.start();

const server = app.listen(4000, () => console.log("Listening at 4000"));

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("turnOn", () => {
    console.log("Turned on");
    io.emit("lightOn");
  });
  socket.on("turnOff", () => {
    console.log("Turned off");
    io.emit("lightOff");
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

mongoose
  .connect("mongodb+srv://admin:123@foodappapi.v74oqco.mongodb.net/", {
    dbName: "foodapp",
  })
  .then(() => {
    console.log("Successfully connect to DB");
  })
  .catch((err) => console.log(err));
