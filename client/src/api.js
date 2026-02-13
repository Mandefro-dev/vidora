import axios from "axios";

// Ensure this matches your backend port
const API_BASE = "http://localhost:8000/api";

export const fetchVideos = async () => {
  const response = await axios.get(`${API_BASE}/videos`);
  return response.data;
};

export const uploadVideoFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_BASE}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      if (onProgress) onProgress(percent);
    },
  });
  return response.data;
};
