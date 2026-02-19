export default function Home() {
  return (
    <div className="text-center py-32 space-y-24">
      <section>
        <h1 className="text-center">Self-Exciting Point Processes</h1>
        
        <div className="space-y-6 text-[#b3b3b3] max-w-[720px] mx-auto mt-12">
          <p>
            In financial markets, events cluster. A large trade triggers volatility cascades.
            Submissions beget more submissions. This temporal autocorrelation violates the
            memoryless assumption underlying classical Poisson processes.
          </p>

          <p>
            The Hawkes process is a self-exciting point process where each event 
            increases the conditional probability of future events. Originally developed
            to model seismic aftershocks, Hawkes processes are now essential tools
            for understanding high-frequency trading, market microstructure, and systemic risk.
          </p>

          <p>
            This project develops a complete mathematical and computational framework for
            Hawkes processes: from theoretical foundations through maximum likelihood estimation,
            with numerical validation and interactive simulation.
          </p>

          <p className="text-[#7a7a7a] pt-6">
            Navigate using the menu above to explore theory, implementation, experiments,
            and an interactive demonstration.
          </p>
        </div>
      </section>
    </div>
  );
}
