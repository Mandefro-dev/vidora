//videoRoutes
import express from "express";
const videoRouter = express.Router();
import { streamVideo } from "../controllers/videoController.js";
videoRouter.get("/stream", streamVideo);

export default videoRouter;
