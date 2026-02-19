import { CodeBlock } from "../components/CodeBlock";
import { InlineMath } from "react-katex";

export function Implementation() {
  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", padding: "80px 32px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "64px" }}>Implementation</h1>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "48px", lineHeight: 1.8, color: "rgba(237, 237, 237, 0.9)" }}>
        {/* Simulation */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>Simulation.py</h2>
          <p>
            We implement Ogata's thinning algorithm to generate synthetic Hawkes process data. 
            The algorithm uses an adaptive accept-reject scheme to sample from the time-varying intensity.
          </p>
          
          <CodeBlock
            title="simulate_hawkes(mu, alpha, beta, T)"
            code={`import numpy as np

def simulate_hawkes(mu, alpha, beta, T):
    """
    Simulate a univariate Hawkes process using Ogata's thinning algorithm.
    """
    events = []
    t = 0
    lambda_bar = mu  # Upper bound on intensity
    
    while t < T:
        u = np.random.uniform()
        t = t - np.log(u) / lambda_bar
        
        if t > T:
            break
            
        lambda_t = mu + sum(alpha * np.exp(-beta * (t - ti)) for ti in events)
        
        D = np.random.uniform()
        if D * lambda_bar <= lambda_t:
            events.append(t)
            lambda_bar = lambda_t + alpha
        else:
            lambda_bar = lambda_t
    
    return np.array(events)`}
          />
          
          <p>
            The thinning algorithm maintains an adaptive upper bound on intensity, ensuring efficient 
            sampling even when the true intensity varies rapidly.
          </p>
        </section>

        {/* Likelihood */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>Likelihood.py</h2>
          <p>
            The log-likelihood function evaluates both the event contribution (log intensities at 
            observed times) and the compensator (integral of intensity over the observation window).
          </p>
          
          <CodeBlock
            title="log_likelihood(params, events, T)"
            code={`import numpy as np

def log_likelihood(params, events, T):
    """
    Compute negative log-likelihood for Hawkes process.
    """
    mu, alpha, beta = params
    
    if mu <= 0 or alpha <= 0 or beta <= 0:
        return 1e10
    
    n = len(events)
    
    intensities = np.zeros(n)
    for i in range(n):
        intensities[i] = mu + alpha * np.sum(np.exp(-beta * (events[i] - events[:i])))
    
    ll_events = np.sum(np.log(intensities))
    
    compensator = mu * T
    for ti in events:
        compensator += (alpha / beta) * (1 - np.exp(-beta * (T - ti)))
    
    return -(ll_events - compensator)`}
          />
          
          <p>
            The compensator integral is computed analytically using the exponential kernel's closed form, 
            avoiding numerical integration errors.
          </p>
        </section>

        {/* Fitting */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>FitModel.py</h2>
          <p>
            We use constrained optimization (scipy.optimize.minimize with L-BFGS-B) to find maximum 
            likelihood estimates. Parameter bounds ensure positivity and stability.
          </p>
          
          <CodeBlock
            title="fit_hawkes(events, T)"
            code={`from scipy.optimize import minimize
import numpy as np

def fit_hawkes(events, T, initial_params=None):
    """
    Fit Hawkes process parameters via maximum likelihood estimation.
    """
    if initial_params is None:
        mu_init = len(events) / T
        alpha_init = 0.5
        beta_init = 1.0
        initial_params = (mu_init, alpha_init, beta_init)
    
    bounds = [
        (1e-6, None),
        (1e-6, 0.99),
        (1e-6, None),
    ]
    
    result = minimize(
        log_likelihood,
        initial_params,
        args=(events, T),
        method='L-BFGS-B',
        bounds=bounds
    )
    
    mu_hat, alpha_hat, beta_hat = result.x
    
    return {
        'mu': mu_hat,
        'alpha': alpha_hat,
        'beta': beta_hat,
        'branching_ratio': alpha_hat / beta_hat,
        'log_likelihood': -result.fun,
        'aic': 2 * 3 - 2 * (-result.fun),
        'success': result.success
    }`}
          />
          
          <p>
            We impose <InlineMath math="\alpha < 1" /> as a conservative bound, though the true 
            stability condition is <InlineMath math="\alpha/\beta < 1" />. This simplifies 
            optimization while ensuring stable solutions.
          </p>
        </section>

        {/* Model Comparison */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 600, marginTop: 0 }}>ModelComparison.py</h2>
          <p>
            We compare Hawkes against a baseline Poisson process using AIC and visualize the 
            intensity fit quality.
          </p>
          
          <CodeBlock
            title="compare_models(events, T)"
            code={`import numpy as np

def fit_poisson(events, T):
    """Fit homogeneous Poisson process."""
    mu_hat = len(events) / T
    ll = len(events) * np.log(mu_hat) - mu_hat * T
    return {
        'mu': mu_hat,
        'log_likelihood': ll,
        'aic': 2 * 1 - 2 * ll
    }

def compare_models(events, T):
    """
    Compare Hawkes vs Poisson on observed data.
    """
    poisson_fit = fit_poisson(events, T)
    hawkes_fit = fit_hawkes(events, T)
    
    delta_aic = hawkes_fit['aic'] - poisson_fit['aic']
    lr_stat = 2 * (hawkes_fit['log_likelihood'] - poisson_fit['log_likelihood'])
    
    return {
        'poisson_aic': poisson_fit['aic'],
        'hawkes_aic': hawkes_fit['aic'],
        'delta_aic': delta_aic,
        'lr_statistic': lr_stat,
        'prefers_hawkes': delta_aic < -10
    }`}
          />
          
          <p>
            A <InlineMath math="\Delta\text{AIC} < -10" /> indicates strong evidence favoring the Hawkes 
            model—the additional parameters meaningfully improve fit beyond random chance.
          </p>
        </section>
      </div>
    </div>
  );
}
