'use client';

import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function Theory() {
  return (
    <div>
      <h1>Mathematical Theory</h1>

      {/* Section 1: Poisson Foundation */}
      <section>
        <h2>1. Poisson Process Foundation</h2>
        
        <p>
          A homogeneous Poisson process with rate λ is the baseline model for independent
          random events. The probability of observing exactly k events in a time interval [0, T] is:
        </p>

        <div className="equation-card">
          <BlockMath math="P(N(t) = k) = \frac{(\lambda t)^k e^{-\lambda t}}{k!}" />
        </div>

        <p>
          This process exhibits complete <strong>memorylessness</strong>: the future evolution
          is independent of the past. Formally, given that an event occurred at time s,
          the probability of the next event is the same as if starting fresh.
        </p>

        <p>
          Inter-arrival times follow an exponential distribution with mean <InlineMath math="1/\lambda" />,
          and the number of events in any interval is Poisson-distributed with mean <InlineMath math="\lambda T" />.
        </p>
      </section>

      {/* Section 2: Why Poisson Fails */}
      <section>
        <h2>2. The Memoryless Limitation</h2>
        
        <p>
          Classical Poisson models assume independence, which is fundamentally violated in
          financial data. Evidence of temporal clustering:
        </p>

        <ul>
          <li><strong>Trade clustering:</strong> Large trades trigger subsequent orders within milliseconds</li>
          <li><strong>Volatility persistence:</strong> High-volatility periods persist, inconsistent with Poisson memorylessness</li>
          <li><strong>Overdispersion:</strong> Variance of event counts exceeds the mean, a signature of clustering</li>
          <li><strong>Autocorrelation:</strong> The intensity itself exhibits time-dependence</li>
        </ul>

        <div className="info-box">
          <p>
            Empirical studies of high-frequency trading data show that inter-arrival times are
            far more variable than predicted by exponential distributions. This is the key signature
            that self-excitement is at play.
          </p>
        </div>
      </section>

      {/* Section 3: Hawkes Intensity Function */}
      <section>
        <h2>3. Hawkes Process Definition</h2>
        
        <p>
          A Hawkes process is a self-exciting point process where the conditional intensity
          (hazard rate) at time t depends on all past events. The canonical form is:
        </p>

        <div className="equation-card">
          <BlockMath math="\lambda(t) = \mu + \sum_{t_i < t} \alpha e^{-\beta (t - t_i)}" />
        </div>

        <p>
          The three parameters control the process dynamics:
        </p>

        <ul>
          <li>
            <strong>μ (baseline):</strong> The exogenous intensity—events that occur independently.
            This is strictly positive for a well-defined process.
          </li>
          <li>
            <strong>α (excitation magnitude):</strong> The jump size. Each past event
            <InlineMath math="t_i" /> contributes <InlineMath math="\alpha" /> to the current intensity.
          </li>
          <li>
            <strong>β (decay rate):</strong> How quickly the effect of past events decays.
            Larger β means faster decay (shorter memory). Typical range: [0.5, 5.0].
          </li>
        </ul>

        <p>
          The intensity is a convex combination of the baseline and an exponential-weighted sum
          of past events. When no events have occurred, <InlineMath math="\lambda(t) = \mu" />.
          Each new event instantaneously increases intensity by α, then the process decays exponentially.
        </p>
      </section>

      {/* Section 4: Branching Interpretation */}
      <section>
        <h2>4. Branching Ratio & Stability</h2>
        
        <p>
          The Hawkes process can be interpreted as a branching process. Each event generates
          a random number of "offspring" (descendant events) via the self-exciting mechanism.
          The expected number of direct children from a single event is:
        </p>

        <div className="equation-card">
          <BlockMath math="n = \frac{\alpha}{\beta}" />
        </div>

        <p>
          This quantity is critical for stability:
        </p>

        <ul>
          <li>
            <strong>If n &lt; 1 (subcritical):</strong> The process is stable. Each event triggers
            less than one expected offspring on average, so the total intensity eventually decays
            to the baseline μ.
          </li>
          <li>
            <strong>If n = 1 (critical):</strong> The process is at the boundary. The intensity
            can persist indefinitely.
          </li>
          <li>
            <strong>If n &gt; 1 (supercritical):</strong> The process explodes. Self-excitement
            becomes self-sustaining, and the process escapes to infinity in finite time with positive probability.
          </li>
        </ul>

        <div className="info-box">
          <p>
            For practical modeling of financial data, we enforce <InlineMath math="n < 1" /> during estimation
            to ensure a stationary, stable process.
          </p>
        </div>
      </section>

      {/* Section 5: Log-Likelihood */}
      <section>
        <h2>5. Likelihood & Estimation</h2>
        
        <p>
          Given observed event times <InlineMath math="t_1, t_2, \ldots, t_N" /> on interval
          <InlineMath math="[0, T]" />, the log-likelihood for parameters <InlineMath math="(\mu, \alpha, \beta)" /> is:
        </p>

        <div className="equation-card">
          <BlockMath math="\ell(\mu, \alpha, \beta) = \sum_{i=1}^{N} \log \lambda(t_i) - \int_0^T \lambda(t) \, dt" />
        </div>

        <p>
          The first term is the log sum of intensities at observed event times (likelihood).
          The second term is the compensator integral—the cumulative intensity over the entire window.
        </p>

        <p>
          For the exponential kernel, the integral has a closed form:
        </p>

        <div className="equation-card">
          <BlockMath math="\int_0^T \lambda(t) \, dt = \mu T + \sum_{i=1}^{N} \frac{\alpha}{\beta} \left( 1 - e^{-\beta(T - t_i)} \right)" />
        </div>

        <p>
          Maximum likelihood estimation finds <InlineMath math="\hat{\mu}, \hat{\alpha}, \hat{\beta}" /> that maximize
          <InlineMath math="\ell" /> subject to constraints:
        </p>

        <ul>
          <li><InlineMath math="\mu > 0" /> (positive baseline)</li>
          <li><InlineMath math="\alpha \geq 0" /> (non-negative excitation)</li>
          <li><InlineMath math="\beta > 0" /> (positive decay)</li>
          <li><InlineMath math="\alpha / \beta < 1" /> (stability)</li>
        </ul>
      </section>

      {/* Section 6: Model Comparison */}
      <section>
        <h2>6. Model Comparison via AIC</h2>
        
        <p>
          To quantify whether Hawkes fits the data better than Poisson, we use the
          Akaike Information Criterion:
        </p>

        <div className="equation-card">
          <BlockMath math="\text{AIC} = 2k - 2 \log \hat{\ell}" />
        </div>

        <p>
          Where k is the number of parameters and <InlineMath math="\hat{\ell}" /> is the maximum log-likelihood.
        </p>

        <ul>
          <li><strong>Poisson:</strong> k = 1 parameter (λ)</li>
          <li><strong>Hawkes:</strong> k = 3 parameters (μ, α, β)</li>
        </ul>

        <p>
          Lower AIC indicates better fit. A Hawkes model with lower AIC than Poisson provides
          evidence that self-excitement is significant in the data.
        </p>

        <div className="info-box">
          <p>
            <strong>Practical interpretation:</strong> If <InlineMath math="\Delta \text{AIC} = \text{AIC}_{\text{Hawkes}} - \text{AIC}_{\text{Poisson}} < -10" />,
            we have strong evidence favoring Hawkes over Poisson.
          </p>
        </div>
      </section>
    </div>
  );
}
