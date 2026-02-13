import React, { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { uploadVideoFile } from "./api";

const Uploader = ({ onUploadSuccess }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("video/")) return;

    setUploading(true);
    try {
      const data = await uploadVideoFile(file, (percent) =>
        setProgress(percent),
      );

      // Delay slightly to let the user see "100%" before resetting
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        onUploadSuccess(data); // Send new video data to App.jsx
      }, 800);
    } catch (error) {
      console.error("Upload failed", error);
      setUploading(false);
      alert("Upload failed. Check console.");
    }
  };

  return (
    <div
      className="upload-zone"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
    >
      <input
        type="file"
        id="fileInput"
        hidden
        accept="video/*"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {!uploading ? (
        <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
          <FiUploadCloud
            className="upload-icon"
            style={{ transform: dragging ? "scale(1.2)" : "scale(1)" }}
          />
          <h3>
            {dragging
              ? "Drop it like it's hot 🔥"
              : "Drag & Drop or Click to Upload"}
          </h3>
          <p style={{ color: "var(--text-muted)" }}>MP4, MOV, MKV supported</p>
        </label>
      ) : (
        <div>
          <h3 style={{ marginBottom: "1rem" }}>Uploading... {progress}%</h3>
          <div className="progress-container">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Uploader;
