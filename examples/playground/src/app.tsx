import "./App.css";
import { TodoSection, UserSection, DebugInfo } from "./components";

function App() {
  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>use-idb-store Test App</h1>
      <p>
        This app tests the use-idb-store hook with persistent IndexedDB storage.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          marginTop: "30px",
        }}
      >
        <TodoSection />
        <UserSection />
      </div>

      <DebugInfo />
    </div>
  );
}

export default App;
