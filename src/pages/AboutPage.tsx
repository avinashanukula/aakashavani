import React from 'react';
import { Page } from '../types';
import { HorizonBanner } from '../components/HorizonBanner';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-[#141413]">
      {/* Hero */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-[#E3E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#E5182B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E5182B]" />
              <span className="font-semibold tracking-wider">VEIRON MISSION & PHILOSOPHY</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif text-[#141413] tracking-tight leading-[1.08]">
              Build the model of the world.
            </h1>

            <p className="text-lg sm:text-xl font-serif text-[#474540] leading-relaxed">
              Veiron was founded on a simple conviction: modern artificial intelligence is trapped in conversational novelties and static prediction wrappers. We build continuous, AI-native world models for institutions navigating high-stakes complexity.
            </p>

            <div className="p-4 bg-white border border-[#E3E0D8] text-sm text-[#474540]">
              VEIRON is not another chatbot, dashboard, or collection of agents. It is focused on continuously evolving intelligence systems for complex real-world environments.
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric Horizon Banner */}
      <HorizonBanner
        headline="Continuous Epistemic Evolution"
        subtext="Grounding artificial intelligence in the continuous, reflexive dynamics of the real world."
        tag="FOUNDATIONAL PHILOSOPHY"
      />

      {/* 4 Foundational Axioms */}
      <section className="py-20 sm:py-28 border-b border-[#E3E0D8] bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 mb-16">
            <div className="font-mono text-xs uppercase tracking-widest text-[#E5182B]">
              FIRST PRINCIPLES
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#141413] tracking-tight">
              Foundational Epistemics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white border border-[#E3E0D8] space-y-3">
              <div className="font-mono text-xs text-[#E5182B] font-bold">AXIOM 01</div>
              <h3 className="text-xl font-serif font-bold text-[#141413]">Epistemic Humility</h3>
              <p className="text-sm text-[#4F4D47] leading-relaxed">
                Standard AI generates confident answers even when hallucinating. In high-stakes institutional settings, false certainty is fatal. Veiron world models explicitly measure and report what is unknown, maintaining bounded probability distributions rather than false claims.
              </p>
            </div>

            <div className="p-8 bg-white border border-[#E3E0D8] space-y-3">
              <div className="font-mono text-xs text-[#E5182B] font-bold">AXIOM 02</div>
              <h3 className="text-xl font-serif font-bold text-[#141413]">Continuous Evolution</h3>
              <p className="text-sm text-[#4F4D47] leading-relaxed">
                The world does not pause between user prompts. Markets fluctuate, supply chains fracture, geopolitical alliances realign. Veiron systems exist in continuous online synchronization with empirical reality. When the world changes, the model changes with it.
              </p>
            </div>

            <div className="p-8 bg-white border border-[#E3E0D8] space-y-3">
              <div className="font-mono text-xs text-[#E5182B] font-bold">AXIOM 03</div>
              <h3 className="text-xl font-serif font-bold text-[#141413]">Adversarial Rigor</h3>
              <p className="text-sm text-[#4F4D47] leading-relaxed">
                No single model or hypothesis is allowed to dictate institutional decisions unchallenged. Every proposed thesis must survive dedicated adversarial red-teaming, dialectical counter-evidence search, and formal verification gates before acceptance into the world state.
              </p>
            </div>

            <div className="p-8 bg-white border border-[#E3E0D8] space-y-3">
              <div className="font-mono text-xs text-[#E5182B] font-bold">AXIOM 04</div>
              <h3 className="text-xl font-serif font-bold text-[#141413]">Institutional Consequence</h3>
              <p className="text-sm text-[#4F4D47] leading-relaxed">
                Consumer software optimizes for casual engagement; Veiron optimizes for asymmetric institutional consequence. Our systems are engineered to withstand stress in environments where wrong decisions cost billions of dollars or destabilize sovereign economies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-serif text-[#141413]">
            Collaborate with Veiron
          </h2>
          <p className="text-sm text-[#66645E] max-w-xl mx-auto">
            Reach out directly for institutional briefing requests, research collaborations, or private model deployment inquiries.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-7 py-3.5 bg-[#141413] hover:bg-[#2B2A28] text-white text-sm font-medium rounded-full transition-colors cursor-pointer"
          >
            Contact the Team →
          </button>
        </div>
      </section>
    </div>
  );
};
