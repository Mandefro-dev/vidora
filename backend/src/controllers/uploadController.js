import { handleFileUpload } from "../services/uploadService.js";
import { v4 as uuidv4 } from "uuid";
import { convertToHLS } from "../services/transcodeService.js";
import { addVideo, updateVideoStatus } from "../services/dbService.js";
import path from "path";
import { title } from "process";

export const uploadVideo = async (req, res) => {
  try {
    if (
      !req.headers["content-type"] ||
      !req.headers["content-type"].includes("multipart/form-data")
    ) {
      return res
        .status(400)
        .json({ error: "Content-Type must be multipart/form-data" });
    }

    console.log("Starting upload stream...");
    const result = await handleFileUpload(req);

    const videoId = uuidv4();
    console.log(`Generating video ID: ${videoId}`);

    const hlsUrl = `http://localhost:8000/hls/${videoId}/index.m3u8`;
    const newVideo = {
      id: videoId,
      title: result.file.replace("raw-", "").replace(".mp4", ""),
      status: "processing",
      url: hlsUrl,
      createdAt: new Date().toISOString(),
    };
    await addVideo(newVideo);

    res.status(202).json({
      message: "Upload complete. HLS processing started in background.",
      ...newVideo,
    });

    (async () => {
      try {
        console.log(`[Background] Starting HLS Factory for: ${videoId}`);
        const inputPath = result.path;

        await convertToHLS(inputPath, videoId);
        await updateVideoStatus(videoId, "ready");

        console.log(`[Background] HLS conversion finished for: ${videoId}`);
      } catch (error) {
        console.error(`[Background] HLS failed for ${videoId}:`, error.message);
        await updateVideoStatus(videoId, "failed");
      }
    })();
  } catch (error) {
    console.error("Upload Controller error:", error.message);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Upload Failed",
        details: error.message,
      });
    }
  }
};
