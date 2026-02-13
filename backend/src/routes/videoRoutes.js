//videoRoutes
import express from "express";
const videoRouter = express.Router();
import { streamVideo, getAllVideos } from "../controllers/videoController.js";
import { uploadVideo } from "../controllers/uploadController.js";

videoRouter.get("/stream", streamVideo);
videoRouter.post("/upload", uploadVideo);
videoRouter.get("/videos", getAllVideos);

export default videoRouter;
