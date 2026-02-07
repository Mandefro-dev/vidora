import React, { useState } from "react";
import axios from "axios";
import { FiUploadCloud, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const Uploader = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle, uploading, success, error

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("idle");
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // Must match the backend 'busboy' field name

    setStatus("uploading");

    try {
      await axios.post("http://localhost:8000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setProgress(percentCompleted);
        },
      });
      setStatus("success");
    } catch (error) {
      console.error(error);
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
          accept="video/mp4"
          onChange={handleFileChange}
          hidden
        />
        <label htmlFor="file-input" className="upload-label">
          <FiUploadCloud size={50} />
          <p>{file ? file.name : "Click to Select Video"}</p>
        </label>

        {file && (
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
          <FiCheckCircle /> Upload Complete!
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
