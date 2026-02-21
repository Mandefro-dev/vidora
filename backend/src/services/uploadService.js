import fs from "fs";
import path from "path";
import Busboy from "busboy";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleFileUpload = (req) => {
  return new Promise((resolve, reject) => {
    const bushboy = Busboy({ headers: req.headers });

    let filePath = "";
    let safeFileName = "";

    bushboy.on("file", (fieldName, fileStream, info) => {
      const { filename, mimeType } = info;
      console.log(`Receving file : ${filename}`);
      if (mimeType !== "video/mp4") {
        fileStream.resume();
        return reject(new Error("Only MP4 videos are allowed."));
      }
      7;

      safeFileName = `raw-${Date.now()}-${filename.replace(/\s+/g, "-")}`;
      filePath = path.join(__dirname, "../../uploads/temp", safeFileName);
      const writeStream = fs.createWriteStream(filePath);

      fileStream.pipe(writeStream); //network ->bushboy ->Disk

      fileStream.on("error", (err) => {
        console.error("File stream Error", err);
        reject(err);
      });
    });

    bushboy.on("finish", () => {
      // Only resolve if we actually processed a file
      if (safeFileName) {
        console.log("Upload complete");
        resolve({
          message: "Upload successful",
          file: safeFileName,
          path: filePath,
        });
      } else {
        reject(new Error("No file uploaded"));
      }
    });
    bushboy.on("error", (err) => {
      console.error("Bushboy Error", err);
      reject(err);
    });
    req.pipe(bushboy);
  });
};
