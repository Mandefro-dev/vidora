import React, { useState, useEffect } from "react";
import {
  FiPlay,
  FiClock,
  FiCheckCircle,
  FiFilm,
  FiX,
  FiCopy,
  FiSettings,
  FiBarChart2,
  FiLock,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import Uploader from "./uploader";
import VideoPlayer from "./VideoPlayer";
import { fetchVideos } from "./api";
import "./App.css";

function App() {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  const [activeTab, setActiveTab] = useState("player");
  const [domains, setDomains] = useState("");
  const [visibility, setVisibility] = useState("public");

  // Polling videos
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await fetchVideos();
        setVideos(data);
      } catch (e) {
        console.error("Fetch error", e);
      }
    };

    loadVideos();
    const interval = setInterval(loadVideos, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUploadSuccess = (newVideo) => {
    setVideos((prev) => [newVideo, ...prev]);
  };

  // When video is opened
  useEffect(() => {
    if (activeVideo) {
      setDomains(activeVideo.allowedDomains?.join(", ") || "");
      setVisibility(activeVideo.visibility || "public");
      setActiveTab("player");
    }
  }, [activeVideo]);

  const handleSaveSettings = async () => {
    const domainArray = domains
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    try {
      await axios.put(
        `http://localhost:8000/api/videos/${activeVideo.id}/settings`,
        {
          visibility,
          allowedDomains: domainArray,
        },
      );

      alert("✨ Video settings locked and saved!");
    } catch (error) {
      console.error("Failed to save", error);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="brand">
          ⚡ NodeStream <span style={{ opacity: 0.5 }}>Pro</span>
        </div>
      </header>

      <Uploader onUploadSuccess={handleUploadSuccess} />

      <h2 className="section-title">
        <FiFilm /> Your Library
      </h2>

      <div className="grid">
        <AnimatePresence>
          {videos.map((video) => (
            <motion.div
              key={video.id}
              layout
              className="card"
              onClick={() => video.status === "ready" && setActiveVideo(video)}
            >
              <div className="card-thumb">
                {video.status === "ready" ? (
                  <FiPlay size={24} />
                ) : (
                  <FiClock className="spin" size={32} />
                )}
              </div>

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

      {/* MODAL */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="modal-overlay"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              className="modal-content pro-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Tabs */}
              <div className="modal-tabs">
                <button
                  onClick={() => setActiveTab("player")}
                  className={activeTab === "player" ? "active" : ""}
                >
                  Player
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={activeTab === "settings" ? "active" : ""}
                >
                  <FiSettings /> Security
                </button>
                <button
                  onClick={() => setActiveTab("share")}
                  className={activeTab === "share" ? "active" : ""}
                >
                  Share & Embed
                </button>
              </div>

              {/* PLAYER TAB */}
              {activeTab === "player" && (
                <div className="tab-pane">
                  <VideoPlayer
                    src={`http://localhost:8000/api/videos/play/${activeVideo.id}`}
                  />

                  <div className="analytics-bar">
                    <FiBarChart2 /> <strong>{activeVideo.views || 0}</strong>{" "}
                    Lifetime Views
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === "settings" && (
                <div className="tab-pane settings-pane">
                  <h3>
                    <FiLock /> Video Security
                  </h3>

                  <label>Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                  >
                    <option value="public">🌍 Public (Anyone with link)</option>
                    <option value="private">🔒 Private (Domain Locked)</option>
                  </select>

                  {visibility === "private" && (
                    <div className="domain-lock-box">
                      <label>Allowed Domains</label>
                      <input
                        type="text"
                        value={domains}
                        onChange={(e) => setDomains(e.target.value)}
                      />
                    </div>
                  )}

                  <button className="btn-primary" onClick={handleSaveSettings}>
                    Save Changes
                  </button>
                </div>
              )}

              {/* SHARE TAB */}
              {activeTab === "share" && (
                <div className="tab-pane share-pane">
                  <h3>Share your video</h3>

                  <div className="copy-group">
                    <input
                      readOnly
                      value={`http://localhost:5173/watch/${activeVideo.id}`}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `http://localhost:5173/watch/${activeVideo.id}`,
                        );
                        alert("Copied to clipboard! 📋");
                      }}
                    >
                      <FiCopy /> Copy
                    </button>
                  </div>

                  <div className="copy-group">
                    <textarea
                      readOnly
                      rows="3"
                      value={`<iframe src="http://localhost:5173/embed/${activeVideo.id}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `<iframe src="http://localhost:5173/embed/${activeVideo.id}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`,
                        );
                        alert("Embed code copied! 🚀");
                      }}
                    >
                      <FiCopy /> Copy
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
