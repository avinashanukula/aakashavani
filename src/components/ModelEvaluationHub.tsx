import React, { useState } from 'react';
import { AakashavaniLogo } from './logos/AakashavaniLogo';
import { CheckCircle2, ShieldAlert, BarChart2, Info, ArrowUpRight } from 'lucide-react';

interface ModelVariant {
  id: string;
  name: string;
  tag: string;
  releaseDate: string;
  description: string;
  benchmarks: string;
  acceptableUses: string;
  invalidationTrigger: string;
  scores: {
    label: string;
    veironScore: number;
    standardLLMScore: number;
    staticQuantScore: number;
  }[];
}

const MODEL_VARIANTS: ModelVariant[] = [
  {
    id: 'akhvni-core',
    name: 'Aakashavani 0.1.2 Core',
    tag: 'Primary Financial World Model',
    releaseDate: 'September 24, 2026',
    description: 'Veiron’s foundational continuous world model for institutional capital environments. Recursively aligns cross-asset order flow, options volatility skew, and macroeconomic policy shifts.',
    benchmarks: 'Trained on 42 global equity & derivative exchanges, 14 sovereign yield curves, and 15 years of high-frequency tick records.',
    acceptableUses: 'Institutional risk budgeting, cross-asset macro strategy, systemic liquidity stress simulation.',
    invalidationTrigger: 'Sudden tick divergence > 3.2σ across paired liquidity pools forces immediate model state re-anchoring.',
    scores: [
      { label: 'Epistemic Calibration (Brier Score)', veironScore: 94, standardLLMScore: 42, staticQuantScore: 68 },
      { label: 'Regime Shift Adaptation (<50ms)', veironScore: 98, standardLLMScore: 23, staticQuantScore: 54 },
      { label: 'Adversarial Falsification Rate', veironScore: 91, standardLLMScore: 31, staticQuantScore: 60 },
      { label: 'Hallucination Suppression in Stress', veironScore: 99, standardLLMScore: 36, staticQuantScore: 72 }
    ]
  },
  {
    id: 'akhvni-macro',
    name: 'Aakashavani Macro Specialist',
    tag: 'Sovereign & Central Bank Transmission',
    releaseDate: 'September 12, 2026',
    description: 'Specialized for central bank policy statements, cross-currency basis swaps, and peripheral sovereign debt contagion propagation.',
    benchmarks: 'Ingests G10 central bank balance sheets, interbank repo clearing telemetry, and real-time trade balance figures.',
    acceptableUses: 'Central bank stress testing, currency reserve protection, sovereign debt rollover analysis.',
    invalidationTrigger: 'Central bank forward guidance de-anchoring or unexpected emergency swap facility announcement.',
    scores: [
      { label: 'Epistemic Calibration (Brier Score)', veironScore: 92, standardLLMScore: 48, staticQuantScore: 74 },
      { label: 'Regime Shift Adaptation (<50ms)', veironScore: 95, standardLLMScore: 29, staticQuantScore: 58 },
      { label: 'Adversarial Falsification Rate', veironScore: 89, standardLLMScore: 35, staticQuantScore: 64 },
      { label: 'Hallucination Suppression in Stress', veironScore: 98, standardLLMScore: 41, staticQuantScore: 76 }
    ]
  },
  {
    id: 'akhvni-micro',
    name: 'Aakashavani Microstructure Engine',
    tag: 'Order Flow & Gamma Positioning',
    releaseDate: 'August 28, 2026',
    description: 'Operates directly on level-3 limit order book depth, market maker delta-gamma hedging cascades, and algorithmic execution footprinting.',
    benchmarks: 'Tested against the 2010 Flash Crash, 2020 March Liquidity Freeze, and 2023 US Regional Bank Run tick datasets.',
    acceptableUses: 'High-frequency execution protection, market impact mitigation, dealer pinning forecasting.',
    invalidationTrigger: 'Aggregated bid-ask spread widening exceeds 4.5x rolling median within 100ms.',
    scores: [
      { label: 'Epistemic Calibration (Brier Score)', veironScore: 96, standardLLMScore: 18, staticQuantScore: 79 },
      { label: 'Regime Shift Adaptation (<50ms)', veironScore: 99, standardLLMScore: 15, staticQuantScore: 65 },
      { label: 'Adversarial Falsification Rate', veironScore: 94, standardLLMScore: 24, staticQuantScore: 62 },
      { label: 'Hallucination Suppression in Stress', veironScore: 100, standardLLMScore: 28, staticQuantScore: 82 }
    ]
  }
];

export const ModelEvaluationHub: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'report' | 'trust' | 'commitments'>('report');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('akhvni-core');

  const currentVariant = MODEL_VARIANTS.find(v => v.id === selectedVariantId) || MODEL_VARIANTS[0];

  return (
    <div className="w-full bg-[#FAF8F5] text-[#141413] border border-[#E3E0D8] p-6 sm:p-10 font-sans">
      {/* Title & Introduction matching Anthropic video frames 00:10 - 00:11 */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pb-8">
        <div className="font-mono text-xs uppercase tracking-widest text-[#E5182B]">
          TRANSPARENCY & VERIFICATION HUB
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif text-[#141413] tracking-tight">
          Aakashavani Technical System Report
        </h2>
        <p className="text-xs sm:text-sm text-[#66645E] leading-relaxed">
          A rigorous overview of model architecture, safety boundaries, adversarial evaluation benchmarks, and continuous epistemic verification protocols.
        </p>
      </div>

      {/* Numbered Tabs matching Anthropic video frame 00:10 */}
      <div className="flex border-b border-[#E3E0D8] mb-8 overflow-x-auto text-xs sm:text-sm font-medium">
        <button
          onClick={() => setSelectedTab('report')}
          className={`pb-3 px-4 flex items-center gap-2 cursor-pointer border-b-2 transition-all whitespace-nowrap ${
            selectedTab === 'report'
              ? 'border-[#141413] text-[#141413] font-semibold'
              : 'border-transparent text-[#87857F] hover:text-[#141413]'
          }`}
        >
          <span className="font-mono text-xs text-[#E5182B]">01</span>
          <span>Model Architecture Report</span>
        </button>

        <button
          onClick={() => setSelectedTab('trust')}
          className={`pb-3 px-4 flex items-center gap-2 cursor-pointer border-b-2 transition-all whitespace-nowrap ${
            selectedTab === 'trust'
              ? 'border-[#141413] text-[#141413] font-semibold'
              : 'border-transparent text-[#87857F] hover:text-[#141413]'
          }`}
        >
          <span className="font-mono text-xs text-[#E5182B]">02</span>
          <span>Epistemic Calibration & Audit</span>
        </button>

        <button
          onClick={() => setSelectedTab('commitments')}
          className={`pb-3 px-4 flex items-center gap-2 cursor-pointer border-b-2 transition-all whitespace-nowrap ${
            selectedTab === 'commitments'
              ? 'border-[#141413] text-[#141413] font-semibold'
              : 'border-transparent text-[#87857F] hover:text-[#141413]'
          }`}
        >
          <span className="font-mono text-xs text-[#E5182B]">03</span>
          <span>Institutional Safety Mandates</span>
        </button>
      </div>

      {/* Model Selection Pills matching Anthropic video frame 00:11 */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs font-mono text-[#87857F] mr-2">VARIANT:</span>
        {MODEL_VARIANTS.map(variant => (
          <button
            key={variant.id}
            onClick={() => setSelectedVariantId(variant.id)}
            className={`px-3.5 py-1.5 text-xs font-mono transition-all cursor-pointer ${
              selectedVariantId === variant.id
                ? 'bg-[#141413] text-[#FAF8F5] font-semibold'
                : 'bg-[#F0EEE6] hover:bg-[#E8E4DA] text-[#4F4D47]'
            }`}
          >
            {variant.name}
          </button>
        ))}
      </div>

      {/* Tab 1: Model Report Table matching Anthropic video frame 00:11 */}
      {selectedTab === 'report' && (
        <div className="space-y-6">
          <div className="border border-[#E3E0D8] divide-y divide-[#E3E0D8] bg-white text-xs sm:text-sm">
            <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-3 font-semibold text-[#141413] font-mono text-xs uppercase tracking-wider">
                Model Classification
              </div>
              <div className="md:col-span-9 text-[#42403B]">
                {currentVariant.name} · {currentVariant.tag}
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-3 font-semibold text-[#141413] font-mono text-xs uppercase tracking-wider">
                Architecture Scope
              </div>
              <div className="md:col-span-9 text-[#42403B] leading-relaxed">
                {currentVariant.description}
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-3 font-semibold text-[#141413] font-mono text-xs uppercase tracking-wider">
                Training Manifold
              </div>
              <div className="md:col-span-9 text-[#42403B] leading-relaxed">
                {currentVariant.benchmarks}
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-3 font-semibold text-[#141413] font-mono text-xs uppercase tracking-wider">
                Acceptable Deployments
              </div>
              <div className="md:col-span-9 text-[#42403B]">
                {currentVariant.acceptableUses}
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-[#FAF8F5]">
              <div className="md:col-span-3 font-semibold text-[#E5182B] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={14} />
                <span>Invalidation Trigger</span>
              </div>
              <div className="md:col-span-9 text-[#141413] font-mono text-xs leading-relaxed">
                {currentVariant.invalidationTrigger}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Automated Behavioral & Epistemic Audit Scores matching Anthropic video frame 00:12 */}
      {selectedTab === 'trust' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-[#141413]">
              Automated Epistemic Calibration & Robustness Audit
            </h3>
            <p className="text-xs text-[#66645E]">
              Evaluated across 10,000 synthetic market shock episodes. Comparing VEIRON World Models against Multi-Agent LLMs and Traditional Quantitative Risk Desks.
            </p>
          </div>

          <div className="border border-[#E3E0D8] p-6 bg-white space-y-6">
            {currentVariant.scores.map((scoreItem, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-semibold text-[#141413]">{scoreItem.label}</span>
                  <span className="text-[#E5182B] font-bold">VEIRON: {scoreItem.veironScore}%</span>
                </div>

                {/* 3 Comparative Bars */}
                <div className="space-y-1.5 text-[10px] font-mono">
                  {/* VEIRON Bar */}
                  <div className="flex items-center gap-2">
                    <span className="w-24 text-right text-[#141413] font-semibold">VEIRON</span>
                    <div className="flex-1 bg-[#F0EEE6] h-3.5">
                      <div
                        className="bg-[#E5182B] h-full transition-all duration-500"
                        style={{ width: `${scoreItem.veironScore}%` }}
                      />
                    </div>
                    <span className="w-10 text-left font-bold text-[#141413]">{scoreItem.veironScore}%</span>
                  </div>

                  {/* Multi-Agent LLM Bar */}
                  <div className="flex items-center gap-2 text-[#87857F]">
                    <span className="w-24 text-right">Agent Swarms</span>
                    <div className="flex-1 bg-[#F0EEE6] h-3">
                      <div
                        className="bg-[#A19F97] h-full"
                        style={{ width: `${scoreItem.standardLLMScore}%` }}
                      />
                    </div>
                    <span className="w-10 text-left">{scoreItem.standardLLMScore}%</span>
                  </div>

                  {/* Traditional Static Quant Bar */}
                  <div className="flex items-center gap-2 text-[#87857F]">
                    <span className="w-24 text-right">Static Quant</span>
                    <div className="flex-1 bg-[#F0EEE6] h-3">
                      <div
                        className="bg-[#C4C0B4] h-full"
                        style={{ width: `${scoreItem.staticQuantScore}%` }}
                      />
                    </div>
                    <span className="w-10 text-left">{scoreItem.staticQuantScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Commitments */}
      {selectedTab === 'commitments' && (
        <div className="space-y-4">
          <div className="border border-[#E3E0D8] p-6 bg-white space-y-4 text-xs sm:text-sm">
            <h3 className="text-base font-serif font-bold text-[#141413]">
              Voluntary Epistemic Safety & Invalidation Mandates
            </h3>
            <ul className="space-y-3 text-[#4F4D47] leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E5182B] shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Non-Hallucination Guarantees:</strong> No portfolio recommendation or state estimate is produced without explicit deterministic mathematical verification (Layer 08).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E5182B] shrink-0 mt-0.5" />
                <span>
                  <strong>Continuous Belief Invalidation:</strong> The system is mathematically bound to discard hypotheses within 20 milliseconds if empirical observations violate core axioms.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#E5182B] shrink-0 mt-0.5" />
                <span>
                  <strong>Client Data Air-Gapping:</strong> Client proprietary trading logs, holdings, and order flows never leave sovereign dedicated instances.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
