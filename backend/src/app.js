import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import videoRouter from "./routes/videoRoutes.js";
import config from "./config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use((req, res, next) => {
  console.log(`Incoming request ${req.method} ${req.url}`);
  next();
});

app.use("/api", videoRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/assets/index.html"));
});

app.listen(config.port, () => {
  console.log(`running on port ${config.port}`);
});
