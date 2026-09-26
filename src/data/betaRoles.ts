import { BetaRole, BetaRoleInfo } from '../types';

export const BETA_ROLES: BetaRoleInfo[] = [
  {
    id: 'quant-researcher',
    title: 'Quantitative Researcher & Model Auditor',
    badge: 'QUANT-AUDITOR-LV1',
    clearanceLevel: 'LEVEL 1 · STATISTICAL ARBITRAGE',
    description: 'Audits epistemic uncertainty bounds, recursive belief state convergence, and backtests probabilistic market shock trajectories.',
    focusArea: 'Probabilistic Surface & Invalidation Boundaries',
    permissions: [
      'Raw Epistemic Surface Telemetry',
      'Synthetic Path Matrix Inspection (10k Paths)',
      'Recursive State Vector Invalidation Logs',
      'Custom Mathematical Prior Injection'
    ]
  },
  {
    id: 'macro-strategist',
    title: 'Macro Risk & Liquidity Strategist',
    badge: 'MACRO-STRAT-LV1',
    clearanceLevel: 'LEVEL 1 · CROSS-ASSET SYSTEMIC',
    description: 'Monitors sovereign debt dispersion, cross-currency basis widening, offshore dollar liquidity contagion, and central bank swap reactions.',
    focusArea: 'Cross-Asset Contagion & Liquidity Squeezes',
    permissions: [
      'G10 Sovereign Spread Dispersions',
      'Cross-Currency Basis Swap Stress Indices',
      'Repo Clearing Bottleneck Alerts',
      'Adversarial Liquidity Shock Simulator'
    ]
  },
  {
    id: 'fx-rates-trader',
    title: 'Institutional FX & Rates Trader',
    badge: 'FX-RATES-EXEC-LV1',
    clearanceLevel: 'LEVEL 1 · ULTRA-LOW LATENCY',
    description: 'Evaluates real-time dialectic decision speeds (14.8ms continuous), hedge execution paths, and delta-neutral gamma stabilization.',
    focusArea: 'Real-time Execution & Convexity Hedging',
    permissions: [
      'Sub-15ms Dialectic Resolution Telemetry',
      'Venue Microstructure Depth Books',
      'Delta-Neutral Hedge Optimization Vector',
      'Real-time Execution Risk Throttles'
    ]
  },
  {
    id: 'dialectic-evaluator',
    title: 'AI Systems & Dialectic Evaluator',
    badge: 'AI-DIALECTIC-CORE',
    clearanceLevel: 'LEVEL 1 · ADVERSARIAL REASONING',
    description: 'Analyzes competing hypothesis formation, automated adversarial refutations, red-teaming nodes, and cognitive world-model state evolution.',
    focusArea: 'Multi-Agent Dialectics & Reasoning Chains',
    permissions: [
      'Adversarial Refutation Graph Visualizer',
      'Competing Hypothesis Invalidation Trees',
      'Formal LLM Reasoning Trace Inspection',
      'Cognitive Core Dispatched Agents Monitor'
    ]
  },
  {
    id: 'compliance-officer',
    title: 'Portfolio Compliance & Governance Officer',
    badge: 'GOV-COMPLIANCE-LV1',
    clearanceLevel: 'LEVEL 1 · REGULATORY FIDUCIARY',
    description: 'Verifies determinism, immutable decision audit trails, fiduciary constraint enforcement, and verifiable institutional guardrails.',
    focusArea: 'Fiduciary Auditing & Regulatory Provenance',
    permissions: [
      'Immutable Cryptographic Audit Trail',
      'Model Risk Management (MRM / SR 11-7) Logs',
      'Fiduciary Constraint Violation Monitors',
      'Exportable Regulatory Compliance Dossiers'
    ]
  }
];

export const getBetaRoleInfo = (roleId: BetaRole): BetaRoleInfo => {
  return BETA_ROLES.find(r => r.id === roleId) || BETA_ROLES[0];
};
