import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

import videoRouter from "./routes/videoRoutes.js";
import config from "./config/index.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    // ADD Range and Accept to allowed headers
    allowedHeaders: ["Content-Type", "Range", "Accept"],
    //  range headers so the frontend player can read them
    exposedHeaders: [
      "Content-Range",
      "Accept-Ranges",
      "Content-Length",
      "Content-Type",
    ],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  console.log(`Incoming request ${req.method} ${req.url}`);
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to mongoDB.");
  })
  .catch((error) => console.error("Mongodb connection error", error.message));

app.use("/hls", express.static(path.join(__dirname, "../uploads/hls")));

app.use(
  "/processed",
  express.static(path.join(__dirname, "../uploads/processed")),
);

app.use("/api", videoRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/assets/index.html"));
});

app.listen(config.port, () => {
  console.log(`running on port ${config.port}`);
});
