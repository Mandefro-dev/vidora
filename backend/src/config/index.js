import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  port: process.env.PORT || 8000,
  videoPath: path.resolve(__dirname, "..", "..", "assets", "sample1.mp4"),
  chunkSize: 10 ** 6,
};
export default config;
