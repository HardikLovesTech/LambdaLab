'use client';

import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function Experiments() {
  return (
    <div className="space-y-8">
      <h1>Experiments</h1>

      <section>
        <h2>Simulation Validation</h2>
        <p>
          We validate our Hawkes simulator against three parameter regimes.
        </p>

        <table className="w-full mt-6 border-collapse border border-[#1f2937]">
          <thead>
            <tr className="bg-[#111111]">
              <th className="px-4 py-2 text-left border border-[#1f2937]">μ</th>
              <th className="px-4 py-2 text-left border border-[#1f2937]">α</th>
              <th className="px-4 py-2 text-left border border-[#1f2937]">β</th>
              <th className="px-4 py-2 text-left border border-[#1f2937]">α/β</th>
              <th className="px-4 py-2 text-left border border-[#1f2937]">Regime</th>
              <th className="px-4 py-2 text-left border border-[#1f2937]">N (T=50)</th>
              <th className="px-4 py-2 text-left border border-[#1f2937]">Clustering</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-[#0f1419]">
              <td className="px-4 py-2 border border-[#1f2937]">0.5</td>
              <td className="px-4 py-2 border border-[#1f2937]">0.2</td>
              <td className="px-4 py-2 border border-[#1f2937]">1.0</td>
              <td className="px-4 py-2 border border-[#1f2937]">0.2</td>
              <td className="px-4 py-2 border border-[#1f2937]">Subcritical</td>
              <td className="px-4 py-2 border border-[#1f2937]">27</td>
              <td className="px-4 py-2 border border-[#1f2937]">Mild</td>
            </tr>
            <tr className="hover:bg-[#0f1419]">
              <td className="px-4 py-2 border border-[#1f2937]">0.5</td>
              <td className="px-4 py-2 border border-[#1f2937]">0.8</td>
              <td className="px-4 py-2 border border-[#1f2937]">1.0</td>
              <td className="px-4 py-2 border border-[#1f2937]">0.8</td>
              <td className="px-4 py-2 border border-[#1f2937]">Subcritical</td>
              <td className="px-4 py-2 border border-[#1f2937]">73</td>
              <td className="px-4 py-2 border border-[#1f2937]">Strong</td>
            </tr>
            <tr className="hover:bg-[#0f1419]">
              <td className="px-4 py-2 border border-[#1f2937]">0.5</td>
              <td className="px-4 py-2 border border-[#1f2937]">1.2</td>
              <td className="px-4 py-2 border border-[#1f2937]">1.0</td>
              <td className="px-4 py-2 border border-[#1f2937]">1.2</td>
              <td className="px-4 py-2 border border-[#1f2937]">Supercritical</td>
              <td className="px-4 py-2 border border-[#1f2937]">84 (T=10)</td>
              <td className="px-4 py-2 border border-[#1f2937]">Explosive</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-6 text-[#d1d5db]">
          <strong>Key observations:</strong>
        </p>
        <ul className="list-disc list-inside space-y-2 text-[#d1d5db] mt-4">
          <li>
            As <InlineMath math="\alpha/\beta" /> increases from 0.2 to 0.8, event count
            grows (27 → 73) and clustering becomes pronounced.
          </li>
          <li>
            When <InlineMath math="\alpha/\beta > 1" />, the process becomes unstable.
            We observe rapid event accumulation and must shorten the time window.
          </li>
          <li>
            Mean inter-arrival time decreases with stronger clustering:
            1.83 → 0.37 → 0.087 seconds.
          </li>
        </ul>
      </section>

      <section>
        <h2>Intensity Decay</h2>
        <p>
          After an event, intensity should decay exponentially at rate <InlineMath math="\beta" />.
          We fit log(intensity − μ) ~ −β·t for isolated spikes.
        </p>
        <ul className="list-disc list-inside space-y-2 text-[#d1d5db] mt-4">
          <li>
            <strong>α/β = 0.2:</strong> fitted slope ≈ −1.0 (isolated spikes decay cleanly)
          </li>
          <li>
            <strong>α/β = 0.8:</strong> fitted slope ≈ −0.46 (overlapping spikes reduce apparent decay)
          </li>
          <li>
            <strong>α/β = 1.2:</strong> fitted slope ≈ −1.0 for partial data (supercritical regime)
          </li>
        </ul>
      </section>

      <section>
        <h2>Poisson Baseline Comparison</h2>
        <p>
          Poisson process with λ = 0.5 over T = 50 generates ~25 events uniformly spaced.
          Hawkes processes with α &gt; 0 show clear clustering: events arrive in bursts.
        </p>
      </section>

      <section>
        <h2>Visual Evidence</h2>
        <p>
          See the <a href="/demo" className="text-[#3b82f6] hover:underline">Demo</a> page
          for interactive plots and real-time simulation visualization.
        </p>
      </section>
    </div>
  );
}
