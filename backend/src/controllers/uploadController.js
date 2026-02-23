import { handleFileUpload } from "../services/uploadService.js";
import { v4 as uuidv4 } from "uuid";
import { convertToHLS } from "../services/transcodeService.js";
import { addVideo, updateVideoStatus } from "../services/dbService.js";
import { uploadDirectoryToS3 } from "../services/s3Service.js";
import fs from "fs";
import path from "path";
import { title } from "process";
import Video from "../models/Video.js";

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

    const newVideo = new Video({
      videoId: videoId,
      title: result.file.replace("raw-", "").replace(".mp4", ""),
      status: "processing",
      url: "",
      visibilty: "public",
    });
    await newVideo.save();

    res.status(202).json({
      message: "Upload complete. HLS processing started in background.",
      ...newVideo,
    });

    (async () => {
      try {
        console.log(`[Background] Starting HLS Factory for: ${videoId}`);
        const inputPath = result.path;

        await convertToHLS(inputPath, videoId);

        const hlsFolderPath = path.join(
          process.cwd(),
          "uploads",
          "hls",
          videoId,
        );
        const cloudUrl = await uploadDirectoryToS3(
          hlsFolderPath,
          `hls/${videoId}`,
        );

        await Video.findOneAndUpdate(
          { videoId: videoId },
          { status: "ready", url: cloudUrl },
        );

        console.log(`[DB] Video is Ready at Clould URL:${cloudUrl}`);
        fs.rmSync(result.path);
        fs.rmSync(hlsFolderPath, { recursive: true, force: true });
        console.log(`[Cleanup] Removed local files for: ${videoId}`);

        // await updateVideoStatus(videoId, "ready");

        console.log(`[Background] HLS conversion finished for: ${videoId}`);
      } catch (error) {
        console.error(`[Background] HLS failed for ${videoId}:`, error.message);
        // await updateVideoStatus(videoId, "failed");
        await Video.findOneAndUpdate(
          { videoId: videoId },
          { status: "failed" },
        );
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
