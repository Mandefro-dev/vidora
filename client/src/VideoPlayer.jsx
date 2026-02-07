import React from "react";

const VideoPlayer = () => {
  return (
    <div className="player-wrapper">
      <h2 className="section-title">Now Playing</h2>
      <div className="video-container">
        {/* Phase 1 & 2 Integration: 
            Directly pointing to our Backend Stream URL 
        */}
        <video
          controls
          autoPlay
          muted
          crossOrigin="anonymous"
          className="react-player"
        >
          <source src="http://localhost:8000/api/stream" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;
