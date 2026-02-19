# LambdaLabs
## Hawkes Process for Trade Arrivals
### A self-Exciting Point Process Framework For Modeling Market Microstructures
This project implements a complete research-grade pipeline for medeling high-frequency trade arrivals using the hawkes process, and compares it rigorously against a standard poisson process.

The goal is to quantify and analyze self-excitation, clustering , and endogenous market dynamics in tick-level financial data.

## Project Overview
Financial trades do not arrive independently. Market activity tends to cluster - bursts of trades  trigger further trades.

A poisson process assumes independent arrivals.
A Hawkes process models self-excitation:

$λ(t)=μ+ti​<t∑​αe−β(t−ti​)$

### This project:
- Implements Hawkes simulation from scratch(Ogata's thinnin algorihtm).
- Derives and codes the full log-likelihood function
- Performs MLE parameter estimation
- Compares Hawkes vs Poisson statistically.
- Analyses branching ratio and stability.
- Provides an interactive dashboard for visualization.

### Key Mathematical Concepts
- Temporal point processes
- Self-excitation intensity models
- Log-likelihood derivaiton
- Stabilty condition : 
$ n = ​α/β < 1 $
- Branching proces interpretation
- A|C model comaparison

## Features
### Poisson Process Baseline :
- Exponential inter-arrival simulation
- Analytical likelihood
-Distrubution validation
### Hawkes Simualation Engine :
- Ogata's thinnin algorithm
- Intensity tracking over time
- Event clustering visualization
- Stabilty Validation 
### Maximum Likelihood Estimation :
- Efficient log-liklihood implementation
- Constrained optimization
- Parameter recovery testion on synthetic data
-Likelihood surface analysis
### Real Market Situation :
- Tick-Level timestamp preprocessing
- Poisson vs Hawkes log-likelihood comparison
- A|C- Based model selection
- Branching ratio interpretation
### Interactive Dashboard :
- Simualation panel (μ, α, β controls)
- CSV upload for fitting
- Likelihood comparison output
- Interactive intensity visualization

## Tech Stack 
### Backend
- Python
- NumPy
- SciPy
- Pandas
- Matplotlib
- FastAPI

### Frontend
- React / Next.js (TBD)
- plotly.js
- Minimal quant-style UI

## What This Demonstrate
- Strong Understanding of Stochastic Processes
- Practical implementation of MLE under constraints
- Efficient numerical computation
- Model comparison rigor
- Clean mathematical documentation
- Financial market microstructure

## References to the notes :

- [Poisson Process](Notes/PoissonProcessExplaination.md) : Explains what exactly is poisso process , inter-arrival distribution , intensity definition , why memoryless property fails for trade data 
Along with all of these , it also has the explaination to why Poisson assumes independence and why does trade center clusters



# Author 

Hardik Runwal  
MIT , Manipal