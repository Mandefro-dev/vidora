import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import dotenv from "dotenv";

dotenv.config();

// Initialize the S3 Client pointed at Cloudflare R2
const s3 = new S3Client({
  region: "eu-west-1",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
  forcePathStyle: true, // Required for R2
});

export const uploadDirectoryToS3 = async (dirPath, s3FolderPrefix) => {
  const files = fs.readdirSync(dirPath);

  console.log(`[Cloud] Uploading ${files.length} files to R2...`);

  // We use Promise.all to upload all segments in parallel for speed
  const uploadPromises = files.map(async (file) => {
    const filePath = path.join(dirPath, file);
    const fileStream = fs.createReadStream(filePath);
    const s3Key = `${s3FolderPrefix}/${file}`; // e.g., hls/video-id/0.ts

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: s3Key,
      Body: fileStream,
      ContentType: mime.lookup(filePath) || "application/octet-stream",
    });

    return s3.send(command);
  });

  await Promise.all(uploadPromises);
  console.log(`[Cloud] Successfully uploaded ${s3FolderPrefix} to R2!`);

  // Return the public URL to the master playlist
  return `${process.env.R2_PUBLIC_URL}/${s3FolderPrefix}/index.m3u8`;
};
