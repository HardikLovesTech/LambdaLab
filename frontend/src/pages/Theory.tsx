import { MathBlock } from "../components/MathBlock";
import { InlineMath } from "react-katex";

export function Theory() {
  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", padding: "80px 32px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "64px" }}>Mathematical Theory</h1>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "64px", lineHeight: 1.8, color: "rgba(237, 237, 237, 0.9)" }}>
        
        {/* ── Section 1: Introduction to Point Processes ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>1. Introduction to Point Processes</h2>
          <p>A <strong>temporal point process</strong> models the random occurrence times of events. Unlike traditional regression that predicts continuous values, point processes answer: <em>when do events happen?</em></p>
          <p>Applications span earthquakes, financial trading, social media activity, neural firing, and disease outbreaks.</p>
          <MathBlock>{`0 < t_1 < t_2 < t_3 < \\ldots < t_n < T`}</MathBlock>
        </section>

        {/* ── Section 2: The Conditional Intensity Function ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>2. The Conditional Intensity Function</h2>
          <p>The fundamental object in point process theory is the <strong>conditional intensity function</strong>:</p>
          <MathBlock>{`\\lambda(t | \\mathcal{H}_t) = \\text{instantaneous rate of events at time } t`}</MathBlock>
          <p>Formally:</p>
          <MathBlock>{`\\lambda(t) = \\lim_{\\Delta t \\to 0} \\frac{\\mathbb{E}[N(t + \\Delta t) - N(t) | \\mathcal{H}_t]}{\\Delta t}`}</MathBlock>
          <p>The conditional intensity captures <strong>how past events influence future ones</strong>. This dependency structure is the heart of self-exciting models.</p>
        </section>

        {/* ── Section 3: The Poisson Process and Its Limitations ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>3. The Poisson Process and Its Limitations</h2>
          <p>The simplest point process is the <strong>Poisson process</strong>, defined by a constant intensity:</p>
          <MathBlock>{`\\lambda(t) = \\lambda \\quad \\text{(constant)}`}</MathBlock>
          <p><strong>Key properties:</strong></p>
          <ul>
            <li>Memoryless: past events do not influence the future</li>
            <li>Inter-arrival times follow an exponential distribution</li>
            <li>Events are completely random and uniformly scattered</li>
          </ul>
          <p><strong>Why it fails real data:</strong> Poisson cannot model clustering, where events occur in bursts. Financial data shows volatility clustering; earthquakes show aftershock sequences; social media shows cascade effects. All require <strong>self-exciting</strong> models.</p>
        </section>

        {/* ── Section 4: The Hawkes Process Definition ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>4. The Hawkes Process Definition</h2>
          <p>The <strong>Hawkes process</strong> is a self-exciting point process where past events increase the probability of future events:</p>
          <MathBlock>{`\\lambda(t) = \\mu + \\sum_{t_i < t} \\alpha e^{-\\beta(t - t_i)}`}</MathBlock>
          <p><strong>Interpretation:</strong> Current Event Intensity = Baseline Activity + Excitation from past events</p>
          
          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>Parameter Definitions</h3>
            <ul>
              <li><strong><InlineMath math="\\mu" /> (Baseline Intensity)</strong>: At what rate would events occur if there were no self-excitation? If <InlineMath math="\\alpha = 0" />, the process reduces to a Poisson process with rate <InlineMath math="\\mu" />.</li>
              <li><strong><InlineMath math="\\alpha" /> (Excitation Strength)</strong>: How much does each past event boost the current intensity? Each event at time <InlineMath math="t_i" /> contributes <InlineMath math="\\alpha e^{-\\beta(t - t_i)}" /> to the intensity. Higher <InlineMath math="\\alpha" /> means stronger self-excitation; lower means weaker.</li>
              <li><strong><InlineMath math="\\beta" /> (Decay Rate)</strong>: How fast does the excitation from past events fade? This controls system "memory". High <InlineMath math="\\beta" /> means quick forgetting; low <InlineMath math="\\beta" /> means long memory.</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>The Branching Ratio and Regime Classification</h3>
            <p>Define the branching ratio as the expected number of offspring events triggered by one event:</p>
            <MathBlock>{`n = \\frac{\\alpha}{\\beta}`}</MathBlock>
            <p>This equals the total expected excitation mass.</p>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px", fontSize: "0.95rem" }}>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(237, 237, 237, 0.2)" }}>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>Condition</td>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>Regime</td>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>Behavior</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(237, 237, 237, 0.1)" }}>
                  <td style={{ padding: "8px" }}><InlineMath math="n < 1" /></td>
                  <td style={{ padding: "8px" }}>Subcritical</td>
                  <td style={{ padding: "8px" }}>Stable and stationary; clustering decays</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(237, 237, 237, 0.1)" }}>
                  <td style={{ padding: "8px" }}><InlineMath math="n = 1" /></td>
                  <td style={{ padding: "8px" }}>Critical</td>
                  <td style={{ padding: "8px" }}>Borderline; risk of unbounded growth</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}><InlineMath math="n > 1" /></td>
                  <td style={{ padding: "8px" }}>Supercritical</td>
                  <td style={{ padding: "8px" }}>Explosive; intensity can grow unbounded; non-stationary</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section 5: Stability and the Branching Ratio ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>5. Stability and the Branching Ratio</h2>
          <p>The <strong>branching ratio</strong> is the expected number of offspring per event:</p>
          <MathBlock>{`n = \\frac{\\alpha}{\\beta}`}</MathBlock>
          <p><strong>Regime classification:</strong></p>
          <ul>
            <li><InlineMath math="n < 1" /> (subcritical): process is stable; clusters decay over time</li>
            <li><InlineMath math="n = 1" /> (critical): borderline; risk of unbounded growth</li>
            <li><InlineMath math="n > 1" /> (supercritical): explosive; intensity can grow unbounded</li>
          </ul>
          <p>For a subcritical process, the expected total cascade size from one event is:</p>
          <MathBlock>{`\\frac{1}{1 - n}`}</MathBlock>
        </section>

        {/* ── Section 6: Maximum Likelihood Estimation ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>6. Maximum Likelihood Estimation</h2>
          <p>Given observed events <InlineMath math="t_1, \ldots, t_n" /> in <InlineMath math="[0, T]" />, the log-likelihood is:</p>
          <MathBlock>{`\\ell(\\mu, \\alpha, \\beta) = \\sum_{i=1}^{n} \\log\\lambda(t_i) - \\int_0^T \\lambda(s)\\,ds`}</MathBlock>
          <p>The first term rewards parameters that assign high probability to observed events. The second term (compensator) penalizes overprediction.</p>
          <p>For the exponential Hawkes kernel, the integral has a closed form:</p>
          <MathBlock>{`\\int_0^T \\lambda(s)\\,ds = \\mu T + \\frac{\\alpha}{\\beta}\\sum_{i=1}^{n}\\left(1 - e^{-\\beta(T - t_i)}\\right)`}</MathBlock>
        </section>

        {/* ── Section 7: Model Selection via AIC ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>7. Model Selection via AIC</h2>
          <p>We compare Hawkes against baseline Poisson using the Akaike Information Criterion:</p>
          <MathBlock>{`\\text{AIC} = 2k - 2\\ell_{\\max}`}</MathBlock>
          <p>Lower AIC is better. The decision rule for <InlineMath math="\Delta\text{AIC} = \text{AIC}_{\text{Poisson}} - \text{AIC}_{\text{Hawkes}}" />:</p>
          <ul>
            <li><InlineMath math="\Delta\text{AIC} < -10" /> = Very strong evidence for Hawkes</li>
            <li><InlineMath math="-10 \\leq \\Delta\\text{AIC} < -2" /> = Moderate evidence for Hawkes</li>
            <li><InlineMath math="-2 \\leq \\Delta\\text{AIC} \\leq 2" /> = Weak evidence; comparable models</li>
            <li><InlineMath math="\\Delta\\text{AIC} > 2" /> = Poisson preferred (no clustering detected)</li>
          </ul>
          <p>The penalty for complexity (Hawkes has 3 params vs Poisson's 1) ensures Hawkes must explain the data substantially better to be chosen.</p>
        </section>

        {/* ══════════════════════════════════════════════════════
            SECTIONS FROM UPLOADED FILES
            ══════════════════════════════════════════════════════ */}

        {/* ── Section 8: Counting Process Representation (KeyMathematicalConcepts.md) ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>8. Counting Process Representation</h2>
          <p>Define the <strong>counting process</strong> as:</p>
          <MathBlock>{`N(t) = \\text{number of events up to time } t`}</MathBlock>
          <p>This is the fundamental object in point process theory. Its key properties are:</p>
          <ul>
            <li><InlineMath math="N(0) = 0" /> — no events at time zero</li>
            <li>Non-decreasing — events only accumulate over time</li>
            <li>Jumps of size 1 — each event increments the count by exactly one</li>
          </ul>
          <p>The conditional intensity function <InlineMath math="\lambda(t|\mathcal{H}_t)" /> captures the instantaneous event rate at time <InlineMath math="t" /> given the full past history. It is the backbone of all point process modelling.</p>
        </section>

        {/* ── Section 9: Log-Likelihood Derivation (KeyMathematicalConcepts.md) ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>9. Log-Likelihood Derivation</h2>
          <p>For a general point process, the log-likelihood of observing events <InlineMath math="t_1, \ldots, t_{N(T)}" /> on <InlineMath math="[0, T]" /> is:</p>
          <MathBlock>{`\\mathcal{L} = \\sum_{i=1}^{N(T)} \\log \\lambda(t_i) - \\int_0^T \\lambda(t)\\,dt`}</MathBlock>
          <p>This follows from the conditional density formulation and the product of conditional probabilities.</p>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>For the Hawkes Process</h3>
            <p>Substituting the Hawkes intensity gives:</p>
            <MathBlock>{`\\mathcal{L} = \\sum_{i=1}^{N(T)} \\log\\!\\left(\\mu + \\sum_{t_j < t_i} \\alpha e^{-\\beta(t_i - t_j)}\\right) - \\int_0^T \\lambda(t)\\,dt`}</MathBlock>
          </div>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>The Integral Term</h3>
            <p>The compensator evaluates analytically via standard exponential integration:</p>
            <MathBlock>{`\\int_0^T \\lambda(t)\\,dt = \\mu T + \\sum_i \\frac{\\alpha}{\\beta}\\left(1 - e^{-\\beta(T - t_i)}\\right)`}</MathBlock>
          </div>
        </section>

        {/* ── Section 10: Branching Process Interpretation (KeyMathematicalConcepts.md) ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>10. Branching Process Interpretation</h2>
          <p>The Hawkes process has a beautiful connection to branching processes. The expected number of children triggered by a single event is:</p>
          <MathBlock>{`\\mathbb{E}[\\text{children per event}] = \\frac{\\alpha}{\\beta}`}</MathBlock>
          <p>If this ratio is greater than or equal to 1, the process can generate an <strong>infinite cascade</strong>. This connects directly to classical branching process theory.</p>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>Expected Total Events from One Immigrant</h3>
            <p>For a subcritical process (<InlineMath math="n < 1" />), the expected total cascade size from a single seed event is the geometric series:</p>
            <MathBlock>{`1 + n + n^2 + n^3 + \\cdots = \\frac{1}{1 - n}`}</MathBlock>
            <p>This is why a near-critical market explodes in volatility — as <InlineMath math="n \to 1" /> the expected cascade size diverges.</p>
          </div>
        </section>

        {/* ── Section 11: Poisson Process — Formal Definition (PoissonProcessExplaination.md) ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>11. Poisson Process — Formal Definition</h2>
          <p>A <strong>Poisson process</strong> is a stochastic counting process <InlineMath math="\{N(t),\, t \ge 0\}" /> defined by four core properties:</p>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>(A) Initial Condition</h3>
            <MathBlock>{`N(0) = 0`}</MathBlock>
            <p>No events at time zero.</p>
          </div>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>(B) Independent Increments</h3>
            <p>For disjoint intervals, increments are independent:</p>
            <MathBlock>{`N(t_2) - N(t_1) \\text{ is independent of } N(t_4) - N(t_3)`}</MathBlock>
            <p>What happens in one time window tells you nothing about another.</p>
          </div>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>(C) Stationary Increments</h3>
            <p>The number of arrivals depends only on the <em>length</em> of the interval, not its position in time:</p>
            <MathBlock>{`N(t+h) - N(t) \\sim \\text{Poisson}(\\lambda h)`}</MathBlock>
          </div>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>(D) Small Interval Property</h3>
            <p>For very small <InlineMath math="h" />:</p>
            <MathBlock>{`P(\\text{1 event in } h) = \\lambda h + o(h)`}</MathBlock>
            <MathBlock>{`P(\\text{2+ events in } h) = o(h)`}</MathBlock>
            <MathBlock>{`P(\\text{0 events}) = 1 - \\lambda h + o(h)`}</MathBlock>
            <p>where <InlineMath math="\lambda > 0" /> is the <strong>intensity (rate)</strong>.</p>
          </div>
        </section>

        {/* ── Section 12: Poisson Process — Key Properties (PoissonProcessExplaination.md) ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>12. Poisson Process — Key Properties</h2>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>Intensity and Moments</h3>
            <p>The intensity is defined as:</p>
            <MathBlock>{`\\lambda = \\lim_{h \\to 0} \\frac{\\mathbb{E}[N(t+h) - N(t)]}{h}`}</MathBlock>
            <p>For a homogeneous Poisson process, mean and variance are equal:</p>
            <MathBlock>{`\\mathbb{E}[N(t)] = \\lambda t \\qquad \\text{Var}(N(t)) = \\lambda t`}</MathBlock>
            <p>This <strong>mean = variance</strong> identity is a diagnostic property — violations in real data signal over-dispersion.</p>
          </div>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>Inter-Arrival Distribution</h3>
            <p>Let <InlineMath math="T_1" /> be the time until the first arrival. Since:</p>
            <MathBlock>{`P(T_1 > t) = P(N(t) = 0) = e^{-\\lambda t}`}</MathBlock>
            <p>the inter-arrival density is <InlineMath math="f(t) = \lambda e^{-\lambda t}" />, so inter-arrivals are IID:</p>
            <MathBlock>{`T_i \\sim \\text{Exponential}(\\lambda)`}</MathBlock>
          </div>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>Memoryless Property</h3>
            <p>The exponential distribution satisfies the memoryless property:</p>
            <MathBlock>{`P(T > s + t \\mid T > s) = P(T > t)`}</MathBlock>
            <p>Equivalently, the hazard rate is constant:</p>
            <MathBlock>{`h(t) = \\frac{f(t)}{1 - F(t)} = \\lambda`}</MathBlock>
          </div>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>Over-Dispersion in Real Data</h3>
            <p>Poisson implies <InlineMath math="\text{Var}(N(t)) = \mathbb{E}[N(t)]" />, but empirical data consistently shows:</p>
            <MathBlock>{`\\text{Var}(N(t)) > \\mathbb{E}[N(t)]`}</MathBlock>
            <p>This <strong>over-dispersion</strong> is the key empirical signature that motivates self-exciting models.</p>
          </div>
        </section>

        {/* ── Section 13: Transition from Poisson to Hawkes (PoissonProcessExplaination.md) ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>13. Transition from Poisson to Hawkes</h2>
          <p>The Poisson process assumes a history-independent intensity:</p>
          <MathBlock>{`\\lambda(t \\mid \\mathcal{H}_t) = \\lambda \\quad \\text{(constant)}`}</MathBlock>
          <p>The Hawkes process replaces this constant with a history-dependent one:</p>
          <MathBlock>{`\\lambda(t) = \\mu + \\sum_{t_i < t} \\phi(t - t_i)`}</MathBlock>
          <p>where <InlineMath math="\phi" /> is the excitation kernel. This single shift — from a constant intensity to a history-dependent intensity — is the entire conceptual foundation of Hawkes processes.</p>
          <p>Markets behave as:</p>
          <MathBlock>{`P(\\text{event at } t \\mid \\mathcal{H}_t) > \\lambda \\quad \\text{after recent events}`}</MathBlock>
          <p>Capturing this excess probability is precisely what the Hawkes model is designed to do.</p>
        </section>

        {/* ── Section 14: Hawkes Intensity — Regime Analysis (HawkesIntensity.md) ── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>14. Hawkes Intensity — Regime Analysis</h2>
          <p>The behaviour of the Hawkes process changes fundamentally depending on the parameter values. Three degenerate cases clarify the role of each parameter.</p>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>Case: <InlineMath math="\alpha = 0" /></h3>
            <p>No self-excitation. The process reduces to a homogeneous Poisson process — the baseline null model:</p>
            <MathBlock>{`\\lambda(t) = \\mu \\quad (\\text{Poisson null model})`}</MathBlock>
          </div>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>Case: <InlineMath math="\beta \to \infty" /></h3>
            <p>Excitation decays instantaneously. Each event produces a sharp spike that vanishes immediately — no meaningful clustering occurs. The exponential memory kernel:</p>
            <MathBlock>{`e^{-\\beta(t - t_i)}`}</MathBlock>
            <p>collapses to zero for any finite lag, so the system effectively has no memory.</p>
          </div>

          <div>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 500, marginTop: "16px", marginBottom: "8px" }}>Case: <InlineMath math="\alpha / \beta \geq 1" /> (Branching Ratio Condition)</h3>
            <p>The integral of the excitation kernel gives the expected offspring count per event:</p>
            <MathBlock>{`\\int_0^{\\infty} \\alpha e^{-\\beta(t - t_i)}\\,dt = \\frac{\\alpha}{\\beta}`}</MathBlock>
            <p>Setting <InlineMath math="n = \alpha / \beta" /> yields the following regime table:</p>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px", fontSize: "0.95rem" }}>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(237, 237, 237, 0.2)" }}>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>Branching Ratio</td>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>Regime</td>
                  <td style={{ padding: "8px", fontWeight: "bold" }}>Behaviour</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(237, 237, 237, 0.1)" }}>
                  <td style={{ padding: "8px" }}><InlineMath math="\alpha/\beta < 1" /></td>
                  <td style={{ padding: "8px" }}>Subcritical</td>
                  <td style={{ padding: "8px" }}>Stable and stationary</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(237, 237, 237, 0.1)" }}>
                  <td style={{ padding: "8px" }}><InlineMath math="\alpha/\beta = 1" /></td>
                  <td style={{ padding: "8px" }}>Critical</td>
                  <td style={{ padding: "8px" }}>Borderline unstable; long heavy clusters</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px" }}><InlineMath math="\alpha/\beta > 1" /></td>
                  <td style={{ padding: "8px" }}>Supercritical</td>
                  <td style={{ padding: "8px" }}>Non-stationary; intensity can blow up</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}