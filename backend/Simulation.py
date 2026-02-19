"""
Simulation engine for Poissons and Hawkes Processes.


Provides:
- PoissonProcess with Simulate(T , Lambda) and GetEventTimes()
- HawkesProcess with ogato thinning: Simulate(T) and GetEventTimes() , GetIntensityCurves() , ComputeIntensity(t)

"""


#Impoting libraries
import numpy as np
import matplotlib.pyplot as plt
import os

class PoissonProcess:
    def __init__(self):
        self.lambda_ = None
        self.events = np.array([])

    def Simulate(self , T , Lambda , rng=None):
        """
        Simulate a homogenous poissons process on [0 , T].
        
        :param self: Description
        :param T(float): end time
        :param Lambda(float): constant rate (lambda > 0)
        :param rng: Optional numpy RandomState or generator
        
        Returns:
        np.ndarray : event times
        """

        if Lambda <= 0 or T <= 0:
            self.lambda_ = Lambda
            self.events = np.array([])
            return self.events
        
        self.lambda_ = float(Lambda)
        rng = np.random if rng is None else rng

        events = []
        t =  0.0
        while True:
            dt = rng.exponential(1.0 / self.lambda_)
            t += dt
            if t > T:
                break
            events.append(t)

        self.events = np.array(events)
        return self.events
        
    def GetEventTimes(self):
        return self.events
    

class HawkesProcess:
    def __init__(self , mu , alpha, beta):
        """
        initalizes Hawkes Process parameters
        
        :param mu: baseline Activity (>= 0)
        :param alpha: jump size (>= 0)
        :param beta: decay rate (>0)
        """

        self.mu = float(mu)
        self.alpha = float(alpha)
        self.beta = float(beta)
        self.events = np.array([])

    def ComputeIntensityScalar(self , t , events):
        """ Return intensity lambda(t) fopr scalar time t given past events."""

        if len(events) == 0:
            return self.mu
        
        dt = t - np.array(events)
        # only events before t contribute
        mask = dt > 0
        if not np.any(mask):
            return self.mu
        contributions = self.alpha * np.exp(- self.beta * dt[mask])

        return self.mu + np.sum(contributions)
    

    def ComputeIntensity(self, times, events=None):
        """Vectorized intensity for array `times` given `events`."""
        if events is None:
            events = self.events
        intens = np.zeros_like(times, dtype=float)
        if len(events) == 0:
            intens[:] = self.mu
            return intens
        for event in events:
            # add alpha * exp(-beta*(t - event)) for t > event
            mask = times > event
            if np.any(mask):
                intens[mask] += self.alpha * np.exp(-self.beta * (times[mask] - event))
        intens += self.mu
        return intens

                
    def Simulate(self, T, rng=None):
        """Simulate Hawkes process over [0, T] using Ogata's thinning.

        This implementation uses a simple upper bound lambda_bar = mu + alpha * N,
        which is a valid global upper bound because e^{-beta * x} <= 1.
        It's not the tightest bound but is correct and stable for testing.

        Args:
            T (float): end time
            rng: optional numpy RandomState or Generator

        Returns:
            tuple: (events, intensity_times, intensity_values)
        """
        rng = np.random if rng is None else rng
        events = []
        t = 0.0
        max_iterations = int(1e7)
        max_events = int(1e6)
        it = 0

        while t < T and it < max_iterations:
            it += 1
            lambda_bar = self.mu + self.alpha * len(events)
            if lambda_bar <= 0:
                break

            u = rng.random()
            w = -np.log(u) / lambda_bar
            t_candidate = t + w
            if t_candidate > T:
                break

            # acceptance test
            lambda_t = self.ComputeIntensityScalar(t_candidate, events)
            D = rng.random()
            if D <= lambda_t / lambda_bar:
                events.append(t_candidate)
                t = t_candidate
                if len(events) >= max_events:
                    break
            else:
                t = t_candidate

        self.events = np.array(events)
        return self.events
    

    def GetEventTimes(self):
        return self.events
    
    def GetIntensityCurve(self , T , n_points = 2000 , events=None):
        """ return times and intensity value over [0 , T]"""
        times = np.linspace(0 , T , n_points)
        intens = self.ComputeIntensity(times , events)
        return times , intens
    

# --- Visualization / small runner ---

def PlotEventTimeline(times , events , title , fname = None):
    plt.figure(figsize=(10 , 3))
    plt.hlines(1 ,0 , times[-1] if len(times) else 1 , colors="#ddd")
    for e in events:
        plt.axvline(e , color="C1"  , alpha = 0.8)
    plt.xlim(0 , times[-1] if len(times) else 1)
    plt.yticks([])
    plt.xlabel("Time")
    plt.title(title)
    plt.tight_layout()
    if fname:
        plt.savefig(fname)
    plt.close()


def PlotInterarrivalHist(events , Lambda , title , fname=None):
    if len(events) < 2:
        return
    
    iats = np.diff(events)
    plt.figure(figsize=(6 ,4))
    plt.hist(iats , bins=30 , density=True , alpha = 0.6)
    xs = np.linspace(0, np.max(iats), 200)
    plt.plot(xs, Lambda * np.exp(-Lambda * xs), 'r-', label=f'Exp({Lambda:.2f})')
    plt.xlabel('Inter-arrival time')
    plt.ylabel('Density')
    plt.title(title)
    plt.legend()
    plt.tight_layout()
    if fname:
        plt.savefig(fname)
    plt.close()

def plot_intensity_with_events(times, intensity, events, title, fname=None):
    plt.figure(figsize=(10, 4))
    plt.plot(times, intensity, label='Intensity')
    for e in events:
        plt.axvline(e, color='k', alpha=0.2)
    plt.xlabel('Time')
    plt.ylabel('Intensity')
    plt.title(title)
    plt.tight_layout()
    if fname:
        plt.savefig(fname)
    plt.close()

def ensure_dir(dirname):
    if not os.path.exists(dirname):
        os.makedirs(dirname, exist_ok=True)






if __name__ == '__main__':
    # Basic sanity checks and visual outputs for the user-specified parameter sets.
    out_dir = os.path.join(os.path.dirname(__file__), '..', 'plots')
    # resolve to absolute
    out_dir = os.path.abspath(out_dir)
    ensure_dir(out_dir)

    rng = np.random.default_rng(42)

    # --- Poisson baseline ---
    T = 50.0
    Lambda = 0.5
    p = PoissonProcess()
    events_p = p.Simulate(T, Lambda, rng=np.random)

    print(f"Poisson: T={T}, Lambda={Lambda}, N={len(events_p)}")
    if len(events_p) >= 2:
        iats = np.diff(events_p)
        print(f"Mean IAT: {np.mean(iats):.4f} (expected {1/Lambda:.4f})")

    # plot
    if len(events_p) > 0:
        PlotEventTimeline(np.linspace(0, T, 2), events_p,
                            f"Poisson timeline (lambda={Lambda})",
                            fname=os.path.join(out_dir, 'poisson_timeline.png'))
        PlotInterarrivalHist(events_p, Lambda,
                                f"Poisson IAT histogram (lambda={Lambda})",
                                fname=os.path.join(out_dir, 'poisson_iat.png'))

    # --- Hawkes experiments ---
    experiments = [
        (0.5, 0.2, 1.0),
        (0.5, 0.8, 1.0),
        (0.5, 1.2, 1.0),
    ]

    for (mu, alpha, beta) in experiments:
        h = HawkesProcess(mu, alpha, beta)
        # detect potentially explosive regime: alpha / beta >= 1
        stability = alpha / beta if beta != 0 else float('inf')
        if stability >= 1.0:
            # run a shorter test and warn the user rather than hanging
            T_run = min(10.0, T)
            print(f"Warning: alpha/beta={stability:.2f} >= 1. Running shorter T={T_run} to avoid explosion.")
        else:
            T_run = T

        events_h, times, intens = h.Simulate(T_run, rng=np.random)
        print(f"Hawkes: mu={mu}, alpha={alpha}, beta={beta} (alpha/beta={stability:.2f}) -> N={len(events_h)}")

        base = f"hawkes_mu{mu}_a{alpha}_b{beta}".replace('.', 'p')
        PlotEventTimeline(times, events_h, f"Hawkes timeline {base}",
                            fname=os.path.join(out_dir, base + '_timeline.png'))
        plot_intensity_with_events(times, intens, events_h,
                                   f"Hawkes intensity {base}",
                                   fname=os.path.join(out_dir, base + '_intensity.png'))

    print(f"Plots written to: {out_dir}")
