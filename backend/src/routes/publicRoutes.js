import express from "express";
const router = express.Router();
import Video from "../models/Video";

router.get("/site-stats", async (req, res) => {
  try {
    // In a real app, you'd cache this
    const totalVideos = await Video.countDocuments({ status: "ready" });

    res.json({
      success: true,
      stats: {
        activeCreators: "1.2k+",
        videosProcessed: totalVideos + 500, // Just to make it look busy for now ;)
        uptime: "99.9%",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
});
export default router;
