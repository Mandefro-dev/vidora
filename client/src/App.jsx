import React, { useState, useEffect } from "react";
import { FiPlay, FiClock, FiCheckCircle, FiFilm, FiX } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Uploader from "./uploader";
import VideoPlayer from "./VideoPlayer";
import { fetchVideos } from "./api";
import "./App.css";

function App() {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  //  Processing -> Ready
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await fetchVideos();
        // Simple check to avoid unnecessary re-renders would go here in production
        setVideos(data);
      } catch (e) {
        console.error("Fetch error", e);
      }
    };

    loadVideos(); // Initial load
    const interval = setInterval(loadVideos, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Handle immediate UI update after upload
  const handleUploadSuccess = (newVideo) => {
    setVideos((prev) => [newVideo, ...prev]);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <span style={{ marginRight: "10px" }}>⚡</span>
          NodeStream{" "}
          <span style={{ color: "white", fontWeight: 300, opacity: 0.5 }}>
            Pro
          </span>
        </div>
        <div className="badge ready">v1.0.0 Live</div>
      </header>

      {/* upload Component */}
      <Uploader onUploadSuccess={handleUploadSuccess} />

      {/* Video Gallery Grid */}
      <h2 className="section-title">
        <FiFilm /> Your Library
      </h2>

      <div className="grid">
        <AnimatePresence>
          {videos.map((video) => (
            <motion.div
              key={video.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card"
              onClick={() => video.status === "ready" && setActiveVideo(video)}
            >
              {/* Thumbnail / Status Icon */}
              <div className="card-thumb">
                {video.status === "ready" ? (
                  <div className="play-overlay">
                    <FiPlay size={24} color="white" />
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: "var(--warning)" }}>
                    <FiClock className="spin" size={32} />
                    <div style={{ fontSize: "0.8rem", marginTop: "10px" }}>
                      Processing...
                    </div>
                  </div>
                )}
              </div>

              {/* Card Meta Data */}
              <div className="card-body">
                <div className="card-title">
                  {video.title || "Untitled Video"}
                </div>
                <div className="card-meta">
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  <span className={`badge ${video.status}`}>
                    {video.status === "ready" ? (
                      <>
                        <FiCheckCircle /> Ready
                      </>
                    ) : (
                      "Encoding"
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "20px",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>{activeVideo.title}</h3>
                <button
                  onClick={() => setActiveVideo(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <FiX size={24} />
                </button>
              </div>

              <VideoPlayer src={activeVideo.url} />

              <div
                style={{
                  padding: "20px",
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                }}
              >
                Stream URL:{" "}
                <code
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: "4px",
                    borderRadius: "4px",
                  }}
                >
                  {activeVideo.url}
                </code>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
