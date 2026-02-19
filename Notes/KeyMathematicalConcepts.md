# Key Mathematical Concepts
## Temporal Point Process
### What is a Point Process?
A temporal point process model random event times:
$$
0 < t_1< t_2< t_3< t_4....
$$
Insteas of modeling values , we model when event occur.

### Counting Process Representation
Define : 
$$
N(t) \ = \ number \ of \ events \ up \ to \ time \ t
$$

Properties : 
- $N(0) = 0$
- Non - decreasing
- Jumps of size 1

This is the fundamental object.

### Conditional Intensity Function
The core object is:
$$
\lambda(t|\mathcal{H}_t)
$$
This means :
- Instantaneous event rate at a time t , given past history.
Formally:

$$
\lambda(t) = \lim_{\delta t \to 0}{{\mathbb{E} [N(t + \Delta t) - N(t) | \mathcal{H}_t]}\over \Delta t}
$$
This is the backbone of everything.

## Self-Excitation Intensity Models (Hawkes)

Now we move to the Hawkes Process
The intensity:
$$
\lambda (t) = \mu + \sum_{t_i < t} \alpha e ^ {- \beta (t - t_i)}
$$

## Log-Likelyhood Derivation
This is critical.
For a general point process.

$$
\mathcal{L} = \sum_{i = 1}^{N(T)} log\lambda (t_i) -\int_{0}^{T} \lambda(t)dt
$$

This is derived from:
- Conditional density formulation
- Product of conditional probabilities

### For Hawkes
Plug in :

$$
\lambda (t) = \mu + \sum_{t_i < t} \alpha e ^ {- \beta (t - t_i)}
$$

The log-likelyhood becomes :

$$
\mathcal{L} = \sum_{i = 1}^{N(T)} log(\mu + \sum_{t_i < t} \alpha e ^ {- \beta (t - t_i)}) -\int_{0}^{T} \lambda(t)dt
$$


#### The integral Term
Important :
$$
\int_{0}^{T} \lambda(t) dt\ = \ \mu T + \sum_{i} {\alpha \over \beta}(1- e ^ {- \beta (t - t_i)})
$$


You must understand this derivation , Its the standard exponential integration.

## Branching Process Interpretation
This is the beautiful theory.

$$
\mathbb{E}[children \ per \ event] = {\alpha \over \beta}
$$

If &ge; 1 &rarr; infinite cascade.  
This connects to branching process

### Expected Total Events from One immigrant
$$
1 + n + n^2 + n^3 + ... = {1 \over 1-n} \ \ \ (n < 1)
$$

This is why near-critical market explodes in volatility.

## AIC Model Comparison
When comparing models:
$$
AIC = 2k - 2\mathcal{L}_{max}
$$
Where:
- $k$ = number of parameters
- $\mathcal{L}_{max}$ = maximized log-likelihood    
Lower AIC = better tradeoffs between:
- Fit quality 
- Model Complexity

Use this to compare:    
1. Poisson vs Hawkes
2. Single vs Multi-Kernel Hawkes
