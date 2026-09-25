import React from 'react';
import { Page } from '../types';
import { VeironLogo } from '../components/logos/VeironLogo';
import { AakashavaniLogo } from '../components/logos/AakashavaniLogo';
import { HorizonBanner } from '../components/HorizonBanner';
import { ModelEvaluationHub } from '../components/ModelEvaluationHub';
import { 
  ArrowRight, 
  ArrowUpRight, 
  ShieldAlert, 
  Layers, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  Building2, 
  Landmark, 
  Scale, 
  Compass,
  Cpu
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-[#141413]">
      {/* 1. HERO SECTION matching Anthropic video frame 00:00 */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-[#E3E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column: Big Editorial Serif Headline */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-[#E5182B]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E5182B]" />
                <span className="font-semibold tracking-wider">VEIRON FOUNDATIONAL SYSTEMS</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#141413] tracking-tight leading-[1.05]">
                Building <span className="italic font-normal">world models</span> for institutions.
              </h1>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('aakashavani')}
                  className="px-6 py-3 bg-[#141413] hover:bg-[#2B2A28] text-[#FAF8F5] font-medium text-sm rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Explore Aakashavani</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  onClick={() => onNavigate('approach')}
                  className="px-5 py-3 text-sm text-[#474540] hover:text-[#141413] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Our Approach</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Column: Clean Editorial Paragraph (Matching Anthropic Right Column in 00:00) */}
            <div className="lg:col-span-5 space-y-6 lg:pt-8 text-base text-[#474540] leading-relaxed">
              <p className="text-lg sm:text-xl font-serif text-[#292825] leading-relaxed">
                Veiron builds AI-native world models that understand complex, continuously changing environments and help institutions reason, simulate, and make decisions under uncertainty.
              </p>

              <p className="text-sm text-[#66645E]">
                VEIRON is not another chatbot, dashboard, or collection of agents. It is focused on continuously evolving intelligence systems for complex real-world environments.
              </p>

              <div className="pt-4 border-t border-[#E3E0D8] flex flex-wrap items-center gap-y-2 gap-x-3 text-xs font-mono text-[#87857F]">
                <span className="text-[#141413] font-semibold">Domains:</span>
                <span>Finance</span>
                <span>·</span>
                <span>Hedge Funds</span>
                <span>·</span>
                <span>Banks</span>
                <span>·</span>
                <span>Governments</span>
                <span>·</span>
                <span>Businesses</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ATMOSPHERIC HORIZON BANNER matching Anthropic video frame 00:01 */}
      <HorizonBanner 
        headline="The world changes. The model changes with it."
        subtext="Aakashavani continuously builds a probabilistic understanding of the market, investigates competing explanations, challenges its own conclusions, and produces an evolving decision state."
        tag="AAKASHAVANI AKHVNI-0.1.2 :: FINANCIAL ENVIRONMENT"
      />

      {/* 3. LATEST RELEASES 3-COLUMN GRID matching Anthropic video frame 00:02 */}
      <section className="py-20 border-b border-[#E3E0D8] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-6 border-b border-[#E3E0D8] mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#141413] tracking-tight">
              Latest releases
            </h2>
            <div className="font-mono text-xs text-[#87857F]">
              SYSTEMS ARCHIVE 2026
            </div>
          </div>

          {/* 3 Column Grid with Hairline Dividers */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E3E0D8] border border-[#E3E0D8] bg-white">
            {/* Card 1: Aakashavani 0.1.2 */}
            <div className="p-8 flex flex-col justify-between space-y-6 hover:bg-[#FAF8F5] transition-colors">
              <div className="space-y-4">
                <div className="text-[11px] font-mono text-[#E5182B] uppercase tracking-wider">
                  FIRST WORLD MODEL PROTOTYPE
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-[#141413] leading-snug">
                  Introducing Aakashavani 0.1.2
                </h3>
                <p className="text-sm text-[#66645E] leading-relaxed">
                  Veiron's first world-model prototype for financial environments. Replaces brittle dashboards and reactive chat assistants with a continuous, probabilistic representation of market reality.
                </p>
              </div>

              <div className="pt-6 border-t border-[#F0EEE6] space-y-3 font-mono text-xs">
                <div className="flex justify-between text-[#87857F]">
                  <span>DATE</span>
                  <span className="text-[#141413]">September 24, 2026</span>
                </div>
                <div className="flex justify-between text-[#87857F]">
                  <span>CATEGORY</span>
                  <span className="text-[#141413]">Announcements</span>
                </div>
                <div className="flex justify-between text-[#87857F] items-center pt-2">
                  <span>DETAILS</span>
                  <button
                    onClick={() => onNavigate('aakashavani')}
                    className="px-3 py-1 bg-[#141413] text-[#FAF8F5] rounded-full text-[11px] font-sans hover:bg-[#2B2A28] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Aakashavani</span>
                    <ArrowUpRight size={11} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: The World-Model Approach */}
            <div className="p-8 flex flex-col justify-between space-y-6 hover:bg-[#FAF8F5] transition-colors">
              <div className="space-y-4">
                <div className="text-[11px] font-mono text-[#E5182B] uppercase tracking-wider">
                  RESEARCH METHODOLOGY
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-[#141413] leading-snug">
                  The World-Model Approach
                </h3>
                <p className="text-sm text-[#66645E] leading-relaxed">
                  Moving beyond static prompt-response paradigms into continuous Bayesian updating, recursive belief alignment, and institutional risk verification under market uncertainty.
                </p>
              </div>

              <div className="pt-6 border-t border-[#F0EEE6] space-y-3 font-mono text-xs">
                <div className="flex justify-between text-[#87857F]">
                  <span>DATE</span>
                  <span className="text-[#141413]">September 18, 2026</span>
                </div>
                <div className="flex justify-between text-[#87857F]">
                  <span>CATEGORY</span>
                  <span className="text-[#141413]">Methodology</span>
                </div>
                <div className="flex justify-between text-[#87857F] items-center pt-2">
                  <span>DETAILS</span>
                  <button
                    onClick={() => onNavigate('approach')}
                    className="px-3 py-1 bg-[#141413] text-[#FAF8F5] rounded-full text-[11px] font-sans hover:bg-[#2B2A28] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Approach</span>
                    <ArrowUpRight size={11} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: From AI Agents to AI Systems */}
            <div className="p-8 flex flex-col justify-between space-y-6 hover:bg-[#FAF8F5] transition-colors">
              <div className="space-y-4">
                <div className="text-[11px] font-mono text-[#E5182B] uppercase tracking-wider">
                  RESEARCH ESSAY
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-[#141413] leading-snug">
                  From AI Agents to AI Systems
                </h3>
                <p className="text-sm text-[#66645E] leading-relaxed">
                  Why the future is not about having more conversational agents, but knowing which intelligence is needed, when previous conclusions should be invalidated, and when the system should stop.
                </p>
              </div>

              <div className="pt-6 border-t border-[#F0EEE6] space-y-3 font-mono text-xs">
                <div className="flex justify-between text-[#87857F]">
                  <span>DATE</span>
                  <span className="text-[#141413]">August 30, 2026</span>
                </div>
                <div className="flex justify-between text-[#87857F]">
                  <span>CATEGORY</span>
                  <span className="text-[#141413]">Epistemics</span>
                </div>
                <div className="flex justify-between text-[#87857F] items-center pt-2">
                  <span>DETAILS</span>
                  <button
                    onClick={() => onNavigate('approach')}
                    className="px-3 py-1 bg-[#141413] text-[#FAF8F5] rounded-full text-[11px] font-sans hover:bg-[#2B2A28] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Approach</span>
                    <ArrowUpRight size={11} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE PROBLEM: NOT AN INFORMATION PROBLEM, A CONTEXT PROBLEM */}
      <section className="py-20 sm:py-28 border-b border-[#E3E0D8] bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="font-mono text-xs text-[#E5182B] uppercase tracking-wider">
                THE INSTITUTIONAL BOTTLENECK
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif text-[#141413] tracking-tight leading-tight">
                Institutions don't have an information problem.
                <span className="block italic text-[#66645E] font-normal mt-1">
                  They have a context problem.
                </span>
              </h2>
              <p className="text-base text-[#4F4D47] leading-relaxed">
                Information arrives fragmented across news wires, tick-level order flow, macro announcements, cross-asset correlations, research notes, internal databases, and human observations.
              </p>
              <p className="text-sm text-[#66645E]">
                Traditional systems organize information. Analysts interpret it. Dashboards visualize it. AI assistants answer isolated queries. But they do not continuously maintain a coherent model of the world.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
                {['News & Wires', 'Market Data', 'Macro Indicators', 'Order Flows', 'Volatility Surfaces', 'Correlations', 'Research Notes', 'Internal Repos', 'Human Obs.'].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white border border-[#E3E0D8] text-[#141413]">
                    <div className="text-[10px] text-[#87857F] mb-1">0{idx + 1}</div>
                    <div className="font-medium truncate">{item}</div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-[#141413] text-[#FAF8F5] space-y-3 mt-4">
                <div className="font-mono text-xs text-[#E5182B] uppercase tracking-wider flex items-center justify-between">
                  <span>THE VEIRON RESOLUTION</span>
                  <span>CONTINUOUS COHERENCE</span>
                </div>
                <div className="text-base font-serif">
                  INFORMATION → UNDERSTANDING → REASONING → SIMULATION → DECISION
                </div>
                <p className="text-xs text-[#A19F97] font-sans leading-relaxed">
                  The system maintains an evolving representation of what we believe is happening, why we believe it, alternative explanations, uncertainty, evidence that could change the conclusion, and what should be investigated next.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRANSPARENCY & VERIFICATION HUB matching Anthropic video frames 00:10 - 00:12 */}
      <section className="py-20 sm:py-28 border-b border-[#E3E0D8] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ModelEvaluationHub />
        </div>
      </section>

      {/* 6. WHY IT MATTERS: INTERCONNECTED REFLEXIVE MARKETS */}
      <section className="py-20 sm:py-28 border-b border-[#E3E0D8] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="font-mono text-xs uppercase tracking-widest text-[#E5182B]">
                THE NATURE OF INTERCONNECTEDNESS
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif text-[#141413] tracking-tight">
                Markets are interconnected and continuously changing.
              </h2>
              <div className="p-6 bg-white border border-[#E3E0D8] font-mono text-xs space-y-3 leading-relaxed">
                <div className="text-[#87857F]">Macro events can change flows.</div>
                <div className="text-[#595752]">↳ Flows can change volatility.</div>
                <div className="text-[#2B2A28]">↳ Volatility can change correlations.</div>
                <div className="text-[#E5182B] font-bold text-sm">
                  ↳ Those changes can invalidate assumptions made minutes earlier.
                </div>
              </div>
              <p className="text-sm text-[#66645E] leading-relaxed">
                A static workflow or query-based system struggles with this. A world model is designed around it. It continuously recalculates its epistemic state without clinging to outdated hypotheses.
              </p>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="border border-[#E3E0D8] bg-white divide-y divide-[#E3E0D8] text-xs font-mono">
                <div className="p-4 flex items-center justify-between">
                  <span className="font-bold text-[#141413]">INVALIDATION PRINCIPLES</span>
                  <span className="text-[#E5182B]">VEIRON PROTOCOL</span>
                </div>
                <div className="p-4 space-y-1">
                  <div className="text-[#141413] font-semibold">1. Rapid Assumption Purge</div>
                  <div className="text-[#66645E] font-sans text-xs">
                    When liquidity depth collapses by &gt;3σ, all momentum priors are zeroed out within 14ms.
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <div className="text-[#141413] font-semibold">2. Dialectical Red-Teaming</div>
                  <div className="text-[#66645E] font-sans text-xs">
                    The model never acts on un-challenged thesis hypotheses. Competing claims must survive adversarial stress tests.
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <div className="text-[#141413] font-semibold">3. Deterministic Verification Gate</div>
                  <div className="text-[#66645E] font-sans text-xs">
                    No action is recommended that violates hard mathematical risk or regulatory capital constraints.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INSTITUTIONAL APPLICATIONS */}
      <section className="py-20 sm:py-28 border-b border-[#E3E0D8] bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#E5182B]">
                INSTITUTIONAL VERTICALS
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif text-[#141413] tracking-tight mt-1">
                Where World Models Matter Most
              </h2>
            </div>
            <button
              onClick={() => onNavigate('applications')}
              className="text-xs font-mono text-[#141413] hover:text-[#E5182B] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>VIEW ALL SPECIFICATIONS</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Hedge Funds & Quants',
                tag: 'ALPHA & RISK',
                desc: 'Continuous regime classification, cross-asset flow attribution, adversarial thesis red-teaming, and preventing alpha decay.'
              },
              {
                icon: Landmark,
                title: 'Banks & Sovereigns',
                tag: 'SYSTEMIC STRESS',
                desc: 'Systemic liquidity stress simulations, counterfactual interest rate shock cascades, and interbank contagion propagation.'
              },
              {
                icon: Building2,
                title: 'Global Corporations',
                tag: 'STRATEGIC RESILIENCE',
                desc: 'Supply-chain chokepoint simulation, foreign exchange volatility hedging, and strategic capital allocation under uncertainty.'
              },
              {
                icon: Scale,
                title: 'Governments',
                tag: 'GEOPOLITICAL POLICY',
                desc: 'Simulating sanction enforcement cascades, trade corridor closures, and multi-year macroeconomic response policies.'
              }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="p-6 bg-white border border-[#E3E0D8] space-y-4 hover:border-[#141413] transition-colors">
                  <div className="flex items-center justify-between">
                    <Icon size={20} className="text-[#E5182B]" />
                    <span className="font-mono text-[10px] text-[#87857F] border border-[#E3E0D8] px-1.5 py-0.5">
                      {card.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#141413]">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#66645E] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FINAL BRIEFING CTA */}
      <section className="py-20 sm:py-28 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="font-mono text-xs uppercase tracking-widest text-[#E5182B]">
            RESTRICTED PROTOTYPE ACCESS
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#141413] tracking-tight">
            Build the model of the world.
          </h2>
          <p className="text-base text-[#66645E] max-w-xl mx-auto font-sans leading-relaxed">
            We partner with institutional asset managers, central banks, and sovereign entities to evaluate customized world-model instances.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('contact')}
              className="px-7 py-3.5 bg-[#141413] hover:bg-[#2B2A28] text-[#FAF8F5] text-sm font-medium rounded-full transition-all cursor-pointer shadow-md"
            >
              Request Institutional Briefing
            </button>
            <button
              onClick={() => onNavigate('aakashavani')}
              className="px-6 py-3.5 bg-[#F0EEE6] hover:bg-[#E8E4DA] text-[#141413] text-sm font-medium rounded-full transition-all cursor-pointer"
            >
              Inspect Aakashavani Protocol
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
