import React, { useState } from 'react';
import { Page } from '../types';
import { useAuth } from '../context/AuthContext';
import { getBetaRoleInfo } from '../data/betaRoles';
import { AakashavaniLogo } from '../components/logos/AakashavaniLogo';
import { SimulationConsole } from '../components/SimulationConsole';
import { ModelEvaluationHub } from '../components/ModelEvaluationHub';
import { HorizonBanner } from '../components/HorizonBanner';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Activity, 
  ShieldCheck, 
  Scale, 
  Layers, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Compass 
} from 'lucide-react';

interface AakashavaniPageProps {
  onNavigate: (page: Page) => void;
}

export const AakashavaniPage: React.FC<AakashavaniPageProps> = ({ onNavigate }) => {
  const { currentUser, launchLiveBeta } = useAuth();
  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-[#141413]">
      {/* Product Hero */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-[#E3E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#87857F]">
                <span className="px-2 py-0.5 bg-[#E5182B]/10 text-[#E5182B] border border-[#E5182B]/20 font-semibold">
                  VEIRON WORLD MODEL · INSTANCE 01
                </span>
                <span>·</span>
                <span className="text-[#141413]">AKHVNI-0.1.2</span>
              </div>

              <div className="flex items-center gap-4">
                <AakashavaniLogo size={68} showWordmark={false} color="#141413" />
                <div>
                  <h1 className="text-4xl sm:text-6xl font-serif text-[#141413] tracking-tight">
                    Aakashavani
                  </h1>
                  <p className="text-sm font-mono text-[#66645E] uppercase tracking-wider mt-1">
                    A World Model for Financial Intelligence
                  </p>
                </div>
              </div>

              <p className="text-lg sm:text-xl font-serif text-[#292825] leading-relaxed max-w-2xl">
                Veiron's first world-model prototype for financial environments. The market is not a static equation or an NLP query box; it is an interconnected, living, continuous system.
              </p>

              <div className="p-4 bg-white border border-[#E3E0D8] text-sm text-[#474540] font-sans leading-relaxed">
                <span className="font-semibold text-[#141413]">Core Thesis: </span>
                Aakashavani continuously builds a probabilistic understanding of the market, investigates competing explanations, uses specialized AI reasoning systems, challenges its own conclusions, verifies outputs, and produces an evolving decision state.
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => launchLiveBeta(onNavigate)}
                  className="px-6 py-3 bg-[#141413] hover:bg-[#2B2A28] text-[#FAF8F5] text-sm font-medium rounded-full transition-all flex items-center gap-2.5 cursor-pointer shadow-sm group"
                >
                  <Activity size={15} className="text-[#E5182B] group-hover:scale-110 transition-transform" />
                  <span>Preview Beta Version</span>
                  <ArrowUpRight size={14} className="text-[#87857F] group-hover:text-white transition-colors" />
                </button>

                <button
                  onClick={() => onNavigate('contact')}
                  className="px-5 py-3 text-sm text-[#474540] hover:text-[#141413] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Request Prototype Briefing</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="p-6 bg-white border border-[#E3E0D8] space-y-4">
                <div className="font-mono text-xs text-[#87857F] uppercase tracking-wider pb-3 border-b border-[#F0EEE6]">
                  <span>SYSTEM METRICS</span>
                </div>
                <div className="space-y-3 font-mono text-xs text-[#4F4D47]">
                  <div className="flex justify-between">
                    <span className="text-[#87857F]">SYSTEM BUILD:</span>
                    <span className="text-[#141413] font-semibold">AKHVNI-0.1.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#87857F]">ENVIRONMENT:</span>
                    <span className="text-[#141413] font-semibold">GLOBAL_MACRO_FX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#87857F]">EPISTEMIC UNCERTAINTY:</span>
                    <span className="text-[#141413]">0.142 (BOUNDED)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#87857F]">RECURSIVE CYCLE:</span>
                    <span className="text-[#141413]">14.8ms CONTINUOUS</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#F0EEE6] text-[11px] font-mono text-[#87857F]">
                  "The world changes. The model changes with it."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric Horizon Banner */}
      <HorizonBanner 
        headline="Continuous Probabilistic Intelligence"
        subtext="Tracking cross-asset flows, options volatility skew, and macroeconomic reflexivity."
        tag="AKHVNI COGNITIVE CORE"
      />

      {/* Live Simulation Console Section */}
      <section id="simulation-section" className="py-20 sm:py-28 border-b border-[#E3E0D8] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 mb-12">
            <div className="font-mono text-xs uppercase tracking-widest text-[#E5182B]">
              INTERACTIVE WORLD MODEL SIMULATOR
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#141413] tracking-tight">
              Aakashavani In Action: Resolving Uncertainty in Real Time
            </h2>
            <p className="text-sm sm:text-base text-[#66645E]">
              Test real institutional market shock scenarios to observe how Aakashavani establishes competing hypotheses, runs adversarial dialectics, and updates its decision state.
            </p>
          </div>

          {/* Beta Session Clearance Status Strip */}
          <div className="mb-8 p-4 bg-white border border-[#E3E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {currentUser ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#141413] text-white">
                    <ShieldCheck size={18} className="text-[#E5182B]" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-semibold text-[#141413]">AUTHORIZED BETA SESSION:</span>
                      <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-300">
                        APPROVED
                      </span>
                      <span className="text-[#87857F]">· {currentUser.clearanceCode}</span>
                    </div>
                    <div className="text-xs text-[#66645E]">
                      Auditing as <span className="font-semibold text-[#141413]">{getBetaRoleInfo(currentUser.role).title}</span> ({currentUser.institution || 'Institutional Desk'})
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => launchLiveBeta(onNavigate)}
                  className="px-5 py-2.5 bg-[#E5182B] hover:bg-[#FF2A3D] text-white text-xs font-semibold rounded-full transition-all shrink-0 cursor-pointer shadow-sm flex items-center gap-2 self-start sm:self-auto"
                >
                  <Activity size={14} />
                  <span>Launch Live Simulation Desk</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FAF8F5] border border-[#E3E0D8] text-[#87857F]">
                    <Activity size={18} />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#87857F]">
                      <span className="font-semibold text-[#141413]">GUEST BETA PREVIEW</span>
                      <span>·</span>
                      <span>PUBLIC TELEMETRY STREAM</span>
                    </div>
                    <div className="text-xs text-[#66645E]">
                      Institutional authentication is required to access live simulation capabilities and shock injection controls.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-2 bg-[#E5182B] hover:bg-[#FF2A3D] text-white text-xs font-semibold rounded-full transition-all shrink-0 cursor-pointer shadow-sm self-start sm:self-auto"
                >
                  Opt-In for Beta Testing
                </button>
              </div>
            )}
          </div>

          <SimulationConsole />
        </div>
      </section>

      {/* Full Transparency & Model Evaluation Hub */}
      <section className="py-20 sm:py-28 border-b border-[#E3E0D8] bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ModelEvaluationHub />
        </div>
      </section>

      {/* Institutional Pilot CTA */}
      <section className="py-20 sm:py-24 bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#141413] tracking-tight">
            Deploy Aakashavani in Your Fund or Desk
          </h2>
          <p className="text-sm text-[#66645E] max-w-xl mx-auto">
            Contact the research and engineering team for private instance deployment and proprietary venue data ingestion.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="px-7 py-3.5 bg-[#141413] hover:bg-[#2B2A28] text-[#FAF8F5] text-sm font-medium rounded-full transition-all cursor-pointer shadow-md"
            >
              Request Institutional Pilot
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
