"""
Model comparison framework for poisson vs Hawkes processes.
Computes:
    - Poisson MLE: λ̂ = N/T
    - Poisson log-likelihood: L_p = N*log(λ̂) - λ*T
    - Hawkes log-likelihood: L_H = from fitted hawkes model
    - AIC for both models: AIC = 2*k - 2*L where k is number of parameters (1 for Poisson, 3 for Hawkes)
    - AIC difference and evidence ratio

Interpretation:
    - ΔAIC = AIC_Hawkes - AIC_Poisson
    - ΔAIC < -10: Very strong evidence for Hawkes
    - ΔAIC ∈ [-10, -5]: Strong evidence for Hawkes
    - ΔAIC ∈ [-5, 5]: Weak/inconclusive evidence
    - ΔAIC > 5: Evidence for Poisson (simpler model)
    - Evidence ratio ≈ exp(-ΔAIC/2)
"""


import numpy as np

try:
    from backend.FitModel import FitModel
    from backend.Likelihood import HawkesLikelihood
except ImportError:
    from FitModel import FitModel
    from Likelihood import HawkesLikelihood

class ModelComparison:
    """
    Compare poisson and Hawkes models using information criteria (AIC).
    
    Attributes:
        events (np.ndarray): Event times in [0 , T]
        T (float): Terminal time
        n (int): Number of events
    """

    def __init__(self , events , T):
        """
        Initialize model comparison framework.

        Args:
            events (array-like): Event times in [0 , T] must be sorted
            T (float): Terminal time > 0
        """

        self.events = np.sort(np.array(events , dtype = float))
        self.T = float(T)
        self.n = len(self.events)
    
    def fit_poisson(self):
        """
        Fit Poisson model via MLE.

        returns:
            dict: {'lambda': λ̂ , 'log_likelihood': L_P , 'AIC': AIC_P}
        """

        lambda_hat = self.n / self.T
        # Log-likelihood: L_P = N*log(λ̂) - λ̂*T
        if lambda_hat <= 0:
            loglik = -np.inf
        else:
            loglik = self.n * np.log(lambda_hat) - lambda_hat * self.T

        #AIC with k=1 parameter
        aic = 2 * 1 - 2 * loglik

        return {'lambda': lambda_hat , 'loglik' : loglik , 'aic': aic , 'k': 1}
        

    def  fit_hawkes(self , x0 = None , method ="Nelder-Mead" , options=None):
        """
        Fit Hawkes model via MLE using FitModel class.

        Args:
            x0 (array-like): Initial guess in log-space
            method (str): Optimization method
            options (dict): Options for optimizer

        returns:
            dict: {'mu': μ̂ , 'alpha': α̂ , 'beta': β̂ , 'loglik': L_H , 'AIC': AIC_H , 'fit_result' : res}
        """

        fitter = FitModel(self.events , self.T)
        try:
            res = fitter.fit(x0=x0 , method=method , options=options)
        except Exception as e:
            print(f"Error fitting Hawkes model: {e}")
            return {'mu': np.nan , 'alpha': np.nan , 'beta': np.nan , 'loglik': -np.inf , 'aic': np.inf , 'k': 3, 'fit_result': None}
        
        mu_hat = res.result_params["mu"]
        alpha_hat = res.result_params["alpha"]
        beta_hat = res.result_params["beta"]

        # Compute log-likelihood at fitted parameters
        ll = HawkesLikelihood(self.events , self.T)
        loglik = ll.log_likelihood(mu_hat , alpha_hat , beta_hat)

        #AIC with k=3 parameters
        aic = 2 * 3 - 2 * loglik

        return {'mu': mu_hat , 'alpha': alpha_hat , 'beta': beta_hat , 'loglik': loglik , 'aic': aic , 'k': 3, 'fit_result': res}
    

    def compare(self , x0 = None , method="Nelder-Mead" , options=None):
        """
        Fit both models and compare using AIC.

        Args:
            x0 (array-like): Initial guess for Hawkes (log-space)
            method (str): Optimization method for Hawkes
            options (dict): Options dict for optimizer

        returns:
            dict: Comparison results including AIC values and delta AIC and interpretation
        """


        poisson_result = self.fit_poisson()
        hawkes_result = self.fit_hawkes(x0=x0 , method=method , options=options)

        aic_poisson = poisson_result['aic']
        aic_hawkes = hawkes_result['aic']
        delta_aic = aic_hawkes - aic_poisson

        #Evidence ratio: exp(-ΔAIC/2)
        evidence_ratio = np.exp(-delta_aic / 2)

        #interpretation
        if delta_aic < -10:
            interpretation = "Very strong evidence for Hawkes"
        elif delta_aic < -5:
            interpretation = "Strong evidence for Hawkes"
        elif delta_aic < -1:
            interpretation = "Weak evidence for Hawkes"
        elif delta_aic < 1:
            interpretation = "Inconclusive (models similar)"
        elif delta_aic < 5:
            interpretation = "Weak evidence for Poisson (no strong clustering)"
        elif delta_aic < 10:
            interpretation = "Strong evidence for Poisson (No clustering)"
        else:
            interpretation = "Very strong evidence for Poisson (No clustering)"



        return {
            'poisson': poisson_result,
            'hawkes': hawkes_result,
            'aic_poisson': aic_poisson,
            'aic_hawkes': aic_hawkes,
            'delta_aic': delta_aic,
            'evidence_ratio': evidence_ratio,
            'interpretation': interpretation,
            'winner': 'Hawkes' if delta_aic < 0 else 'Poisson'
        }