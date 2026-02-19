'use client';

import { useState } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function Implementation() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-12">
      <h1>Implementation</h1>
      <p>
        This section walks through the core numerical routines: simulation and parameter estimation.
        All code is implemented in Python with NumPy for efficiency.
      </p>

      {/* Simulation Section */}
      <section>
        <h2>Simulation</h2>
        <p>
          We use <strong>Ogata's thinning algorithm</strong> to simulate Hawkes processes.
        </p>

        <div className="mt-4">
          <CollapsibleCode
            title="PoissonProcess.Simulate()"
            id="poisson_sim"
            expanded={expanded['poisson_sim']}
            toggle={() => toggleSection('poisson_sim')}
            code={`def Simulate(self, T, Lambda):
    """
    Generate event times from a Poisson process.
    
    Args:
        T: end time
        Lambda: constant rate
    
    Returns:
        np.ndarray: event times
    """
    events = []
    t = 0.0
    while True:
        dt = np.random.exponential(1.0 / Lambda)
        t += dt
        if t > T:
            break
        events.append(t)
    return np.array(events)`}
          />
          <p className="mt-4 text-[#d1d5db]">
            We sample inter-arrival times from <InlineMath math="\text{Exp}(\Lambda)" />.
            Each time is independent. When cumulative time exceeds T, we stop.
          </p>
        </div>

        <div className="mt-8">
          <CollapsibleCode
            title="HawkesProcess.Simulate() — Ogata's Thinning"
            id="hawkes_sim"
            expanded={expanded['hawkes_sim']}
            toggle={() => toggleSection('hawkes_sim')}
            code={`def Simulate(self, T):
    """
    Simulate Hawkes process using Ogata's thinning algorithm.
    
    1. Compute upper bound λ̄(t) = μ + α·N(t)
    2. Sample candidate time: Δt = -log(u) / λ̄
    3. Accept with probability λ(t) / λ̄(t)
    4. Repeat until T
    """
    events = []
    t = 0.0
    
    while t < T:
        # upper bound: valid because e^(-βx) ≤ 1
        lambda_bar = self.mu + self.alpha * len(events)
        
        if lambda_bar <= 0:
            break
        
        # sample candidate
        u = np.random.random()
        dt = -np.log(u) / lambda_bar
        t_candidate = t + dt
        
        if t_candidate > T:
            break
        
        # compute actual intensity
        lambda_t = self.ComputeIntensityScalar(t_candidate, events)
        
        # acceptance test
        u2 = np.random.random()
        if u2 <= lambda_t / lambda_bar:
            events.append(t_candidate)
            t = t_candidate
        else:
            t = t_candidate  # reject but advance time
    
    return np.array(events)`}
          />
          <p className="mt-4 text-[#d1d5db]">
            Ogata's method ensures we sample correctly from the intensity-weighted distribution.
            The upper bound <InlineMath math="\bar{\lambda} = \mu + \alpha N" /> is valid because
            each exponential kernel satisfies <InlineMath math="e^{-\beta x} \leq 1" />.
          </p>
        </div>
      </section>

      {/* Intensity Computation */}
      <section>
        <h2>Intensity Computation</h2>
        
        <div>
          <CollapsibleCode
            title="HawkesProcess.ComputeIntensity()"
            id="intensity"
            expanded={expanded['intensity']}
            toggle={() => toggleSection('intensity')}
            code={`def ComputeIntensity(self, times, events):
    """
    Compute λ(t) for array of times given past events.
    
    λ(t) = μ + Σ α e^{-β(t - t_i)} for all t_i < t
    """
    intens = np.zeros_like(times)
    
    if len(events) == 0:
        intens[:] = self.mu
        return intens
    
    for event in events:
        mask = times > event
        if np.any(mask):
            intens[mask] += self.alpha * np.exp(
                -self.beta * (times[mask] - event)
            )
    
    intens += self.mu
    return intens`}
          />
          <p className="mt-4 text-[#d1d5db]">
            We vectorize over time points for efficiency. Each past event contributes
            an exponentially decaying bump to all future times.
          </p>
        </div>
      </section>

      {/* Likelihood Computation */}
      <section>
        <h2>Likelihood & Log-Likelihood</h2>
        
        <div>
          <CollapsibleCode
            title="Likelihood.ComputeLogLikelihood()"
            id="loglik"
            expanded={expanded['loglik']}
            toggle={() => toggleSection('loglik')}
            code={`def ComputeLogLikelihood(events, mu, alpha, beta, T):
    """
    Compute log-likelihood for Hawkes process.
    
    ℓ = Σ log λ(t_i) - ∫₀ᵀ λ(t) dt
    """
    n = len(events)
    
    if n == 0:
        # no events: likelihood is exp(-μT)
        return -mu * T
    
    # sum of log intensities at event times
    log_lik = 0.0
    for event_time in events:
        # λ(t_i) = μ + Σ α e^{-β(t_i - t_j)}
        intensity = mu
        for t_j in events:
            if t_j < event_time:
                intensity += alpha * np.exp(-beta * (event_time - t_j))
        
        if intensity > 0:
            log_lik += np.log(intensity)
    
    # integral term: ∫₀ᵀ [μ + α Σ e^{-β(t - t_i)}] dt
    #              = μT + α Σ (1 - e^{-β(T - t_i)}) / β
    integral = mu * T
    for event_time in events:
        integral += alpha * (1 - np.exp(-beta * (T - event_time))) / beta
    
    return log_lik - integral`}
          />
          <p className="mt-4 text-[#d1d5db]">
            The log-likelihood has two parts: the log-sum of intensities at observed events,
            and the integral of intensity over the entire horizon.
            The integral admits a closed form because the kernels are exponential.
          </p>
        </div>
      </section>

      {/* Model Fitting */}
      <section>
        <h2>Parameter Estimation (MLE)</h2>
        
        <div>
          <CollapsibleCode
            title="FitModel.fit_hawkes()"
            id="fit_mle"
            expanded={expanded['fit_mle']}
            toggle={() => toggleSection('fit_mle')}
            code={`from scipy.optimize import minimize

def fit_hawkes(events, T):
    """
    Fit Hawkes parameters using maximum likelihood.
    
    Constraints:
      - μ > 0
      - α ≥ 0
      - β > 0
      - α/β < 1 (stability)
    """
    
    def neg_log_lik(params):
        mu, alpha, beta = params
        if mu <= 0 or alpha < 0 or beta <= 0:
            return 1e10
        if alpha >= beta:  # supercritical
            return 1e10
        
        return -ComputeLogLikelihood(events, mu, alpha, beta, T)
    
    # initial guess
    mu_init = len(events) / T
    alpha_init = mu_init * 0.5
    beta_init = 1.0
    
    result = minimize(
        neg_log_lik,
        [mu_init, alpha_init, beta_init],
        method='Nelder-Mead',
        options={'maxiter': 5000}
    )
    
    mu_hat, alpha_hat, beta_hat = result.x
    return {
        'mu': mu_hat,
        'alpha': alpha_hat,
        'beta': beta_hat,
        'nll': result.fun,
        'success': result.success
    }`}
          />
          <p className="mt-4 text-[#d1d5db]">
            We use scipy's constrained optimization (Nelder-Mead) to find the maximum likelihood
            estimates. Constraints enforce stability (<InlineMath math="\alpha / \beta < 1" />).
          </p>
        </div>
      </section>

      {/* Model Comparison */}
      <section>
        <h2>Model Comparison</h2>
        
        <div>
          <CollapsibleCode
            title="ModelComparison.compare()"
            id="compare"
            expanded={expanded['compare']}
            toggle={() => toggleSection('compare')}
            code={`def compare_models(events, T):
    """
    Fit both Poisson and Hawkes; compare via AIC.
    
    AIC = 2k - 2 log(ℓ)
    """
    
    # Poisson: k=1
    lambda_hat = len(events) / T
    poisson_nll = -len(events) * np.log(lambda_hat) + lambda_hat * T
    poisson_aic = 2 * 1 + 2 * poisson_nll
    
    # Hawkes: k=3
    hawkes = fit_hawkes(events, T)
    hawkes_aic = 2 * 3 + 2 * hawkes['nll']
    
    # prefer model with lower AIC
    delta_aic = hawkes_aic - poisson_aic
    
    return {
        'poisson': {'lambda': lambda_hat, 'aic': poisson_aic},
        'hawkes': {
            'mu': hawkes['mu'],
            'alpha': hawkes['alpha'],
            'beta': hawkes['beta'],
            'aic': hawkes_aic
        },
        'delta_aic': delta_aic,
        'better_model': 'hawkes' if delta_aic < 0 else 'poisson'
    }`}
          />
          <p className="mt-4 text-[#d1d5db]">
            Lower AIC indicates better fit. Negative <InlineMath math="\Delta \text{AIC}" /> favors Hawkes.
          </p>
        </div>
      </section>
    </div>
  );
}

function CollapsibleCode({
  title,
  id,
  expanded,
  toggle,
  code,
}: {
  title: string;
  id: string;
  expanded: boolean;
  toggle: () => void;
  code: string;
}) {
  return (
    <div className="border border-[#1f2937] rounded-lg overflow-hidden bg-[#111111]">
      <button
        onClick={toggle}
        className="w-full px-4 py-3 text-left hover:bg-[#0f1419] transition-colors flex justify-between items-center"
      >
        <span className="font-mono text-sm text-[#d1d5db]">{title}</span>
        <span className="text-[#6b7280]">{expanded ? '−' : '+'}</span>
      </button>
      {expanded && (
        <div className="px-0 py-0 bg-[#0a0a0a] border-t border-[#1f2937]">
          <pre className="m-0 p-4 overflow-x-auto">
            <code className="text-xs leading-relaxed text-[#d1d5db] font-mono">{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
