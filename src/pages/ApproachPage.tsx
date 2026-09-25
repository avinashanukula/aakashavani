import React from 'react';
import { Page } from '../types';
import { HorizonBanner } from '../components/HorizonBanner';
import { ArrowRight, ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ApproachPageProps {
  onNavigate: (page: Page) => void;
}

export const ApproachPage: React.FC<ApproachPageProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-[#141413]">
      {/* Hero */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-[#E3E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#E5182B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E5182B]" />
              <span className="font-semibold tracking-wider">VEIRON RESEARCH METHODOLOGY</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif text-[#141413] tracking-tight leading-[1.08]">
              The World-Model Approach
            </h1>

            <p className="text-lg sm:text-xl font-serif text-[#474540] leading-relaxed">
              Why isolated prompts, static dashboards, and chat agents collapse when confronted with the non-linear, reflexive physics of complex institutional systems.
            </p>

            <div className="p-4 bg-white border border-[#E3E0D8] font-mono text-xs text-[#141413]">
              <span className="text-[#E5182B] font-bold">THE PARADIGM: </span>
              INFORMATION → UNDERSTANDING → REASONING → SIMULATION → DECISION
            </div>
          </div>
        </div>
      </section>

      {/* 5-Stage Cognitive Pipeline */}
      <section className="py-20 sm:py-28 border-b border-[#E3E0D8] bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 mb-16">
            <div className="font-mono text-xs uppercase tracking-widest text-[#E5182B]">
              CONTINUOUS PIPELINE
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#141413] tracking-tight">
              From Raw Signals to Institutional Decisions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                step: 'STAGE 01',
                title: 'INFORMATION',
                subtitle: 'Multi-Modal Ingestion & Alignment',
                desc: 'Raw observations from disparate channels—level-3 order books, news wires, OTC swap flows, yield curves, and regulatory filings—are ingested into continuous high-dimensional observation manifolds.',
                detail: 'Eliminates semantic drift between natural language narratives and quantitative price microstructure.'
              },
              {
                step: 'STAGE 02',
                title: 'UNDERSTANDING',
                subtitle: 'Probabilistic Belief States & Causal Graphing',
                desc: 'The system constructs a causal representation of reality. It maps which variables drive others, establishing structural priors and distinguishing temporary noise from genuine regime shifts.',
                detail: 'Maintains Bayesian distributions over latent states rather than brittle single-point forecasts.'
              },
              {
                step: 'STAGE 03',
                title: 'REASONING',
                subtitle: 'Specialized Intelligence & Adversarial Red Teaming',
                desc: 'Dispatches domain-constrained reasoning models to analyze specific angles. Competing hypotheses are systematically generated and pitted against each other in structured dialectical combat.',
                detail: 'If an analytical thesis fails to explain cross-asset anomalies, it is invalidated immediately.'
              },
              {
                step: 'STAGE 04',
                title: 'SIMULATION',
                subtitle: 'Counterfactual Rollouts & Scenario Branching',
                desc: 'Before any institutional decision is recommended, the world model runs forward simulations: "What if interest rates rise 50bps while energy spreads widen?" It tracks cascading feedback loops.',
                detail: 'Tests policy resilience across thousands of synthetic stress paths.'
              },
              {
                step: 'STAGE 05',
                title: 'DECISION',
                subtitle: 'Verified Execution & Closed-Loop Feedback',
                desc: 'Produces actionable institutional guidance: the optimal decision, the exact evidence supporting it, the quantified residual uncertainty, the downside risk envelope, and the explicit signals that would invalidate it.',
                detail: 'The outcome of the decision feeds directly back into Stage 01, updating the world model continuously.'
              }
            ].map((stage, idx) => (
              <div key={idx} className="p-8 bg-white border border-[#E3E0D8] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-3 space-y-1">
                  <div className="font-mono text-xs text-[#E5182B] font-bold">
                    {stage.step}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#141413]">
                    {stage.title}
                  </h3>
                  <div className="font-mono text-[11px] text-[#87857F]">
                    {stage.subtitle}
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-2">
                  <p className="text-sm text-[#474540] leading-relaxed">
                    {stage.desc}
                  </p>
                  <p className="text-xs font-mono text-[#66645E]">
                    ↳ <span className="text-[#141413]">{stage.detail}</span>
                  </p>
                </div>

                <div className="lg:col-span-3 p-3 bg-[#FAF8F5] border border-[#E3E0D8] text-xs font-mono text-[#87857F] text-center">
                  CONTINUOUS LOOP GATE :: SYNCHRONIZED
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 6 Continuously Maintained States */}
      <section className="py-20 sm:py-28 border-b border-[#E3E0D8] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 mb-16">
            <div className="font-mono text-xs uppercase tracking-widest text-[#E5182B]">
              EPISTEMIC STATE MATRIX
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#141413] tracking-tight">
              What the World Model Maintains at All Times
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '1. What We Believe Is Happening', desc: 'A synchronized, probabilistic assessment of the current environment. Not a static point prediction, but a state distribution weighted by recent empirical evidence.' },
              { title: '2. Why We Believe It', desc: 'Complete causal transparency. Every assertion points to underlying order flow anomalies, balance sheet revisions, or policy announcements.' },
              { title: '3. Alternative Explanations', desc: 'The model actively tracks minority hypotheses. If the market is rallying, it models whether it is genuine fundamental expansion or a forced short squeeze.' },
              { title: '4. Explicit Uncertainty', desc: 'The system distinguishes between known risks (aleatoric randomness) and gaps in its own knowledge (epistemic uncertainty), preventing false confidence.' },
              { title: '5. Invalidation Thresholds', desc: 'Pre-computed failure criteria. The model defines beforehand: "If 10-year Treasury yields cross 4.85%, this entire thesis is immediately discarded."' },
              { title: '6. What to Investigate Next', desc: 'Active epistemic exploration. The model determines what missing observation would reduce uncertainty the fastest, and directs intelligence toward it.' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white border border-[#E3E0D8] space-y-3 hover:border-[#141413] transition-colors">
                <div className="font-mono text-xs text-[#E5182B] font-bold">
                  ELEMENT 0{idx + 1}
                </div>
                <h3 className="text-lg font-serif font-bold text-[#141413]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#66645E] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#F7F5F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-serif text-[#141413]">
            Inspect the Technical Architecture
          </h2>
          <p className="text-sm text-[#66645E] max-w-xl mx-auto">
            Review the 9 formal layers and mathematical formulation powering the world-model approach.
          </p>
          <button
            onClick={() => onNavigate('architecture')}
            className="px-6 py-3 bg-[#141413] hover:bg-[#2B2A28] text-white text-xs font-mono uppercase tracking-wider rounded-full transition-colors cursor-pointer"
          >
            Explore 9-Layer Architecture →
          </button>
        </div>
      </section>
    </div>
  );
};
