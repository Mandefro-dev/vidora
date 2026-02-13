import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [levels, setLevels] = useState([]); // Store available qualities
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 is "Auto"
  const hlsInstance = useRef(null);
  // const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!src || !video) return;

    let hls; // Keep instance in the effect scope for cleanup

    if (Hls.isSupported()) {
      //  Instantiate only if supported
      hls = new Hls({
        manifestLoadingMaxRetry: 10,
        manifestLoadingRetryDelay: 1000,
      });
      hlsInstance.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Handle autoplay policies gracefully
        setLevels(hls.levels);
        video
          .play()
          .catch((err) => console.log("User must click play manually", err));
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentLevel(hls.currentLevel);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      //  Fallback for native HLS (Safari)
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }

    // Perfect cleanup on modal close
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);
  const changeQuality = (newLevel) => {
    if (hlsInstance.current) {
      // Set the manual quality level
      hlsInstance.current.currentLevel = newLevel;
      setCurrentLevel(newLevel);
    }
  };

  return (
    <div
      className="video-wrapper"
      style={{ position: "relative", background: "#000" }}
    >
      <video
        ref={videoRef}
        controls
        crossOrigin="anonymous"
        style={{ width: "100%" }}
      />

      {/* Quality Selector UI */}
      {levels.length > 0 && (
        <div className="quality-selector">
          <span className="quality-label">Quality:</span>
          <button
            onClick={() => changeQuality(-1)}
            className={`quality-btn ${currentLevel === -1 ? "active" : ""}`}
          >
            Auto
          </button>
          {levels.map((level, index) => (
            <button
              key={index}
              onClick={() => changeQuality(index)}
              className={`quality-btn ${currentLevel === index ? "active" : ""}`}
            >
              {level.height}p
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
