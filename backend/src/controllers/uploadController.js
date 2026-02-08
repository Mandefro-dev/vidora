import { handleFileUpload } from "../services/uploadService.js";
import { convertToMp4 } from "../services/transcodeService.js";
import path from "path";
export const uploadVideo = async (req, res) => {
  try {
    if (
      !req.headers["content-type"] ||
      !req.headers["content-type"].includes("multipart/form-data")
    ) {
      return res.status(400).json({
        error: "Content-Type must be multipart/form-data",
      });
    }

    console.log("starting upload stream...");

    const result = await handleFileUpload(req);
    res.status(202).json({
      message: "upload complete,processing video in background.",
      videoId: result.file,
    });
    const inputPath = result.path;
    const outputFileName = `processed-${Date.now()}`;

    try {
      console.log("Step 2: Starting Transcoding Factory...");
      const processedPath = await convertToMp4(inputPath, outputFileName);
      console.log("Video is ready at:", processedPath);
    } catch (error) {
      console.error("Background trasnscoding failed", error.message);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Upload Controller error..", error.message);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Upload Failed",
        details: error.message,
      });
    }
  }
};
