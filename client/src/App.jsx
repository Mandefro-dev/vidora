import "./App.css";
import VideoPlayer from "./VideoPlayer";
import Uploader from "./uploader";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>
          🚀 NodeStream <span className="tag">PRO</span>
        </h1>
      </header>

      <main className="main-content">
        <div className="left-panel">
          <VideoPlayer />
        </div>
        <div className="right-panel">
          <Uploader />
        </div>
      </main>
    </div>
  );
}

export default App;
