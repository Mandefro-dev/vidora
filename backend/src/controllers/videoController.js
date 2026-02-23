//controlelr
import fs from "fs";
import { getFileStats, calculateRange } from "../services/streamService.js";
import config from "../config/index.js";
import Video from "../models/Video.js";
import { getVideos } from "../services/dbService.js";

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
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: -1 });
    res.status(200).json(
      videos.map((vid) => ({
        id: vid.videoId,
        title: vid.title,
        status: vid.status,
        url: vid.url,
        createdAt: vid.createdAt,
      })),
    );
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "could not fetch videos" });
  }
};

export const getSecureVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findOne({ videoId });
    if (!video || video.status !== "ready") {
      return res.status(404).json({
        error: "Video not found or not ready for streaming.",
      });
    }
    if (video.visibility === "public") {
      return res.redirect(video.url);
    }
    //domain locking
    const requestOrigin = req.headers.origin || req.headers.referer;
    if (video.visibility === "private") {
      if (video.allowedDomains && video.allowedDomains.length > 0) {
        const clearOrigin = requestOrigin
          ? new URL(requestOrigin).hostname
          : "";
        const isAllowed = video.allowedDomains.some((domain) =>
          cleanOrigin.includes(domain),
        );

        if (!isAllowed) {
          console.log(`Blocke unauthorized play attempet from: ${cleanOrigin}`);
          return res.status(403).json({
            error:
              "This video can not be played on this website(Domain locked)",
          });
        }
      }
    }
    //increment views

    await Video.updateOne({ videoId }, { $inc: { views: 1 } });

    return res.redirect(video.url);
  } catch (error) {
    console.log("playback error", error);
    res.status(500).json({
      error: "Server error while during playback verification.",
    });
  }
};
