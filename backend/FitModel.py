"""
MLE optimizer for hawkes process parameters.

Fits hawkes process parameters (mu , alpha , beta) by minimizind negative log-likelihood.
Uses log-parameterization to enforce positivity and includes soft stability constraint.
""" 

import numpy as np

try:
    from scipy.optimize import minimize
except ImportError:
    minimize = None


try:
    from backend.Likelihood import HawkesLikelihood
except ImportError:
    from Likelihood import HawkesLikelihood

class FitModel:
    """
    Fit hawkes process parameters by MLE using log-parameterization

    we optimization over x = [log(mu) , log(alpha) , log(beta)] to enforce positivity
    A large penalty is returned is alpha / beta >=1 
    (stabilty violation).

    Attributes:
        event (np.ndarray) : Event times
        T (float): Terminal time
        ll (HawkesLikelihood) : Likelihood computer
        instance
    """



    def __init__(self , events , T):
        """
        Initialize MLE fitter

        Args:
            events (array-like) : Event times in [0 , T]
            T (float) : Terminal Time
        """

        self.events = events
        self.T = T
        self.ll = HawkesLikelihood(self.events , self.T)

    def _neg_loglik_from_logparams(self , x):
        """
            Objective function : negative log-likelihood with penalties.

            Args:
                x (np.ndarray) : log-parameters [log(mu) , log(alpha) , log(beta)]

            Returns:
            float: Negative log-likelihood (+large penalty if invalid region)
        """



        mu = float(np.exp(x[0]))
        alpha = float(np.exp(x[1]))
        beta = float(np.exp(x[2]))

        #Stability soft constraint: Penalize if alpha/beta >= 1
        if alpha/beta >= 1.0:
            #Large penalty to steer optimizer away from unstable region
            return 1e12 + 1e8 * (alpha/beta - 1.0)


        val = self.ll.log_likelihood(mu , alpha , beta)
        if not np.isfinite(val):
            return 1e12
        return -val
    
    def fit(self , x0= None , method="Nelder-Mead" , options=None):
        """
            Fit parameter via scipy.optimize.minimize

            Args:
                x0(np.ndarray , optional): Initial guess in log-space.
                    Defaults to log([0.1 , 0.1, 1.0])
                method (str) : Optimization method(default: "Nelder-Mead")
                options (dict , optional): Options dict passes to minimize
                    Default to {"maxiter" : 20000, "disp" : False}

            Returns:
                scipy.optimize.OptimizeResult: Result object with .result_params dict added.
                    result_params contains {"mu" , "alpha" , "beta"}
        """

        if minimize is None:
            raise ImportError(
                "scipy.optimize.minimize not available. "
                "Install scipy: pip install scipy"
            )
        if x0 is None:
            #default initialization (log space)
            x0 = np.log(np.array([0.1 , 0.1, 1.0]) , dtype=float)

        if options is None:
            options = {"maxiter" : 20000, "disp" : False}
        
        res = minimize(self._neg_loglik_from_logparams , x0 , method=method , options=options)

        #Added fitted parameters to result object

        res_params = np.exp(res.x)
        res.result_params ={
            "mu" : float(res_params[0]),
            "alpha" : float(res_params[1]),
            "beta" : float(res_params[2]),
        }
        return res