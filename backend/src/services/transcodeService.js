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
