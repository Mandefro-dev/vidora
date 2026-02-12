import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1); // -1 = Auto

  useEffect(() => {
    const video = videoRef.current;
    if (!src) return;

    if (Hls.isSupported()) {
      if (hlsRef.current) hlsRef.current.destroy();

      const hls = new Hls({
        manifestLoadingMaxRetry: 20, // Retry more times for longer transcodes
        manifestLoadingRetryDelay: 3000,
      });
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        // Capture available quality levels (360p, 720p)
        const availableQualities = data.levels.map((l, index) => ({
          id: index,
          height: l.height,
          bitrate: l.bitrate,
        }));
        setQualities(availableQualities);
        video.play().catch(() => console.log("Auto-play blocked"));
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [src]);

  // Handler for changing quality
  const handleQualityChange = (event) => {
    const newQuality = parseInt(event.target.value);
    setCurrentQuality(newQuality);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = newQuality; // -1 is Auto
    }
  };

  return (
    <div className="player-wrapper">
      <h2 className="section-title">HLS Stream Player</h2>

      <div className="video-container">
        <video
          ref={videoRef}
          controls
          className="react-player"
          width="100%"
          poster="https://via.placeholder.com/800x450?text=Processing+Video..."
        />
      </div>

      {/* Quality Selector Control */}
      {qualities.length > 0 && (
        <div className="controls">
          <label>Quality: </label>
          <select onChange={handleQualityChange} value={currentQuality}>
            <option value="-1">Auto (Adaptive)</option>
            {qualities.map((q) => (
              <option key={q.id} value={q.id}>
                {q.height}p
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
