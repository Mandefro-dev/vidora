import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const hlsInstance = useRef(null);

  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1); // -1 = Auto

  useEffect(() => {
    const video = videoRef.current;
    if (!src || !video) return;

    let hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        manifestLoadingMaxRetry: 10,
        manifestLoadingRetryDelay: 1000,
      });

      hlsInstance.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      // When manifest loads (FFmpeg qualities detected)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const availableQualities = hls.levels.map((level, index) => ({
          height: level.height,
          bitrate: level.bitrate,
          index,
        }));

        setQualities(availableQualities);

        video.play().catch(() => {
          console.log("User interaction required to play.");
        });
      });

      // Listen for manual quality switch
      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentQuality(hls.autoLevelEnabled ? -1 : data.level);
      });

      // Error handling (your original logic preserved)
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
    }
    // Safari native HLS fallback
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  const changeQuality = (levelIndex) => {
    if (hlsInstance.current) {
      hlsInstance.current.currentLevel = levelIndex;
      setCurrentQuality(levelIndex);
    }
  };

  return (
    <div className="player-container" style={{ position: "relative" }}>
      <video
        ref={videoRef}
        controls
        crossOrigin="anonymous"
        style={{ width: "100%", background: "#000" }}
      />

      {qualities.length > 0 && (
        <div
          className="quality-selector"
          style={{
            position: "absolute",
            bottom: "50px",
            right: "10px",
            background: "rgba(0,0,0,0.8)",
            padding: "10px",
            borderRadius: "8px",
            zIndex: 10,
          }}
        >
          <select
            value={currentQuality}
            onChange={(e) => changeQuality(Number(e.target.value))}
            style={{
              background: "transparent",
              color: "white",
              border: "none",
              outline: "none",
            }}
          >
            <option value={-1}>Auto</option>
            {qualities.map((q) => (
              <option key={q.index} value={q.index}>
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
