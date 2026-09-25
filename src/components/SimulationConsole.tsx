import React, { useState } from 'react';
import { SimulationScenario } from '../types';
import { AakashavaniLogo } from './logos/AakashavaniLogo';
import { AsciiLoader } from './AsciiLoader';
import { 
  Activity, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Cpu, 
  TrendingUp, 
  AlertTriangle,
  Flame,
  Scale,
  RefreshCw
} from 'lucide-react';

export const SCENARIOS: SimulationScenario[] = [
  {
    id: 'liquidity-shock',
    title: 'Cross-Currency Basis Squeeze & Dollar Funding Spike',
    domain: 'Global Macro / FX & Rates',
    timestamp: '2026-09-24T23:38:00Z',
    initialRegime: 'STABLE_CARRY_ARBITRAGE',
    shockEvent: 'Sudden 32bp widening in 3M EUR/USD cross-currency basis swap + repo clearing bottleneck.',
    hypotheses: [
      {
        label: 'HYPOTHESIS α: Transient Quarter-End Balance Sheet Window Dressing',
        probability: 0.31,
        evidence: 'Collateral shortage matches historical Q3 cycle patterns; primary dealer inventories stable.',
        counterClaim: 'ADVERSARIAL REFUTATION: Cross-border repo fails have surged 340%, disproving benign calendar window dressing.'
      },
      {
        label: 'HYPOTHESIS β: Structural Non-Bank Financial Intermediation (NBFI) Liquidity Run',
        probability: 0.69,
        evidence: 'Offshore dollar credit spreads widening symmetrically across Europe and Tokyo; shadow banking margin calls triggered.',
        counterClaim: 'SURVIVES ADVERSARIAL CHALLENGE: Verified against multi-venue FX swap liquidity books.'
      }
    ],
    beliefState: {
      regime: 'ACUTE_OFFSHORE_DOLLAR_SHORTAGE',
      epistemicUncertainty: 0.14,
      volatilitySurface: 'LEFT_SKEW_PARAMETRIC_STRESS',
      liquidityStress: 'CRITICAL_BAND_4 (Top 2% Historical)',
      invalidationConditions: [
        'Federal Reserve announces emergency dollar liquidity swap line reactivation',
        '3M basis narrows below 12bps before London fixing'
      ]
    },
    orchestrationDispatched: [
      'MicrostructureFlowEngine: Dispatched for tick-level dealer depth',
      'SovereignSpreadAnalyst: Assessing Italian BTP & German Bund yield dispersion',
      'AdversarialDialecticNode: Red-teaming transient thesis vs systemic thesis',
      'FormalRiskVerifier: Computing portfolio max drawdowns across 10,000 synthetic paths'
    ],
    adversarialResolution: 'Hypothesis α is INVALIDATED at 23:38:12. The model shifts 92% weight to Hypothesis β (Structural Squeeze).',
    verifiedAction: 'Evolve World State: Downweight equity beta by 40%, hedge JPY/USD cross-currency basis exposure, execute delta-neutral gamma protection.'
  },
  {
    id: 'tech-earnings-macro',
    title: 'Earnings Beat vs. Capex Free Cash Flow Compression',
    domain: 'Equities / Quantitative Fundamental',
    timestamp: '2026-09-24T23:38:30Z',
    initialRegime: 'MOMENTUM_EXPANSION',
    shockEvent: 'Megacap semiconductor firm beats top-line revenue by 4.2% but slashes FY27 free cash flow guide by 18% due to AI data center infrastructure costs.',
    hypotheses: [
      {
        label: 'HYPOTHESIS α: Secular Infrastructure Supercycle Continues',
        probability: 0.28,
        evidence: 'Cloud provider bookings remain elevated; backlog orders extended out 6 quarters.',
        counterClaim: 'ADVERSARIAL REFUTATION: Capex-to-revenue ratio has crossed 38%, historical turning point for margin compression.'
      },
      {
        label: 'HYPOTHESIS β: High-Multiple Valuation Compression & Disinvestment Cycle',
        probability: 0.72,
        evidence: 'Earnings revisions breadth turning negative across second-tier suppliers; credit default swaps ticking upwards.',
        counterClaim: 'SURVIVES ADVERSARIAL CHALLENGE: Validated against supplier lead-times and enterprise procurement surveys.'
      }
    ],
    beliefState: {
      regime: 'LATE_STAGE_CAPEX_FATIGUE',
      epistemicUncertainty: 0.19,
      volatilitySurface: 'TERM_STRUCTURE_INVERSION',
      liquidityStress: 'MODERATE_ELEVATED',
      invalidationConditions: [
        'Hyperscalers report accelerating software margin expansion in upcoming earnings calls',
        '10-Year real yield drops below 1.45%'
      ]
    },
    orchestrationDispatched: [
      'CorporateCreditAnalyst: Reviewing supplier covenants & rollover risk',
      'OptionsFlowQuant: Tracking institutional put-call ratios & strike clustering',
      'SupplyChainSynthesizer: Ingesting semiconductor wafer fab lead times',
      'MathematicalAxiomGate: Verifying discounted cash flow discount rates under elevated cost of capital'
    ],
    adversarialResolution: 'The system invalidated the initial post-earnings knee-jerk rally within 180ms. Conviction moved to margin compression regime.',
    verifiedAction: 'Evolve World State: Re-anchor fair-value manifold down 7.8%; alert institutional risk desk to sector rotation flow.'
  },
  {
    id: 'geopolitical-energy',
    title: 'Maritime Chokepoint Closure & Freight-to-Inflation Cascade',
    domain: 'Commodities / Geopolitical Supply Chains',
    timestamp: '2026-09-24T23:39:00Z',
    initialRegime: 'DISINFLATIONARY_EQUILIBRIUM',
    shockEvent: 'Strait transit insurance revoked for 60% of commercial container fleet following naval escalations; bunker fuel spreads spike.',
    hypotheses: [
      {
        label: 'HYPOTHESIS α: Localized Tactical Disruption with Cape of Good Hope Rerouting',
        probability: 0.35,
        evidence: 'Carriers announce alternative transit schedules; 10-14 day delay absorbed by safety inventories.',
        counterClaim: 'ADVERSARIAL REFUTATION: European inventory-to-sales ratios are at historic lows (1.18); buffer stocks deplete in 19 days.'
      },
      {
        label: 'HYPOTHESIS β: Second-Round Headline Inflation Cascade & Delayed Rate Cuts',
        probability: 0.65,
        evidence: 'Container freight indices up 140%; tanker ton-mile demand surges; 5Y5Y forward inflation breakevens unmooring.',
        counterClaim: 'SURVIVES ADVERSARIAL CHALLENGE: Cross-verified against port throughput and energy refining capacity.'
      }
    ],
    beliefState: {
      regime: 'COST_PUSH_STAGFLATIONARY_PRESSURE',
      epistemicUncertainty: 0.22,
      volatilitySurface: 'CRUDE_CRACK_SPREAD_BLOWOUT',
      liquidityStress: 'HIGH_CONCENTRATION_RISK',
      invalidationConditions: [
        'Naval protection corridor established with sovereign reinsurance backstop',
        'Crude futures prompt spread shifts from steep backwardation to contango'
      ]
    },
    orchestrationDispatched: [
      'CommodityPhysicalFlowQuant: Ingesting AIS vessel positioning telemetry',
      'MacroInflationForecaster: Modeling 6-month headline CPI pass-through coefficients',
      'AdversarialRedTeam: Simulating government strategic reserve releases',
      'PortfolioStressEngine: Evaluating sovereign debt sensitivity to delayed policy easing'
    ],
    adversarialResolution: 'Adversarial tests confirm shipping delays cannot be bridged by existing European inventories. Second-round inflation hypothesis confirmed.',
    verifiedAction: 'Evolve World State: Price out 50bps of near-term central bank rate cuts; simulate institutional asset allocation re-balancing.'
  }
];

export const SimulationConsole: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const scenario = SCENARIOS[selectedScenarioIndex];

  const handleSelectScenario = (index: number) => {
    if (index === selectedScenarioIndex && !isComputing) return;
    setIsComputing(true);
    setSelectedScenarioIndex(index);
    setTimeout(() => {
      setIsComputing(false);
    }, 600);
  };

  const handleRerun = () => {
    setIsComputing(true);
    setTimeout(() => {
      setIsComputing(false);
    }, 650);
  };

  return (
    <div className="w-full bg-[#0a0a0f] border border-[#23232f] text-neutral-300 font-sans">
      {/* Console Top Header */}
      <div className="bg-[#0f0f16] border-b border-[#23232f] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AakashavaniLogo size={24} showWordmark={false} color="#e5182b" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white tracking-wider">
                AAKASHAVANI WORLD MODEL CONSOLE
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#e5182b]/15 text-[#ff4d5e] border border-[#e5182b]/30">
                AKHVNI-0.1.2
              </span>
            </div>
            <div className="text-[10px] font-mono text-neutral-400">
              ENVIRONMENT: CONTINUOUS FINANCIAL INTELLIGENCE SIMULATOR
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <button
            onClick={handleRerun}
            disabled={isComputing}
            className="px-2.5 py-1 text-[11px] bg-[#1a1a24] hover:bg-[#252535] text-neutral-300 border border-[#2f2f42] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Re-run Bayesian Invalidation Cycle"
          >
            <RefreshCw size={11} className={isComputing ? 'animate-spin text-[#e5182b]' : ''} />
            <span>RE-RUN TEST</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-neutral-300">LIVE COGNITIVE LOOP</span>
          </div>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#23232f] bg-[#0c0c12]">
        {SCENARIOS.map((sc, i) => (
          <button
            key={sc.id}
            onClick={() => handleSelectScenario(i)}
            className={`p-3 text-left border-b md:border-b-0 md:border-r border-[#23232f] transition-all cursor-pointer ${
              selectedScenarioIndex === i
                ? 'bg-[#15151e] border-l-2 md:border-l-0 md:border-t-2 border-[#e5182b] text-white'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#101017]'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
              <span>TEST RUN 0{i + 1}</span>
              <span className="text-neutral-400">{sc.domain}</span>
            </div>
            <div className="text-xs font-semibold line-clamp-1 text-white">
              {sc.title}
            </div>
          </button>
        ))}
      </div>

      {/* Main Console Body */}
      {isComputing ? (
        <div className="p-8 sm:p-14 flex flex-col items-center justify-center space-y-4 bg-[#0c0c12]">
          <AsciiLoader
            variant="card"
            label={`RUNNING ADVERSARIAL DIALECTIC ON [TEST RUN 0${selectedScenarioIndex + 1}]...`}
            durationMs={600}
            className="max-w-lg w-full bg-[#12121c] border-[#29293d] text-white"
          />
        </div>
      ) : (
      <div className="p-4 sm:p-6 space-y-6">
        {/* Shock Event Ingestion Banner */}
        <div className="p-4 bg-[#121013] border-l-2 border-[#e5182b] border-t border-r border-b border-[#281b20]">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#ff4d5e] uppercase tracking-wider mb-1">
            <Flame size={14} />
            <span>REAL-TIME ENVIRONMENT SHOCK DETECTED</span>
          </div>
          <p className="text-sm font-medium text-white">
            {scenario.shockEvent}
          </p>
          <div className="flex items-center gap-4 mt-2 font-mono text-[11px] text-neutral-400">
            <span>PRIOR REGIME: <span className="text-neutral-300">{scenario.initialRegime}</span></span>
            <span>·</span>
            <span>INGESTION DELAY: <span className="text-emerald-400">4.1ms</span></span>
          </div>
        </div>

        {/* Two-Column Grid: Belief State vs Competing Hypotheses */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Probabilistic Belief State */}
          <div className="lg:col-span-5 space-y-4">
            <div className="font-mono text-xs text-neutral-400 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <Activity size={14} className="text-[#e5182b]" />
                BELIEF STATE EVOLUTION
              </span>
              <span className="text-[10px] text-neutral-400">BAYESIAN INFERENCE</span>
            </div>

            <div className="p-4 bg-[#0d0d14] border border-[#20202c] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c1c28]">
                <span className="text-neutral-400">CURRENT REGIME:</span>
                <span className="text-white font-bold text-right text-[11px] bg-[#1d1d28] px-2 py-0.5 border border-neutral-700">
                  {scenario.beliefState.regime}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-neutral-400">EPISTEMIC UNCERTAINTY:</span>
                  <span className="text-amber-400 font-bold">
                    {(scenario.beliefState.epistemicUncertainty * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-[#181822] h-2 border border-neutral-800">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-[#e5182b] h-full"
                    style={{ width: `${scenario.beliefState.epistemicUncertainty * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Explicit quantification of unobserved market variables.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1c1c28] text-[11px]">
                <span className="text-neutral-400">VOLATILITY SURFACE:</span>
                <span className="text-neutral-200">{scenario.beliefState.volatilitySurface}</span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">LIQUIDITY DEPTH:</span>
                <span className="text-[#ff4d5e]">{scenario.beliefState.liquidityStress}</span>
              </div>
            </div>

            {/* Invalidation Conditions Block */}
            <div className="p-3.5 bg-[#0e0e13] border border-[#1f1f2a] space-y-2">
              <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle size={12} className="text-[#e5182b]" />
                <span>WHAT WOULD INVALIDATE THIS BELIEF?</span>
              </div>
              <ul className="space-y-1.5 font-mono text-[11px] text-neutral-300">
                {scenario.beliefState.invalidationConditions.map((cond, ci) => (
                  <li key={ci} className="flex items-start gap-2">
                    <span className="text-[#e5182b] font-bold">»</span>
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Competing Hypotheses & Adversarial Review */}
          <div className="lg:col-span-7 space-y-4">
            <div className="font-mono text-xs text-neutral-400 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <Scale size={14} className="text-[#e5182b]" />
                ADVERSARIAL HYPOTHESIS ARENA
              </span>
              <span className="text-[10px] text-neutral-400">DIALECTIC ENGINE</span>
            </div>

            <div className="space-y-3">
              {scenario.hypotheses.map((hyp, hi) => {
                const isWinner = hyp.probability > 0.5;
                return (
                  <div
                    key={hi}
                    className={`p-4 border transition-all ${
                      isWinner
                        ? 'bg-[#12131b] border-neutral-600'
                        : 'bg-[#0c0c11] border-[#1c1c24] opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2 font-mono">
                      <span className={`text-xs font-bold ${isWinner ? 'text-white' : 'text-neutral-400'}`}>
                        {hyp.label}
                      </span>
                      <span className={`text-xs font-mono px-2 py-0.5 border ${
                        isWinner 
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' 
                          : 'border-neutral-700 bg-neutral-800 text-neutral-400'
                      }`}>
                        P = {(hyp.probability * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="text-xs text-neutral-300 font-sans mb-2">
                      <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider mr-1">Evidence:</span>
                      {hyp.evidence}
                    </div>

                    <div className="p-2.5 bg-[#09090c] border border-neutral-800 text-[11px] font-mono leading-relaxed">
                      <span className={isWinner ? 'text-emerald-400' : 'text-[#ff4d5e]'}>
                        {hyp.counterClaim}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Orchestration Log */}
            <div className="p-3 bg-[#0a0a0f] border border-[#1e1e28] space-y-1.5">
              <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu size={12} className="text-[#e5182b]" />
                <span>DYNAMIC SPECIALIST ORCHESTRATION</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400">
                {scenario.orchestrationDispatched.map((disp, di) => (
                  <div key={di} className="p-1.5 bg-[#12121a] border border-[#21212c] truncate">
                    <span className="text-neutral-500">[{di + 1}]</span> {disp}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Verification & Evolved World Model Decision State */}
        <div className="p-4 sm:p-5 bg-[#0e0e15] border border-[#242433] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#20202c] pb-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>VERIFIED INSTITUTIONAL DECISION STATE</span>
            </div>
            <div className="text-neutral-400 text-[11px]">
              RECURSIVE FEEDBACK COMPLETED · LATENCY 14.8ms
            </div>
          </div>

          <p className="text-sm font-medium text-white leading-relaxed">
            {scenario.verifiedAction}
          </p>

          <div className="font-mono text-[11px] text-neutral-400 flex items-center gap-2 pt-1">
            <span className="text-[#e5182b]">RESOLVED ADVERSARIAL VERDICT:</span>
            <span>{scenario.adversarialResolution}</span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
