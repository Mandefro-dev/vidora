import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { FiSettings } from "react-icons/fi";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const hlsInstance = useRef(null);
  const [qualities, setQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState(-1);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!src || !video) return;

    if (Hls.isSupported()) {
      // Clean up previous instance if it exists
      if (hlsInstance.current) {
        hlsInstance.current.destroy();
      }

      const hls = new Hls({ maxMaxBufferLength: 30 });
      hlsInstance.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const availableQualities = hls.levels.map((level, index) => ({
          height: level.height,
          bitrate: level.bitrate,
          index,
        }));
        setQualities(availableQualities);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentQuality(hls.autoLevelEnabled ? -1 : data.level);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    return () => {
      if (hlsInstance.current) {
        hlsInstance.current.destroy();
      }
    };
  }, [src]);

  const changeQuality = (levelIndex) => {
    if (hlsInstance.current) {
      hlsInstance.current.currentLevel = levelIndex;
      setCurrentQuality(levelIndex);
      setShowMenu(false);
    }
  };

  return (
    <div className="player-container">
      <video
        ref={videoRef}
        controls
        style={{
          width: "100%",
          maxHeight: "60vh",
          background: "#000",
          borderRadius: "8px",
        }}
      />

      {qualities.length > 0 && (
        <div className="quality-wrapper">
          <button className="gear-btn" onClick={() => setShowMenu(!showMenu)}>
            <FiSettings size={20} />
            <span className="quality-badge">
              {currentQuality === -1
                ? "Auto"
                : `${qualities[currentQuality]?.height}p`}
            </span>
          </button>

          {showMenu && (
            <div className="quality-menu">
              <button
                className={currentQuality === -1 ? "active" : ""}
                onClick={() => changeQuality(-1)}
              >
                Auto
              </button>
              {qualities.map((q) => (
                <button
                  key={q.index}
                  className={currentQuality === q.index ? "active" : ""}
                  onClick={() => changeQuality(q.index)}
                >
                  {q.height}p
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
