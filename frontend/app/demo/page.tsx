'use client';

import { useState } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function Demo() {
  const [mu, setMu] = useState(0.5);
  const [alpha, setAlpha] = useState(0.8);
  const [beta, setBeta] = useState(1.0);
  const [T, setT] = useState(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const stability = beta !== 0 ? alpha / beta : Infinity;

  const handleSimulate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mu, alpha, beta, T }),
      });
      if (!response.ok) throw new Error('Simulation failed');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error running simulation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1>Interactive Demo</h1>

      {/* Input Panel */}
      <div className="bg-[#111111] border border-[#1f2937] rounded-lg p-8 max-w-md mx-auto w-full">
        <h2 className="text-xl font-semibold mb-6">Hawkes Parameters</h2>

        <div className="space-y-6">
          {/* Mu */}
          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-2">
              μ (Baseline Intensity)
            </label>
            <input
              type="number"
              value={mu}
              onChange={(e) => setMu(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0"
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#1f2937] rounded text-[#ededed] focus:border-[#3b82f6] outline-none"
            />
            <p className="text-xs text-[#6b7280] mt-1">λ₀ = background rate</p>
          </div>

          {/* Alpha */}
          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-2">
              α (Jump Size)
            </label>
            <input
              type="number"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0"
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#1f2937] rounded text-[#ededed] focus:border-[#3b82f6] outline-none"
            />
            <p className="text-xs text-[#6b7280] mt-1">Endogenous contribution per event</p>
          </div>

          {/* Beta */}
          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-2">
              β (Decay Rate)
            </label>
            <input
              type="number"
              value={beta}
              onChange={(e) => setBeta(parseFloat(e.target.value) || 1)}
              step="0.1"
              min="0.01"
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#1f2937] rounded text-[#ededed] focus:border-[#3b82f6] outline-none"
            />
            <p className="text-xs text-[#6b7280] mt-1">Exponential decay rate</p>
          </div>

          {/* T */}
          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-2">
              T (Time Horizon)
            </label>
            <input
              type="number"
              value={T}
              onChange={(e) => setT(parseFloat(e.target.value) || 50)}
              step="10"
              min="1"
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#1f2937] rounded text-[#ededed] focus:border-[#3b82f6] outline-none"
            />
            <p className="text-xs text-[#6b7280] mt-1">Length of observation window</p>
          </div>

          {/* Stability Indicator */}
          <div className="p-4 bg-[#0a0a0a] border border-[#1f2937] rounded">
            <p className="text-sm text-[#d1d5db]">
              <strong>Stability Ratio:</strong> <InlineMath math="\frac{\alpha}{\beta} = " /> {stability.toFixed(2)}
            </p>
            {stability >= 1 && (
              <p className="text-xs text-red-400 mt-2">
                ⚠️ α/β ≥ 1: process may explode. Shortening T.
              </p>
            )}
            {stability < 1 && (
              <p className="text-xs text-green-400 mt-2">
                ✓ Stable (α/β &lt; 1)
              </p>
            )}
          </div>

          {/* Run Button */}
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-3 bg-[#3b82f6] text-white rounded font-medium hover:bg-[#2563eb] disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="spinner"></div>
                Running...
              </div>
            ) : (
              'Run Simulation'
            )}
          </button>

          {error && (
            <p className="text-sm text-red-400 bg-red-900/20 p-3 rounded">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-8 mt-12">
          <h2>Results</h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard
              label="Events"
              value={result.n_events}
              description="Total events generated"
            />
            <StatCard
              label="Mean IAT"
              value={result.mean_iat?.toFixed(3)}
              description="seconds"
            />
            <StatCard
              label="IAT Std Dev"
              value={result.std_iat?.toFixed(3)}
              description="Variance in spacing"
            />
            <StatCard
              label="Peak Intensity"
              value={result.peak_intensity?.toFixed(2)}
              description="Maximum λ(t)"
            />
          </div>

          {result.plot_timeline && (
            <div>
              <h3>Event Timeline</h3>
              <img
                src={result.plot_timeline}
                alt="Event timeline"
                className="w-full rounded border border-[#1f2937]"
              />
            </div>
          )}

          {result.plot_intensity && (
            <div>
              <h3>Intensity Curve</h3>
              <img
                src={result.plot_intensity}
                alt="Intensity curve"
                className="w-full rounded border border-[#1f2937]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number | undefined;
  description: string;
}) {
  return (
    <div className="bg-[#111111] border border-[#1f2937] rounded p-4">
      <p className="text-xs text-[#6b7280] mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#ededed]">{value ?? '—'}</p>
      <p className="text-xs text-[#6b7280] mt-2">{description}</p>
    </div>
  );
}
