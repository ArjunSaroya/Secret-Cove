import { useState } from "react";
import "./App.css";

function App() {
  const [situation, setSituation] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  async function handleAnalyze() {
    if (!situation.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            situation,
          }),
        }
      );

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  const formattedAnalysis = response?.analysis
    ?.replace(/\n{2,}/g, "\n")
    ?.replace(
      /🧠 Emotion Detected/g,
      '<span class="section-title">🧠 Emotion Detected</span>'
    )
    ?.replace(
      /📌 Facts/g,
      '<span class="section-title">📌 Facts</span>'
    )
    ?.replace(
      /⚠️ Assumptions|⚠ Assumptions/g,
      '<span class="section-title">⚠️ Assumptions</span>'
    )
    ?.replace(
      /🔄 Alternate Perspective/g,
      '<span class="section-title">🔄 Alternate Perspective</span>'
    )
    ?.replace(
      /✅ Next Step/g,
      '<span class="section-title">✅ Next Step</span>'
    )
    ?.replace(/\n/g, "<br>");

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="topbar">
        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="hero">
        <h1 className="brand-name">Secret Cove</h1>

        <p className="subtitle">
          A safe place to untangle your thoughts.
        </p>
      </div>

      <textarea
        placeholder="Take your time. What's been bothering you?"
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
      />

      <div className="action-area">
        <button
          className="analyze-btn"
          onClick={handleAnalyze}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {response && (
        <div className="analysis">
          <h2>Analysis</h2>

          <div
            className="analysis-content"
            dangerouslySetInnerHTML={{
              __html: formattedAnalysis,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;