"""
Log-Likelihod computation for univariate Hawkes process with exponential kernel.

This module provides the HawkesLikelihood class which computes:

    L = sum_i + log(lambda(t_i)) - integral_0^T lambda(t) dt

    Using O(n) recursive computation of intensities.
"""


import numpy as np

class HawkesLikelihood:
    """
    Log-Likelihood for univariate hawkes process with exponential kernel.

    Using O(n) recursion to compute intensities at event times.

    Attributes:
        events (nd.ndarray): Event times in [0 , T]
        T (float) : Terminal time
        n (int) : Number of events
    """

    def __init__(self , events , T):
        """
        Initialize likelihood computation
        
        :param events: Event times, must be sorted and in [0 , T]
        :param T: Terminal time > 0
        """

        self.events = np.sort(np.array(events , dtype = float))
        self.T = float(T)
        self.n = len(self.events)

    def log_likelihood(self , mu , alpha , beta , eps = 1e-12):
        """
        Compute log_likelihood L = sum_i + log(lambda(t_i)) - integral_0^T lambda(t) dt

        Parameters are assumed positive: If invalid values are provided, retunrn -inf.

        :param mu: (float) : Baseline intensity (must be > 0)
        :param alpha (float): Jump amplitude (must be >= 0)
        :param beta (float): Decay rate (must be > 0 )
        :param eps (float): small constant to avoid log(0)

        returns:
        float: log_likelihood value or -inf if parameters invalid or numerical error
        """


        if mu <= 0 or alpha < 0 or beta <=0:
            return -np.inf
        
        n = self.n
        if n==0:
            #No events: integral term only
            integral = mu * self.T
            return -integral
        
        events = self.events

        # Compute lambdas at event times using O(n) recurrsion
        #g_i = sum_{j < i} exp(-beta (t_i - t_j))
        #recurrsion: g_i = exp(-beta * dy) * (i + g_{i-1})

        lambdas = np.empty(n , dtype=float)
        g_prev = 0.0
        lambdas[0] = mu # no past events for first event

        for i in range(1 , n):
            dt = events[i] - events[i-1]
            g_i = np.exp(-beta * dt) * (1.0 + g_prev)
            lambdas[i] = mu + alpha * g_i

            g_prev = g_i

        #Safegaurd: intensities must be positive
        if np.any(lambdas <= 0 ):
            return -np.inf
        
        #Sum of log intensities
        logsum = np.sum(np.log(lambdas + eps))

        # Integral term : mu T + (alpha / beta) sum_i(i - exp(-beta (T - t_i)))
        integral = mu * self.T + (alpha/beta) * np.sum(1.0  -np.exp(- beta * (self.T - events)))

        return logsum - integral