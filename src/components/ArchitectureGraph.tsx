import React, { useState, useEffect } from 'react';
import { ArchitectureNodeData } from '../types';
import { 
  Globe, 
  Cpu, 
  GitBranch, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  Play, 
  RotateCcw,
  Sparkles,
  Database,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export const ARCHITECTURE_LAYERS: ArchitectureNodeData[] = [
  {
    id: 'world-state',
    number: '01',
    name: 'WORLD STATE',
    layer: 'Environment Representation',
    shortDesc: 'Continuously updated multi-source representation of market reality.',
    detailedDesc: 'Aggregates and aligns real-time market data, cross-asset order flow, yield curves, macro announcements, options volatility surfaces, news, and institutional positioning into a unified high-dimensional manifold.',
    inputs: ['Cross-Asset Order Book Level-3', 'Macro Economic Releases', 'Options Implied Volatility Surfaces', 'Global Capital Flows', 'Central Bank Policy Statements'],
    outputs: ['Unified Continuous State Tensor (12,400 dims)', 'Anomaly Vector', 'Cross-Asset Coherence Graph'],
    metrics: {
      latency: '8.4 ms',
      certaintyType: 'Empirical / Observation Space',
      invalidationTrigger: 'Sudden tick divergence > 3.2σ across paired liquidity pools'
    },
    asciiDiagram: `┌──────────────────────────────────────────┐\n│ LAYER 01 :: WORLD_STATE_TENSOR           │\n│ CHANNELS: 14 ASSET CLASSES · 42 EXCHANGES│\n│ CONTINUOUS UPDATES: 4,800 EV/SEC         │\n└──────────────────────────────────────────┘`,
    codeSnippet: `type WorldState = {\n  timestamp: MicrosecondTimestamp;\n  manifold: ContinuousTensor<12400>;\n  cross_correlation_matrix: SymmetricMatrix<450, 450>;\n  epistemic_drift_flag: boolean;\n};`
  },
  {
    id: 'belief-state',
    number: '02',
    name: 'BELIEF STATE',
    layer: 'Probabilistic Regimes & Uncertainty',
    shortDesc: 'Quantifies what the system believes is occurring, along with explicit epistemic uncertainty.',
    detailedDesc: 'Maintains Bayesian distributions over market regimes (e.g. Disinflationary Growth vs. Liquidity Trap vs. Sovereign Spread De-anchoring). Crucially, separates aleatoric noise from genuine epistemic uncertainty ("what is unknown vs what cannot be known").',
    inputs: ['World State Tensor', 'Historical Regime Transition Priors', 'Liquidity Depth Gradients'],
    outputs: ['Posterior Regime Probability Distribution', 'Epistemic Uncertainty Metric (0-1)', 'Belief Vector'],
    metrics: {
      latency: '12.1 ms',
      certaintyType: 'Bayesian Posterior Entropy',
      invalidationTrigger: 'Prior collapse or entropy surge > 0.85 indicates regime shift'
    },
    asciiDiagram: `┌──────────────────────────────────────────┐\n│ LAYER 02 :: BELIEF_POSTERIOR_STATE       │\n│ REGIME: LIQUIDITY_STRESS_CONTRACTION     │\n│ P(R1)=0.68  P(R2)=0.24  P(R3_TAIL)=0.08  │\n│ EPISTEMIC UNCERTAINTY: 0.142 [STABLE]    │\n└──────────────────────────────────────────┘`,
    codeSnippet: `interface BeliefState {\n  regimes: Record<MarketRegime, Probability>;\n  epistemic_entropy: number;\n  unobserved_variables: HypothesizedLatent[];\n  confidence_interval_95: [number, number];\n}`
  },
  {
    id: 'orchestrator',
    number: '03',
    name: 'ORCHESTRATOR',
    layer: 'Dynamic Epistemic Routing',
    shortDesc: 'Intelligently determines which reasoning specialists are needed and when.',
    detailedDesc: 'Unlike static pipelines or random agent loops, the orchestrator evaluates the current Belief State and dispatches only the mathematically relevant reasoning specialists, setting execution constraints and budget thresholds.',
    inputs: ['Belief State Posterior', 'Latency & Risk Budgets', 'Active Investigation Agenda'],
    outputs: ['Specialist Dispatch Manifest', 'Hypothesis Generation Directives', 'Compute Allocation'],
    metrics: {
      latency: '4.2 ms',
      certaintyType: 'Deterministic Policy Optimization',
      invalidationTrigger: 'New macro print invalidates current dispatch graph'
    },
    asciiDiagram: `┌──────────────────────────────────────────┐\n│ LAYER 03 :: DYNAMIC_ORCHESTRATION        │\n│ ACTIVE_DISPATCH: [VOL, MACRO, FLOW]      │\n│ CONSTRAINED COMPUTE BUDGET: 120ms MAX    │\n└──────────────────────────────────────────┘`,
    codeSnippet: `function routeSpecialists(belief: BeliefState): SpecialistManifest {\n  if (belief.regimes.LIQUIDITY_SQUEEZE > 0.5) {\n    return [MicrostructureEngine, FundingSpreadAnalyst];\n  }\n  return [MacroRegimeEngine, VolatilitySurfaceAnalyzer];\n}`
  },
  {
    id: 'specialist-intelligence',
    number: '04',
    name: 'SPECIALIST INTELLIGENCE',
    layer: 'Domain-Specialized Reasoning Units',
    shortDesc: 'Isolated analytical systems running specialized models on specific dimensions.',
    detailedDesc: 'Parallel reasoning models specialized in Macro Policy Transmission, Volatility Skew Dynamics, Order Flow Microstructure, Credit Spreads, and Cross-Asset Reflexivity. Each operates under rigorous formal domain constraints.',
    inputs: ['World State slice', 'Belief prior', 'Specialist-specific domain ontology'],
    outputs: ['Domain Theses', 'Causal Attributions', 'Forecast Intervals'],
    metrics: {
      latency: '24.6 ms (parallelized)',
      certaintyType: 'Domain-Constrained Bounds',
      invalidationTrigger: 'Counter-evidence violates domain invariant axioms'
    },
    asciiDiagram: `┌──────────────────────────────────────────┐\n│ LAYER 04 :: SPECIALIST_CLUSTER_ACTIVE    │\n│ • S1: MACRO TRANSMISSION (Fed / ECB)     │\n│ • S2: VOL SURFACE SKEW & GAMMA PINNING   │\n│ • S3: CROSS-BORDER CAPITAL FLOW RUN      │\n└──────────────────────────────────────────┘`,
    codeSnippet: `class VolatilitySpecialist implements Specialist {\n  evaluate(world: WorldState): DomainHypothesis {\n    const gammaProfile = computeDealerGammaExposure(world);\n    return gammaProfile.isInverted ? ShortGammaAccelerating : GammaNeutral;\n  }\n}`
  },
  {
    id: 'analysis-planning-execution',
    number: '05',
    name: 'ANALYSIS / PLANNING / EXECUTION',
    layer: 'Simulation Branching & Counterfactuals',
    shortDesc: 'Generates potential state trajectories, candidate responses, and simulation rollouts.',
    detailedDesc: 'Runs forward Monte Carlo and counterfactual rollouts ("If Bank of Japan widens YCC by 25bps, what cascades across US 10Y and cross-currency basis swaps?"). Formulates trade or institutional decision policies.',
    inputs: ['Specialist Theses', 'Counterfactual Scenarios', 'Institutional Constraints'],
    outputs: ['Simulated State Trajectories', 'Candidate Action Policies', 'Payoff Densities'],
    metrics: {
      latency: '18.0 ms',
      certaintyType: 'Counterfactual Rollout Distribution',
      invalidationTrigger: 'Simulation branching divergence exceeds acceptable risk envelope'
    },
    asciiDiagram: `┌──────────────────────────────────────────┐\n│ LAYER 05 :: COUNTERFACTUAL_ROLLOUTS      │\n│ SCENARIOS EVALUATED: 1,024 SIM RUNS      │\n│ WORST-CASE DRAWDOWN ESTIMATE: -1.82%     │\n│ MEDIAN OUTCOME SCORE: +4.65%             │\n└──────────────────────────────────────────┘`,
    codeSnippet: `const trajectories = simulateBranching({\n  policyInterventions: candidateDecisions,\n  macroShocks: generatedShockVectors,\n  horizonMinutes: 1440\n});`
  },
  {
    id: 'testing-adversarial-review',
    number: '06',
    name: 'TESTING & ADVERSARIAL REVIEW',
    layer: 'Self-Adversarial Red Teaming',
    shortDesc: 'Competing hypotheses challenge one another to uncover false assumptions.',
    detailedDesc: 'A dedicated adversarial dialectic system pits competing theories against one another. If Thesis A claims "Inflation print implies equity rally due to margin preservation", the Adversarial reviewer searches for historical and structural refutations.',
    inputs: ['Primary Theses', 'Candidate Policies', 'Historical Refutation Dataset'],
    outputs: ['Refuted Claims', 'Stress Scenarios', 'Survival Score for Each Hypothesis'],
    metrics: {
      latency: '16.5 ms',
      certaintyType: 'Dialectical Robustness Score',
      invalidationTrigger: 'Fatal contradiction detected against structural reality'
    },
    asciiDiagram: `┌──────────────────────────────────────────┐\n│ LAYER 06 :: ADVERSARIAL_DEBATE_CYCLE     │\n│ THESIS_A: "EARNINGS EXCEED EXP." [0.72]  │\n│ COUNTER_THESIS: "GUIDANCE REVISED" [0.81]│\n│ RESULT: THESIS_A INVALIDATED (CONF. LOSS)│\n└──────────────────────────────────────────┘`,
    codeSnippet: `class AdversarialEngine {\n  challenge(primary: Hypothesis): ChallengeReport {\n    const contradictions = searchContradictions(primary);\n    return {\n      valid: contradictions.length === 0,\n      fatalFlaw: contradictions[0] ?? null\n    };\n  }\n}`
  },
  {
    id: 'integration',
    number: '07',
    name: 'INTEGRATION',
    layer: 'Epistemic Reconciliation & Synthesis',
    shortDesc: 'Synthesizes verified hypotheses into a coherent world view.',
    detailedDesc: 'Harmonizes verified specialist outputs, adversarial residuals, and risk parameters into a single unified institutional thesis, discarding invalidated branch logic.',
    inputs: ['Adversarial Review Results', 'Specialist Bounds', 'World Constraints'],
    outputs: ['Unified Integrated State Assessment', 'Confidence Bound Matrix'],
    metrics: {
      latency: '7.8 ms',
      certaintyType: 'Consensus Epistemic Bound',
      invalidationTrigger: 'Insoluble contradiction forces escalation to human oversight'
    },
    asciiDiagram: `┌──────────────────────────────────────────┐\n│ LAYER 07 :: SYNTHESIS_MATRIX             │\n│ HARMONIZED BELIEF CONVERGENCE: 99.4%     │\n│ CONTRADICTIONS RESOLVED: 7 OF 7          │\n└──────────────────────────────────────────┘`,
    codeSnippet: `function integrateOutputs(theses: VerifiedThesis[]): ConsolidatedModel {\n  return theses.reduce(bayesianConsensusReducer, initialPrior);\n}`
  },
  {
    id: 'verification',
    number: '08',
    name: 'VERIFICATION',
    layer: 'Ground-Truth & Axiomatic Testing',
    shortDesc: 'Final formal verification of claims, assumptions, mathematical bounds, and risk mandates.',
    detailedDesc: 'Runs deterministic mathematical proof checkers and formal constraint verifiers. Ensures no action violates capital adequacy, risk limits, liquidity thresholds, or axiomatic real-world constraints before updating the state.',
    inputs: ['Integrated Assessment', 'Institutional Mandates', 'Regulatory Capital Limits'],
    outputs: ['Verified Output Token', 'Proof of Validity Certificate', 'Execution Safe Flag'],
    metrics: {
      latency: '3.4 ms',
      certaintyType: 'Deterministic Proof Verification',
      invalidationTrigger: 'Hard risk constraint boundary violation'
    },
    asciiDiagram: `┌──────────────────────────────────────────┐\n│ LAYER 08 :: FORMAL_VERIFICATION_GATE     │\n│ AXIOMATIC CHECKS: PASSED [142 / 142]     │\n│ RISK CEILING: UNDER LIMIT (0.64 / 1.00)  │\n│ STATUS: MATHEMATICALLY_SOUND             │\n└──────────────────────────────────────────┘`,
    codeSnippet: `function verify(state: ConsolidatedModel, bounds: RiskBounds): boolean {\n  assert(state.valueAtRisk <= bounds.maxVaR);\n  assert(state.liquidityCoverage >= 1.25);\n  return true;\n}`
  },
  {
    id: 'updated-world-model',
    number: '09',
    name: 'UPDATED WORLD MODEL',
    layer: 'Evolving Decision State & Feedback',
    shortDesc: 'The system updates its internal state of the world, ready for the next tick.',
    detailedDesc: 'Produces the continuously updated decision state. The world model now possesses higher accuracy, updated priors, refined causal graphs, and actionable institutional guidance. Feeds back immediately into the next cycle.',
    inputs: ['Verified Integrated State', 'Execution Confirmation', 'Feedback Ingestion'],
    outputs: ['Next Tick World State Prior', 'Institutional Decision State', 'Audit Trail'],
    metrics: {
      latency: '2.1 ms',
      certaintyType: 'Evolved World Model State',
      invalidationTrigger: 'Next tick initiates continuous re-evaluation'
    },
    asciiDiagram: `┌──────────────────────────────────────────┐\n│ LAYER 09 :: UPDATED_WORLD_MODEL_STATE    │\n│ DECISION STATE: ACTIONABLE_CONVICTION    │\n│ THE MODEL HAS CHANGED WITH THE WORLD.    │\n│ LOOP CYCLE COMPLETED. CONTINUOUS_ONLINE. │\n└──────────────────────────────────────────┘`,
    codeSnippet: `// Loop re-enters Layer 01 with updated priors\nworldModel.update({\n  prior: verifiedState,\n  clock: Performance.now(),\n  cycle: cycleCounter++\n});`
  }
];

interface ArchitectureGraphProps {
  onSelectNode?: (node: ArchitectureNodeData) => void;
  selectedId?: string;
  compact?: boolean;
}

export const ArchitectureGraph: React.FC<ArchitectureGraphProps> = ({
  onSelectNode,
  selectedId: controlledSelectedId,
  compact = false,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string>('world-state');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  const selectedId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;
  const selectedNode = ARCHITECTURE_LAYERS.find(n => n.id === selectedId) || ARCHITECTURE_LAYERS[0];

  const handleSelect = (node: ArchitectureNodeData) => {
    setInternalSelectedId(node.id);
    if (onSelectNode) {
      onSelectNode(node);
    }
  };

  // Continuous loop animation showing information flowing through the world model
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % ARCHITECTURE_LAYERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <div className="w-full">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-[#23232f] font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#e5182b] font-bold">FLOW_TOPOLOGY:</span>
          <span className="text-white">RECURSIVE_WORLD_MODEL_CYCLE</span>
          <span className="text-neutral-500">[{ARCHITECTURE_LAYERS.length} FORMAL LAYERS]</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] border cursor-pointer transition-colors ${
              isSimulating 
                ? 'bg-[#181824] border-neutral-700 text-neutral-200' 
                : 'bg-[#e5182b]/20 border-[#e5182b] text-white'
            }`}
          >
            {isSimulating ? <RotateCcw size={12} className="text-[#e5182b]" /> : <Play size={12} />}
            <span>{isSimulating ? 'PAUSE CYCLE' : 'RESUME SIMULATION'}</span>
          </button>
          <span className="text-neutral-400 hidden sm:inline text-[11px]">
            ACTIVE STEP: <span className="text-white">{ARCHITECTURE_LAYERS[activeStep]?.number}</span>
          </span>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${compact ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-8 items-start`}>
        {/* Left Column: Interactive Vertical Pipeline */}
        <div className={`${compact ? 'w-full' : 'lg:col-span-6'} space-y-2 relative`}>
          {ARCHITECTURE_LAYERS.map((node, index) => {
            const isSelected = node.id === selectedId;
            const isCurrentActiveCycle = index === activeStep && isSimulating;

            return (
              <div key={node.id} className="relative group">
                <button
                  onClick={() => handleSelect(node)}
                  className={`w-full text-left p-3.5 sm:p-4 border transition-all duration-200 relative cursor-pointer ${
                    isSelected
                      ? 'bg-[#15151e] border-[#e5182b] shadow-lg shadow-[#e5182b]/5'
                      : isCurrentActiveCycle
                      ? 'bg-[#121219] border-neutral-600'
                      : 'bg-[#0c0c11] border-[#1e1e28] hover:border-neutral-600 hover:bg-[#101017]'
                  }`}
                >
                  {/* Active Cycle Pulse indicator */}
                  {isCurrentActiveCycle && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e5182b] animate-pulse" />
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs px-1.5 py-0.5 border ${
                        isSelected 
                          ? 'border-[#e5182b] text-[#e5182b] bg-[#e5182b]/10' 
                          : 'border-neutral-800 text-neutral-500 bg-[#0a0a0d]'
                      }`}>
                        {node.number}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold tracking-wide text-xs sm:text-sm font-sans ${
                            isSelected ? 'text-white' : 'text-neutral-200 group-hover:text-white'
                          }`}>
                            {node.name}
                          </span>
                          {node.id === 'updated-world-model' && (
                            <span className="text-[9px] font-mono px-1 py-0.2 bg-[#e5182b]/20 text-[#ff4d5e] border border-[#e5182b]/40">
                              RECURSIVE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                          {node.layer}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-[10px] text-neutral-400 hidden sm:block">
                      <span>{node.metrics.latency}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 mt-2 font-sans line-clamp-1">
                    {node.shortDesc}
                  </p>
                </button>

                {/* Downward Connector Arrow between nodes */}
                {index < ARCHITECTURE_LAYERS.length - 1 && (
                  <div className="flex justify-center items-center py-1 text-neutral-600">
                    <span className="font-mono text-xs tracking-tighter transition-colors group-hover:text-[#e5182b]">
                      ↓
                    </span>
                  </div>
                )}
                {index === ARCHITECTURE_LAYERS.length - 1 && (
                  <div className="flex justify-center items-center py-2 text-[#e5182b] font-mono text-[10px] tracking-widest">
                    <span>↺ FEEDS BACK TO WORLD STATE</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Node Inspector / Detailed View */}
        <div className={`${compact ? 'w-full mt-6' : 'lg:col-span-6'} lg:sticky lg:top-24`}>
          <div className="tech-box p-6 bg-[#0f0f15] border border-[#23232f] space-y-6">
            {/* Header info */}
            <div className="border-b border-[#23232f] pb-4 space-y-2">
              <div className="flex items-center justify-between font-mono text-xs text-neutral-400">
                <span className="text-[#e5182b] flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-[#e5182b] rounded-full inline-block animate-ping"></span>
                  LAYER INSPECTOR :: {selectedNode.number}
                </span>
                <span className="text-neutral-500">TYPE: {selectedNode.metrics.certaintyType}</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide font-sans">
                {selectedNode.name}
              </h3>
              <p className="text-xs font-mono text-[#ff4d5e]">
                {selectedNode.layer}
              </p>
              <p className="text-sm text-neutral-300 leading-relaxed font-sans pt-1">
                {selectedNode.detailedDesc}
              </p>
            </div>

            {/* ASCII Real-Time Frame */}
            {selectedNode.asciiDiagram && (
              <div>
                <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1.5">
                  Live Telemetry Snapshot
                </div>
                <pre className="font-mono text-[11px] leading-tight text-neutral-300 bg-[#08080c] p-3 border border-[#22222e] overflow-x-auto whitespace-pre">
                  {selectedNode.asciiDiagram}
                </pre>
              </div>
            )}

            {/* Inputs & Outputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#0a0a0e] border border-[#1e1e28] space-y-1.5">
                <div className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="text-[#e5182b]">→</span> INGESTION VECTOR
                </div>
                <ul className="space-y-1 text-neutral-300 text-[11px]">
                  {selectedNode.inputs.map((inp, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-neutral-600">·</span>
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-[#0a0a0e] border border-[#1e1e28] space-y-1.5">
                <div className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="text-emerald-400">←</span> OUTPUT / EMISSION
                </div>
                <ul className="space-y-1 text-neutral-300 text-[11px]">
                  {selectedNode.outputs.map((out, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-neutral-600">·</span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Invalidation Trigger - Core Veiron Concept */}
            <div className="p-3.5 bg-[#141012] border-l-2 border-[#e5182b] border-t border-r border-b border-[#2a1c20] space-y-1">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#ff4d5e] flex items-center gap-1.5">
                <ShieldAlert size={12} />
                <span>EPISTEMIC INVALIDATION TRIGGER</span>
              </div>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {selectedNode.metrics.invalidationTrigger}
              </p>
            </div>

            {/* Code / Formulation */}
            {selectedNode.codeSnippet && (
              <div>
                <div className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-1.5">
                  Formal System Interface
                </div>
                <pre className="font-mono text-[11px] text-neutral-400 bg-[#08080c] p-3 border border-[#20202c] overflow-x-auto text-left">
                  {selectedNode.codeSnippet}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
