import { SectionDivider } from "../components/SectionDivider";

export function Home() {
  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", padding: "80px 32px" }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "32px" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 600, marginBottom: 0 }}>
          Self-Exciting Point Processes
        </h1>
        
        <SectionDivider />
        
        <div style={{ color: "rgba(237, 237, 237, 0.8)", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "24px", textAlign: "left", marginTop: "64px" }}>
          <p>
            In financial markets, event clustering represents a fundamental challenge to classical 
            stochastic modeling. Traditional Poisson processes assume memoryless arrivals—each trade, 
            each order, independent of the past. Yet empirical evidence contradicts this assumption: 
            trades cluster, volatility persists, and market microstructure exhibits clear temporal dependence.
          </p>
          
          <p>
            This research examines <strong>Hawkes processes</strong>, a class of self-exciting point processes 
            where past events increase the conditional intensity of future arrivals. Originally developed for 
            seismology (modeling earthquake aftershocks), Hawkes processes have proven remarkably effective 
            in capturing the clustering dynamics of high-frequency trading data.
          </p>
          
          <p>
            We develop a complete mathematical framework—from first principles through maximum likelihood 
            estimation—and validate the model against synthetic and empirical datasets. The implementation 
            includes stability analysis, branching process interpretation, and model comparison via information 
            criteria.
          </p>
          
          <p style={{ color: "rgba(136, 136, 136, 0.8)", fontStyle: "italic", paddingTop: "16px" }}>
            This project represents a synthesis of stochastic calculus, statistical inference, and 
            computational implementation—demonstrating full-stack quantitative research capabilities.
          </p>
        </div>
      </div>
    </div>
  );
}
