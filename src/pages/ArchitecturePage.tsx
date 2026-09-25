import React, { useState } from 'react';
import { Page, ArchitectureNodeData } from '../types';
import { ArchitectureGraph, ARCHITECTURE_LAYERS } from '../components/ArchitectureGraph';
import { HorizonBanner } from '../components/HorizonBanner';
import { ArrowRight, Cpu, Layers, ShieldCheck, CheckCircle2, Sliders } from 'lucide-react';

interface ArchitecturePageProps {
  onNavigate: (page: Page) => void;
}

export const ArchitecturePage: React.FC<ArchitecturePageProps> = ({ onNavigate }) => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNodeData>(ARCHITECTURE_LAYERS[0]);

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-[#141413]">
      {/* Hero */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-[#E3E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#E5182B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E5182B]" />
              <span className="font-semibold tracking-wider">VEIRON TECHNICAL SPECIFICATION</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif text-[#141413] tracking-tight leading-[1.08]">
              9-Layer Recursive Architecture
            </h1>

            <p className="text-lg sm:text-xl font-serif text-[#474540] leading-relaxed">
              A closed-loop, continuous world-model architecture designed to solve regime shifts, catastrophic forgetting, and epistemic hallucination in institutional environments.
            </p>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#87857F] pt-2">
              <span className="text-[#141413] font-semibold">9 FORMAL LAYERS</span>
              <span>·</span>
              <span className="text-emerald-700 font-semibold">&lt;20ms LATENCY CYCLE</span>
              <span>·</span>
              <span className="text-[#141413]">ADVERSARIAL VERIFICATION</span>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric Horizon Banner */}
      <HorizonBanner
        headline="Continuous Recursive Cognition"
        subtext="The model updates its internal representation with every tick of empirical reality."
        tag="RECURSIVE TOPOLOGY"
      />

      {/* Interactive 9-Layer Architecture */}
      <section className="py-20 sm:py-28 border-b border-[#E3E0D8] bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 mb-12">
            <div className="font-mono text-xs uppercase tracking-widest text-[#E5182B]">
              SYSTEM TOPOLOGY
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#141413] tracking-tight">
              Interactive 9-Layer Pipeline
            </h2>
            <p className="text-sm sm:text-base text-[#66645E]">
              Select any stage below to inspect its data structures, ingestion streams, mathematical formalization, and automatic invalidation criteria.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-white border border-[#E3E0D8]">
            <ArchitectureGraph onSelectNode={(node) => setSelectedNode(node)} selectedId={selectedNode.id} />
          </div>
        </div>
      </section>

      {/* From AI Agents to AI Systems Axioms */}
      <section className="py-20 sm:py-28 border-b border-[#E3E0D8] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 mb-16">
            <div className="font-mono text-xs uppercase tracking-widest text-[#E5182B]">
              THE PARADIGM SHIFT
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#141413] tracking-tight">
              From AI Agents to AI Systems
            </h2>
            <p className="text-base text-[#474540]">
              The future isn't simply about having more AI agents. It is about knowing:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: '01', q: 'Which intelligence is needed', ans: 'Dynamic epistemic routing. If implied volatility surfaces invert, do not ask a general model: dispatch specialized order flow microstructure engines.' },
              { num: '02', q: 'When it is needed', ans: 'Event-driven activation. Avoid continuous compute burn on quiescent metrics; schedule intensive reasoning only during regime boundary transitions.' },
              { num: '03', q: 'How reasoning processes interact', ans: 'Adversarial dialectics. Specialized systems do not blindly agree; they stress-test each other’s hypotheses under formal game-theoretic rules.' },
              { num: '04', q: 'When previous conclusions should be invalidated', ans: 'Active belief decay. When structural market correlations break, old convictions are mathematically purged rather than stubbornly defended.' },
              { num: '05', q: 'When the system should stop', ans: 'Bayesian convergence bounds. Execution stops when uncertainty has narrowed to the institution’s configured risk envelope, preventing runaway loops.' },
              { num: '06', q: 'When humans need to intervene', ans: 'Epistemic escalation gates. When the world encounters genuine structural novelty outside training manifolds, the system alerts human operators.' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white border border-[#E3E0D8] space-y-3 hover:border-[#141413] transition-colors">
                <div className="font-mono text-xs text-[#E5182B] font-bold">
                  AXIOM {item.num}
                </div>
                <h3 className="text-lg font-serif font-bold text-[#141413]">
                  {item.q}
                </h3>
                <p className="text-xs text-[#66645E] leading-relaxed">
                  {item.ans}
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
            Request Technical Specifications & White Paper
          </h2>
          <p className="text-sm text-[#66645E] max-w-xl mx-auto">
            Discuss integration endpoints, C++ kernel performance, and bespoke institutional risk rules with our systems architects.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-7 py-3.5 bg-[#141413] hover:bg-[#2B2A28] text-white text-sm font-medium rounded-full transition-colors cursor-pointer"
          >
            Request Technical Briefing →
          </button>
        </div>
      </section>
    </div>
  );
};
