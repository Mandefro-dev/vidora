//controlelr
import fs from "fs";
import { getFileStats, calculateRange } from "../services/streamService.js";
import config from "../config/index.js";

export const streamVideo = async (req, res) => {
  const range = req.headers.range;
  const videoPath = config.videoPath;

  try {
    const videoStats = await getFileStats(videoPath);
    const fileSize = videoStats.size;

    const { start, end, contentLength } = calculateRange(
      range,
      fileSize,
      config.chunkSize,
    );
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);

    videoStream.on("error", (streamErr) => {
      console.error("Stream Error:", streamErr);
      res.end(streamErr);
    });
  } catch (error) {
    console.error("Controller error", error.message);
    res.status(500).send("Internal server error");
  }
};
