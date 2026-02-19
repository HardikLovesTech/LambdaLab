# Hawkes Intensity
## Defination of Hawkes Intensity 

A **Hawkes Intensity** is defined according to the following formulae :

$$
\lambda(t) = \mu + \sum_{t_i < t} \alpha e^{- \beta (t - t_i)} 
$$

which is basically :

**__Current Event Intensity = Baseline Activity + Excitation from past events__**

## So what are those terms basically??
### $\mu$ 

$\mu$ is baseline activity. That is, At what rate will the events occur if no past events occured? 

If there were no self-excitation, the process reduces to 

$$
\lambda(t) = \mu  
$$
If you guys noticed - This is basically poisson process with rate $\mu$.

So overall we can say that $\mu$ basically controls how active was the system without feedback.

### $\alpha$ 

$\alpha$ is excitation strenght per event. Each time an event occurs at $t_i$, it increases the intensity by: 
$$
\alpha e^{- \beta (t - t_i)}
$$
Right at every moment 
$$
Jump\ size = \alpha
$$
If the value of $\alpha$ is high &rarr; Event triggers a stronger burst  
If the value of $\alpha$  is low &rarr; weak self-excitation 

### $\beta$

$\beta$ controls the decay speed of every excitation. It basically controls hov lonf the system "remembers" past events. 

If the value of $\beta$ is high &rarr; Excitation dies quickly (memory dies quickly)
If the value of $\beta$ is low &rarr; Slow decay (longer memory).

$\beta$ is also known as the excitation kernel.

$$
e ^ {- \beta (t - t_i)} \ \ \ \ \ - \ \ \ exponential \ memory\ decay
$$

### Now the Important Regime Questions !!
**What happens if $\alpha$ = 0 ?**
- Basically there wont be no excitation. It is nothing but a homogeneous process , which is infact Poisson Process $$ \lambda(t)  = \mu \ \ \ \  \ Baseline \ Null\ Model$$

**What happens if $\beta$ = &infin; ?**
- Basicallt there wont be any memory left.  
Effectively   :
1. Each event gives a sharp spike.
2. It Vanishes immediately.
3. No meaningful Clustering.

So excitation disappears almost instantly.

**What happens if $\alpha/\beta$ &ge; 1?**
- This is known as the __branching ratio condition__.
Define 
$$
n = {\alpha \over \beta} 
$$
Because, 

$$
\int_{0}^{\infty} \alpha e ^ {-\beta(t - t_i)} \ = {\ \alpha \over \beta}
$$

So why does this occur??
- This equals the expected number of offspring events triggered by one event.

- That integral equals the total expected exciation mass.

| Case 1 | Case 2 | Case 3 |    
|---|---|---|
|${\alpha \over \beta}$ &lt; 1 |${\alpha \over \beta}$ = 1 |${\alpha \over \beta}$ &gt; 1 | 
|Subcritical Process |Critical Regime |SuperCritical|
|Stable |Borderline Unstable |Intensity can blow up|
|Stationary |Long Heavy clusters , Dangerous !!|Non - Stationary|