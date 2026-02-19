# Poisson Process
##  Definition of a Poisson Process

A **Poisson process** is a stochastic counting process  
$ \{N(t), t \ge 0\} $  
that models the number of events occurring up to time $t$.

It is defined by three core properties:

---

### (A) Initial Condition

$$
N(0) = 0
$$

No events at time zero.

---

### (B) Independent Increments

For disjoint intervals,

$$
N(t_2) - N(t_1) \text{ is independent of } N(t_4) - N(t_3)
$$

if the intervals $[t_1,t_2]$ and $[t_3,t_4]$ do not overlap.

 Meaning: what happens in one time window tells you nothing about another.

---

### (C) Stationary Increments

The number of arrivals in an interval depends only on the **length** of the interval, not on its position in time.

$$
N(t+h) - N(t) \sim \text{Poisson}(\lambda h)
$$

---

### (D) Small Interval Property (Infinitesimal Definition)

For very small $h$:

$$
P(\text{1 event in } h) = \lambda h + o(h)
$$

$$
P(\text{2+ events in } h) = o(h)
$$

$$
P(\text{0 events}) = 1 - \lambda h + o(h)
$$

where $\lambda > 0$ is the **intensity (rate)**.

---

##  Intensity ($\lambda$) Definition

The intensity is defined as:

$$
\lambda = \lim_{h \to 0} 
\frac{\mathbb{E}[N(t+h) - N(t)]}{h}
$$

Interpretation:

> Expected number of events per unit time.

For homogeneous Poisson:

$$
\mathbb{E}[N(t)] = \lambda t
$$

$$
\text{Var}(N(t)) = \lambda t
$$

Important identity:

$$
\text{Mean} = \text{Variance}
$$

---

##  Inter-Arrival Distribution

Let $T_1$ be time until first arrival.

$$
P(T_1 > t) = P(N(t) = 0)
$$

For Poisson:

$$
P(N(t) = 0) = e^{-\lambda t}
$$

So:

$$
P(T_1 > t) = e^{-\lambda t}
$$

Density:

$$
f(t) = \lambda e^{-\lambda t}
$$

Thus:

$$
T_i \sim \text{Exponential}(\lambda)
$$

Inter-arrivals are IID.

---

##  Memoryless Property

Exponential satisfies:

$$
P(T > s+t \mid T > s) = P(T > t)
$$

Equivalent to constant hazard:

$$
h(t) = \frac{f(t)}{1 - F(t)} = \lambda
$$

---

##  Conditional Intensity View

Let $\mathcal{H}_t$ be history up to time $t$.

For Poisson:

$$
\lambda(t \mid \mathcal{H}_t) = \lambda
$$

It does **not depend on the past**.

---

##  Over-Dispersion in Real Data

Poisson implies:

$$
\text{Var}(N(t)) = \mathbb{E}[N(t)]
$$

In real trade data:

$$
\text{Var}(N(t)) > \mathbb{E}[N(t)]
$$

This is called **over-dispersion**.

---

##  Transition to Hawkes

Instead of constant intensity:

$$
\lambda = \text{constant}
$$

We move to:

$$
\lambda(t) = \mu + \sum_{t_i < t} \phi(t - t_i)
$$

Now intensity depends on past events.

This introduces **self-excitation**.

---

##  Core Insight

Poisson assumes:

$$
P(\text{event at } t \mid \mathcal{H}_t) = \lambda
$$

Markets behave like:

$$
P(\text{event at } t \mid \mathcal{H}_t) > \lambda 
\quad \text{after recent events}
$$

That single shift — from constant intensity to history-dependent intensity — is the foundation of Hawkes processes.


## Author 

Hardik Runwal  
MIT , Manipal