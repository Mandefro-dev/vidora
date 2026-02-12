import React, { useState } from "react";
import axios from "axios";
import { FiUploadCloud, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

// Pass onUploadComplete as a prop
const Uploader = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("idle");
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // Must match backend 'busboy' setup

    setStatus("uploading");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percentCompleted);
          },
        },
      );

      setStatus("success");

      // IMPORTANT: Trigger the callback with the HLS URL from the backend
      if (onUploadComplete) {
        onUploadComplete(response.data.videoUrl);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="uploader-wrapper">
      <h2 className="section-title">Upload New Video</h2>

      <div className="upload-box">
        <input
          type="file"
          id="file-input"
          accept="video/*" // Support all video types for conversion
          onChange={handleFileChange}
          hidden
        />
        <label htmlFor="file-input" className="upload-label">
          <FiUploadCloud size={50} />
          <p>{file ? file.name : "Click to Select Video"}</p>
        </label>

        {file && status !== "uploading" && (
          <button onClick={handleUpload} className="upload-btn">
            Start Upload
          </button>
        )}
      </div>

      {status === "uploading" && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <span>{progress}%</span>
        </div>
      )}

      {status === "success" && (
        <div className="status-msg success">
          <FiCheckCircle /> Uploaded! Converting to HLS...
        </div>
      )}

      {status === "error" && (
        <div className="status-msg error">
          <FiAlertCircle /> Upload Failed
        </div>
      )}
    </div>
  );
};

export default Uploader;
