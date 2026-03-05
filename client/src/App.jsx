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
  FiSearch,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import Uploader from "./Uploader";
import VideoPlayer from "./VideoPlayer";
import { fetchVideos } from "./api";
import "./App.css";

function App() {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  const [activeTab, setActiveTab] = useState("player");
  const [domains, setDomains] = useState("");
  const [visibility, setVisibility] = useState("public");

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

  const handleUploadSuccess = (newVideo) =>
    setVideos((prev) => [newVideo, ...prev]);

  useEffect(() => {
    if (activeVideo) {
      setDomains(activeVideo.allowedDomains?.join(", ") || "");
      setVisibility(activeVideo.visibility || "public");
      setActiveTab("player");
    }
  }, [activeVideo]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

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
      showToast("✨ Settings locked and saved!");
    } catch (error) {
      console.error("Failed to save", error);
    }
  };

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    showToast(message);
  };

  const filteredVideos = videos.filter((v) =>
    (v.title || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="app-container">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="toast"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="header">
        <div className="brand">
          ⚡ NodeStream <span style={{ opacity: 0.5 }}>Pro</span>
        </div>
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <Uploader onUploadSuccess={handleUploadSuccess} />

      <h2 className="section-title">
        <FiFilm /> Your Library
      </h2>

      <div className="grid">
        <AnimatePresence>
          {filteredVideos.map((video) => (
            <motion.div
              key={video.id}
              layout
              className="card"
              onClick={() => video.status === "ready" && setActiveVideo(video)}
            >
              <div className="card-thumb">
                {video.status === "ready" ? (
                  <div className="play-overlay">
                    <FiPlay size={24} color="white" />
                  </div>
                ) : (
                  <FiClock className="spin" size={32} color="#94a3b8" />
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
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-btn"
                onClick={() => setActiveVideo(null)}
              >
                <FiX size={24} />
              </button>

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
                  Share
                </button>
              </div>

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
                    <option value="public">🌍 Public</option>
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

              {activeTab === "share" && (
                <div className="tab-pane share-pane">
                  <h3>Share your video</h3>
                  <div className="copy-group">
                    <input
                      readOnly
                      value={`http://localhost:5173/watch/${activeVideo.id}`}
                    />
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `http://localhost:5173/watch/${activeVideo.id}`,
                          "Link Copied! 📋",
                        )
                      }
                    >
                      <FiCopy /> Copy
                    </button>
                  </div>
                  <div className="copy-group" style={{ marginTop: "15px" }}>
                    <textarea
                      readOnly
                      rows="2"
                      value={`<iframe src="http://localhost:5173/embed/${activeVideo.id}" width="100%" height="400px" frameborder="0"></iframe>`}
                    />
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `<iframe src="http://localhost:5173/embed/${activeVideo.id}" width="100%" height="400px" frameborder="0"></iframe>`,
                          "Embed Copied! 🚀",
                        )
                      }
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
