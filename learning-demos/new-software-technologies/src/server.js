import express from "express";
import dotenv from "dotenv";
import { usersRoutes } from "./routes/userRoute.js";
dotenv.config();

const app = express();
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/v1/user", usersRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server is listening at port: ${port}`));
