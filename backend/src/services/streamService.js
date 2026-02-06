//service

import fs from "fs";
import { start } from "repl";
import { promisify } from "util";

export const getFileStats = async (filePath) => {
  try {
    const stats = await fs.promises.stat(filePath);
    return stats;
  } catch (error) {
    throw new Error(`fILE NOT FOUND AT:${filePath}`);
  }
};

export const calculateRange = (rangeHeader, totalSize, chunkSize) => {
  if (!rangeHeader) {
    return {
      start: 0,
      end: totalSize - 1,
      contentLength: totalSize,
    };
  }
  //start after parsing

  const parts = rangeHeader.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);

  //end
  const end = Math.min(start + chunkSize, totalSize - 1);

  return {
    start,
    end,
    contentLength: end - start + 1,
  };
};
