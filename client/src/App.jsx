import React, { useState } from "react";
import Uploader from "./Uploader";
import VideoPlayer from "./VideoPlayer";
import { FiPlayCircle, FiCopy, FiCheck, FiX } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import "./App.css";

function App() {
  // We store a list of videos here.
  // In Phase 6, we will fetch this list from the backend/database.
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null); // The video currently playing in modal

  const handleUploadComplete = (videoData) => {
    // Add the new video to our list
    const newVideo = {
      id: videoData.videoId,
      title: `Video ${videoData.videoId.substring(0, 8)}...`, // Placeholder title
      url: videoData.videoUrl,
      status: "processing", // It starts as processing
      timestamp: new Date(),
    };

    // Add to top of list
    setVideos([newVideo, ...videos]);

    // Simulate "Processing" finishing after 10 seconds (Mock for UI)
    setTimeout(() => {
      setVideos((prev) =>
        prev.map((v) => (v.id === newVideo.id ? { ...v, status: "ready" } : v)),
      );
    }, 10000);
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    alert("Stream URL copied! You can paste this in any HLS player.");
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="brand">StreamHost ⚡</div>
        <div className="user-profile">
          <span className="badge">Free Tier</span>
        </div>
      </header>

      {/* Upload Section */}
      <section>
        <Uploader onUploadComplete={handleUploadComplete} />
      </section>

      {/* Video Gallery */}
      <section>
        <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>
          Your Library
        </h3>

        {videos.length === 0 ? (
          <p style={{ color: "#94a3b8", textAlign: "center" }}>
            No videos yet. Upload one above!
          </p>
        ) : (
          <div className="grid">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                {/* Thumbnail / Play Trigger */}
                <div
                  className="card-thumb"
                  onClick={() => setActiveVideo(video)}
                >
                  <FiPlayCircle className="play-icon" />
                </div>

                {/* Info */}
                <div className="card-body">
                  <div className="card-title">{video.title}</div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span className={`badge ${video.status}`}>
                      {video.status === "processing"
                        ? "Processing..."
                        : "Ready"}
                    </span>
                    <button
                      className="icon-btn"
                      onClick={() => copyToClipboard(video.url)}
                    >
                      <FiCopy />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()} // Don't close if clicking inside modal
            >
              <div
                style={{
                  padding: "10px",
                  background: "#000",
                  textAlign: "right",
                }}
              >
                <FiX
                  onClick={() => setActiveVideo(null)}
                  style={{ cursor: "pointer", color: "white" }}
                  size={24}
                />
              </div>

              {/* The Player Component */}
              <VideoPlayer src={activeVideo.url} />

              <div style={{ padding: "20px" }}>
                <h3>{activeVideo.title}</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                  Stream URL: {activeVideo.url}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
