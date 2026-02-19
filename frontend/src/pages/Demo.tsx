import { useState } from "react";
import { InlineMath } from "react-katex";

export function Demo() {
  const [mu, setMu] = useState(0.5);
  const [alpha, setAlpha] = useState(0.6);
  const [beta, setBeta] = useState(1.5);
  const [T, setT] = useState(10);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const branchingRatio = beta !== 0 ? alpha / beta : Infinity;
  const isStable = branchingRatio < 1;

  const handleSimulate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('https://lambdalab.onrender.com/api/simulate', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mu, alpha, beta, T }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.detail || `HTTP ${response.status}`;
        throw new Error(`Simulation failed: ${errorMsg}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error("Simulation error:", err);
      setError(err.message || "Error running simulation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", padding: "80px 32px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "64px" }}>Interactive Demo</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
        {/* Parameter Input */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{
            backgroundColor: "rgba(26, 26, 26, 0.3)",
            padding: "32px",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "24px", marginTop: 0 }}>Parameters</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {/* μ input */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "0.875rem", color: "rgba(237, 237, 237, 0.8)" }}>
                  Baseline Intensity (μ)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={mu}
                  onChange={(e) => setMu(parseFloat(e.target.value) || 0)}
                  style={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    color: "var(--foreground)",
                    fontSize: "1rem",
                    fontFamily: "'Fira Code', monospace",
                    colorScheme: "dark",
                  }}
                />
              </div>

              {/* α input */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "0.875rem", color: "rgba(237, 237, 237, 0.8)" }}>
                  Excitation (α)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value) || 0)}
                  style={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    color: "var(--foreground)",
                    fontSize: "1rem",
                    fontFamily: "'Fira Code', monospace",
                    colorScheme: "dark",
                  }}
                />
              </div>

              {/* β input */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "0.875rem", color: "rgba(237, 237, 237, 0.8)" }}>
                  Decay Rate (β)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={beta}
                  onChange={(e) => setBeta(parseFloat(e.target.value) || 0)}
                  style={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    color: "var(--foreground)",
                    fontSize: "1rem",
                    fontFamily: "'Fira Code', monospace",
                    colorScheme: "dark",
                  }}
                />
              </div>

              {/* T input */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "0.875rem", color: "rgba(237, 237, 237, 0.8)" }}>
                  Time Horizon (T)
                </label>
                <input
                  type="number"
                  step="1"
                  value={T}
                  onChange={(e) => setT(parseFloat(e.target.value) || 1)}
                  style={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    color: "var(--foreground)",
                    fontSize: "1rem",
                    fontFamily: "'Fira Code', monospace",
                    colorScheme: "dark",
                  }}
                />
              </div>
            </div>

            {/* Branching Ratio */}
            <div style={{
              marginTop: "24px",
              padding: "16px",
              backgroundColor: "rgba(10, 10, 10, 0.5)",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.875rem", color: "rgba(237, 237, 237, 0.7)" }}>
                  Branching Ratio:
                </span>
                <InlineMath math={`n = \\frac{\\alpha}{\\beta} = ${branchingRatio.toFixed(3)}`} />
              </div>
              {!isStable && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginTop: "12px", fontSize: "0.875rem", color: "#d4183d" }}>
                  <span style={{ marginTop: "2px" }}>⚠️</span>
                  <span>Warning: n ≥ 1 (unstable regime, process may explode)</span>
                </div>
              )}
              {isStable && (
                <div style={{ fontSize: "0.875rem", color: "rgba(237, 237, 237, 0.6)", marginTop: "8px" }}>
                  ✓ Stable (subcritical branching process)
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
              <button
                onClick={handleSimulate}
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  border: "none",
                  padding: "12px 16px",
                  borderRadius: "4px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "background-color 0.2s",
                  opacity: loading ? 0.6 : 1,
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "rgba(237, 237, 237, 0.9)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--primary)")}
              >
                {loading ? "Simulating..." : "Run Simulation"}
              </button>
            </div>

            {error && (
              <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#d4183d", color: "#ffffff", borderRadius: "4px", fontSize: "0.875rem" }}>
                {error}
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        {result && (
          <>
            <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>Results</h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
                <div style={{ backgroundColor: "rgba(26, 26, 26, 0.3)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "4px", padding: "16px" }}>
                  <div style={{ fontSize: "0.75rem", color: "rgba(136, 136, 136, 0.8)", marginBottom: "4px" }}>Events</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>{result.n_events}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(136, 136, 136, 0.8)", marginTop: "8px" }}>Total events generated</div>
                </div>

                <div style={{ backgroundColor: "rgba(26, 26, 26, 0.3)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "4px", padding: "16px" }}>
                  <div style={{ fontSize: "0.75rem", color: "rgba(136, 136, 136, 0.8)", marginBottom: "4px" }}>Mean IAT</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>{result.mean_iat?.toFixed(3)}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(136, 136, 136, 0.8)", marginTop: "8px" }}>seconds</div>
                </div>

                <div style={{ backgroundColor: "rgba(26, 26, 26, 0.3)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "4px", padding: "16px" }}>
                  <div style={{ fontSize: "0.75rem", color: "rgba(136, 136, 136, 0.8)", marginBottom: "4px" }}>IAT Std Dev</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>{result.std_iat?.toFixed(3)}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(136, 136, 136, 0.8)", marginTop: "8px" }}>Variance in spacing</div>
                </div>

                <div style={{ backgroundColor: "rgba(26, 26, 26, 0.3)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "4px", padding: "16px" }}>
                  <div style={{ fontSize: "0.75rem", color: "rgba(136, 136, 136, 0.8)", marginBottom: "4px" }}>Peak Intensity</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)" }}>{result.peak_intensity?.toFixed(2)}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(136, 136, 136, 0.8)", marginTop: "8px" }}>Maximum λ(t)</div>
                </div>
              </div>

              {result.plot_timeline && (
                <div style={{ backgroundColor: "rgba(26, 26, 26, 0.2)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <img
                    src={result.plot_timeline}
                    alt="Event timeline"
                    style={{ width: "100%", borderRadius: "4px" }}
                  />
                </div>
              )}

              {result.plot_intensity && (
                <div style={{ backgroundColor: "rgba(26, 26, 26, 0.2)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <img
                    src={result.plot_intensity}
                    alt="Intensity curve"
                    style={{ width: "100%", borderRadius: "4px" }}
                  />
                </div>
              )}
            </section>
          </>
        )}

        {/* Note */}
        <section style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
          <p>
            <strong>Note:</strong> This demo uses server-side simulation via the FastAPI backend.
            The backend implements Ogata's thinning algorithm for efficient event generation.
          </p>
          <ul style={{ marginTop: "12px", marginLeft: "20px" }}>
            <li>
              <code style={{ backgroundColor: "var(--secondary)", padding: "2px 6px", borderRadius: "4px" }}>POST /api/simulate</code>
              {" "}→ returns event times and intensity curves
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
