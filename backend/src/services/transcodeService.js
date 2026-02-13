import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const convertToMp4 = (inputPath, outputFileName) => {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(__dirname, "../../uploads/processed");
    const outputPath = path.join(outputDir, `${outputFileName}.mp4`);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    console.log(`Starting transcoding: ${inputPath} -> ${outputPath}`);

    const ffmpeg = spawn("ffmpeg", [
      "-i",
      inputPath,
      "-vcodec",
      "libx264",
      "-acodec",
      "aac",
      "-crf",
      "20",
      outputPath,
    ]);
    ffmpeg.stderr.on("data", (data) => {
      const output = data.toString();
      if (output.includes("time=")) {
        const timeMatch = output.match(/time=(\d{2}:\d{2}:\d{2}\.\d{2})/);
        if (timeMatch) {
          process.stdout.write(`\rTranscoding... Time Mark: ${timeMatch[1]}`); // \r overwrites the line
        }
      }
    });

    ffmpeg.on("close", (code) => {
      console.log("\n");
      if (code === 0) {
        console.log("Transcoding finished successfully.");
        resolve(outputPath);
      } else {
        console.error(`FFmpeg exited with code ${code}`);
        reject(new Error("Transcoding failed"));
      }
    });

    ffmpeg.on("error", (err) => {
      console.error("faile to start FFMPEG process", err);
      reject(err);
    });
  });
};

export const convertToHLS = (inputPath, videoId) => {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(__dirname, "../../uploads/hls", videoId);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const masterPlaylist = path.join(outputDir, "index.m3u8");
    console.log(`[HLS] Starting Adaptive Bitrate Transcoding: ${videoId}`);

    const ffmpeg = spawn("ffmpeg", [
      "-i",
      inputPath,

      //  360p (Low Quality / Mobile)
      "-filter_complex",
      "[0:v]split=2[v1][v2]; [v1]scale=w=640:h=360[v1out]; [v2]scale=w=1280:h=720[v2out]",

      // Map 360p
      "-map",
      "[v1out]",
      "-c:v:0",
      "libx264",
      "-b:v:0",
      "800k",
      "-maxrate:v:0",
      "856k",
      "-bufsize:v:0",
      "1200k",
      "-map",
      "a:0",
      "-c:a:0",
      "aac",
      "-b:a:0",
      "96k",

      // Map 720p
      "-map",
      "[v2out]",
      "-c:v:1",
      "libx264",
      "-b:v:1",
      "2800k",
      "-maxrate:v:1",
      "2996k",
      "-bufsize:v:1",
      "4200k",
      "-map",
      "a:0",
      "-c:a:1",
      "aac",
      "-b:a:1",
      "128k",

      // HLS Settings
      "-f",
      "hls",
      "-hls_time",
      "10",
      "-hls_playlist_type",
      "vod",
      "-hls_flags",
      "independent_segments",
      "-master_pl_name",
      "index.m3u8", // The Master Playlist

      "-var_stream_map",
      "v:0,a:0,name:360p v:1,a:1,name:720p",

      path.join(outputDir, "stream_%v.m3u8"),
      // "-start_number",
      // "0",
    ]);

    ffmpeg.stderr.on("data", (data) => {
      const output = data.toString();
      const timeMatch = output.match(/time=(\d{2}:\d{2}:\d{2}\.\d{2})/);

      if (timeMatch) {
        process.stdout.write(`\r Transcoding... Time mark: ${timeMatch[1]}`);
      }
    });
    ffmpeg.on("close", (code) => {
      console.log("\n");
      if (code === 0) {
        console.log("HLS JOB COMPLETE..PLAYLIST READY");
        resolve(masterPlaylist);
      } else {
        console.error(`[HLS] FFmpeg exited with error code ${code}`);
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
    ffmpeg.on("error", (err) => {
      console.error("[HLS] faileD to start FFMPEG process", err);
      reject(err);
    });
  });
};
