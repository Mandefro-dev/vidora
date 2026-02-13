import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "../db.json");
export const getVideos = async () => {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data).videos;
  } catch (error) {
    console.error("DB Read Error:", error.message);
    return [];
  }
};

export const addVideo = async (video) => {
  const videos = await getVideos();
  videos.unshift(video);
  await fs.writeFile(DB_PATH, JSON.stringify({ videos }, null, 2));
  return video;
};

export const updateVideoStatus = async (videoId, status) => {
  const videos = await getVideos();
  const index = videos.findIndex((v) => v.id === videoId);

  if (index !== -1) {
    videos[index].status = status;
    await fs.writeFile(DB_PATH, JSON.stringify({ videos }, null, 2));
  }
};
