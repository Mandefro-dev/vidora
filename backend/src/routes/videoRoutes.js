//videoRoutes
import express from "express";
const videoRouter = express.Router();
import { streamVideo } from "../controllers/videoController.js";
import { uploadVideo } from "../controllers/uploadController.js";

videoRouter.get("/stream", streamVideo);
videoRouter.post("/upload", uploadVideo);

export default videoRouter;
