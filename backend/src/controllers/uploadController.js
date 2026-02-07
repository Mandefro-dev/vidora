import { handleFileUpload } from "../services/uploadService.js";

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

    res.status(201).json(result);
  } catch (error) {
    console.error("Upload Controller error..", error.message);

    res.status(500).json({
      error: "Upload Failed",
      details: error.message,
    });
  }
};
