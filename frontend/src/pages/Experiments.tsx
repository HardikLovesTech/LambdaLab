import { InlineMath } from "react-katex";

export function Experiments() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "80px 32px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "64px" }}>Experimental Analysis</h1>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "64px", lineHeight: 1.8, color: "rgba(237, 237, 237, 0.9)" }}>
        {/* Simulation Validation */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>Simulation Validation</h2>
          <p>
            We validate our Hawkes simulator against three parameter regimes.
          </p>

          <div style={{ overflowX: "auto", backgroundColor: "rgba(26, 26, 26, 0.2)", padding: "24px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>μ</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>α</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>β</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>α/β</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>Regime</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>N (T=50)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { mu: 0.5, alpha: 0.2, beta: 1.0, ratio: 0.20, regime: "Subcritical", n: 27 },
                  { mu: 0.5, alpha: 0.8, beta: 1.0, ratio: 0.80, regime: "Subcritical", n: 73 },
                  { mu: 0.5, alpha: 1.2, beta: 1.0, ratio: 1.20, regime: "Supercritical", n: 84 },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", backgroundColor: i % 2 === 0 ? "transparent" : "rgba(26, 26, 26, 0.1)" }}>
                    <td style={{ padding: "12px 16px" }}>{row.mu}</td>
                    <td style={{ padding: "12px 16px" }}>{row.alpha}</td>
                    <td style={{ padding: "12px 16px" }}>{row.beta}</td>
                    <td style={{ padding: "12px 16px" }}>{row.ratio.toFixed(2)}</td>
                    <td style={{ padding: "12px 16px" }}>{row.regime}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{row.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            <strong>Key observations:</strong>
          </p>
          <ul>
            <li>
              As <InlineMath math="\alpha/\beta" /> increases from 0.2 to 0.8, event count
              grows (27 → 73) and clustering becomes pronounced.
            </li>
            <li>
              When <InlineMath math="\alpha/\beta > 1" />, the process becomes unstable.
              We observe rapid event accumulation and must shorten the time window.
            </li>
            <li>
              Mean inter-arrival time decreases with stronger clustering:
              1.83 → 0.37 → 0.087 seconds.
            </li>
          </ul>
        </section>

        {/* Intensity Decay */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>Intensity Decay</h2>
          <p>
            After an event, intensity should decay exponentially at rate <InlineMath math="\beta" />.
            We fit log(intensity − μ) ~ −β·t for isolated spikes.
          </p>
          <ul>
            <li>
              <strong>α/β = 0.2:</strong> fitted slope ≈ −1.0 (isolated spikes decay cleanly)
            </li>
            <li>
              <strong>α/β = 0.8:</strong> fitted slope ≈ −0.46 (overlapping spikes reduce apparent decay)
            </li>
            <li>
              <strong>α/β = 1.2:</strong> fitted slope ≈ −1.0 for partial data (supercritical regime)
            </li>
          </ul>
        </section>

        {/* Poisson Baseline */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>Poisson Baseline Comparison</h2>
          <p>
            Poisson process with λ = 0.5 over T = 50 generates ~25 events uniformly spaced.
            Hawkes processes with α &gt; 0 show clear clustering: events arrive in bursts.
          </p>
        </section>

        {/* Model Comparison */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>Model Comparison</h2>
          <p>
            AIC comparison between Poisson and Hawkes models on the same dataset. Lower AIC indicates 
            better fit, penalized for model complexity.
          </p>

          <div style={{ overflowX: "auto", backgroundColor: "rgba(26, 26, 26, 0.2)", padding: "24px", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>Model</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>Parameters</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>Log-Likelihood</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600 }}>AIC</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <td style={{ padding: "12px 16px" }}>Poisson</td>
                  <td style={{ padding: "12px 16px" }}>1</td>
                  <td style={{ padding: "12px 16px" }}>-28.4</td>
                  <td style={{ padding: "12px 16px" }}>58.8</td>
                </tr>
                <tr>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>Hawkes</td>
                  <td style={{ padding: "12px 16px" }}>3</td>
                  <td style={{ padding: "12px 16px" }}>-18.2</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>42.4</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            <InlineMath math="\Delta\text{AIC} = 42.4 - 58.8 = -16.4" />. Strong evidence favoring 
            the Hawkes model—self-excitation meaningfully explains observed clustering beyond baseline 
            Poisson randomness.
          </p>
        </section>

        {/* Stability */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>Stability Analysis</h2>
          <p>
            The branching ratio <InlineMath math="n = \alpha/\beta = 0.6/1.5 = 0.4" /> satisfies the 
            stability condition <InlineMath math="n < 1" />. Each event spawns, on average, 0.4 offspring. 
            The process is subcritical and stationary.
          </p>
          <p>
            If we increased <InlineMath math="\alpha" /> to 1.8 while keeping{" "}
            <InlineMath math="\beta = 1.5" />, we would have <InlineMath math="n = 1.2 > 1" />—a 
            supercritical regime where intensity explodes.
          </p>
        </section>
      </div>
    </div>
  );
}
