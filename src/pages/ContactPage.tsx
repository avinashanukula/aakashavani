import React, { useState } from 'react';
import { Page } from '../types';
import { Mail, Copy, Check, Clock, Lock, ShieldCheck, ArrowRight, Send } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: Page) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    institution: '',
    type: 'Hedge Fund / Quantitative Asset Manager',
    email: '',
    message: ''
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('avianukula@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-[#141413]">
      <section className="pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#E5182B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E5182B]" />
              <span className="font-semibold tracking-wider">INSTITUTIONAL RELATIONS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif text-[#141413] tracking-tight">
              Contact Veiron
            </h1>

            <p className="text-base sm:text-lg text-[#66645E] max-w-xl mx-auto leading-relaxed">
              For institutional briefings, prototype evaluation access (AKHVNI-0.1.2), or custom world-model deployment inquiries.
            </p>
          </div>

          {/* Direct Email Card - Anthropic Clean Paper Block */}
          <div className="p-8 sm:p-10 bg-white border border-[#E3E0D8] space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EEE6]">
              <div>
                <div className="font-mono text-xs text-[#87857F] uppercase tracking-wider">
                  Primary Direct Channel
                </div>
                <div className="text-sm text-[#474540] mt-0.5">
                  Direct correspondence with the engineering and research team:
                </div>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>MONITORED ENCRYPTED INBOX</span>
              </div>
            </div>

            {/* Email Address Display */}
            <div className="p-6 bg-[#FAF8F5] border border-[#E3E0D8] flex flex-col md:flex-row items-center justify-between gap-6">
              <a
                href="mailto:avianukula@gmail.com"
                className="flex items-center gap-4 text-xl sm:text-2xl font-mono text-[#141413] hover:text-[#E5182B] transition-colors break-all group"
              >
                <div className="p-3 bg-white border border-[#E3E0D8] text-[#E5182B] group-hover:scale-105 transition-transform">
                  <Mail size={22} />
                </div>
                <span className="underline underline-offset-4 decoration-[#E3E0D8] group-hover:decoration-[#E5182B]">
                  avianukula@gmail.com
                </span>
              </a>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleCopyEmail}
                  className="px-4 py-2.5 bg-white hover:bg-[#F0EEE6] text-[#141413] border border-[#E3E0D8] font-mono text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span className="text-emerald-700 font-bold">COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>COPY EMAIL</span>
                    </>
                  )}
                </button>

                <a
                  href="mailto:avianukula@gmail.com?subject=Veiron%20Institutional%20Inquiry"
                  className="px-5 py-2.5 bg-[#141413] hover:bg-[#2B2A28] text-white font-mono text-xs font-semibold tracking-wider transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span>WRITE EMAIL</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>

            {/* SLA Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-[#87857F] pt-2">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#141413]" />
                <span>24-Hour Institutional SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-[#141413]" />
                <span>Mutual NDA Protocols Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#141413]" />
                <span>Air-Gapped Sovereign Cluster</span>
              </div>
            </div>
          </div>

          {/* Institutional Briefing Request Form */}
          <div className="p-8 bg-white border border-[#E3E0D8] space-y-6">
            <div className="border-b border-[#F0EEE6] pb-4">
              <h2 className="text-xl font-serif font-bold text-[#141413]">
                Request an Institutional Briefing
              </h2>
              <p className="text-xs text-[#66645E] mt-1">
                Share your organization's mandate and primary bottleneck to receive technical evaluation materials tailored to your deployment environment.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-[#FAF8F5] border border-emerald-500/30 text-center space-y-3 font-mono">
                <div className="inline-flex p-2 bg-emerald-100 text-emerald-700 rounded-full">
                  <Check size={20} />
                </div>
                <div className="text-[#141413] font-bold text-sm">
                  BRIEFING REQUEST TRANSMITTED
                </div>
                <p className="text-xs text-[#66645E] max-w-md mx-auto">
                  Thank you. Our institutional team has received your inquiry. We will contact you at <span className="font-semibold text-[#141413]">{formState.email || 'your email'}</span> within 24 hours.
                </p>
                <div className="pt-2">
                  <a href="mailto:avianukula@gmail.com" className="text-xs text-[#E5182B] underline">
                    Send supplementary material to avianukula@gmail.com
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#474540] font-mono uppercase tracking-wider text-[10px] mb-1.5">
                      Institution / Firm Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bridgewater / Citadel / Bank of England"
                      value={formState.institution}
                      onChange={(e) => setFormState({ ...formState, institution: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E3E0D8] text-[#141413] px-3.5 py-2.5 focus:border-[#141413] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#474540] font-mono uppercase tracking-wider text-[10px] mb-1.5">
                      Entity Classification
                    </label>
                    <select
                      value={formState.type}
                      onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#E3E0D8] text-[#141413] px-3.5 py-2.5 focus:border-[#141413] focus:outline-none transition-colors"
                    >
                      <option value="Hedge Fund / Asset Manager">Hedge Fund / Quantitative Asset Manager</option>
                      <option value="Central Bank / Sovereign Wealth">Central Bank / Sovereign Wealth Fund</option>
                      <option value="Commercial Bank / Prime Broker">Commercial Bank / Prime Broker</option>
                      <option value="Corporate / Supply Chain">Global Enterprise / Supply Chain</option>
                      <option value="Government / Strategic Policy">Government / Strategic Policy</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#474540] font-mono uppercase tracking-wider text-[10px] mb-1.5">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@institution.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E3E0D8] text-[#141413] px-3.5 py-2.5 focus:border-[#141413] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#474540] font-mono uppercase tracking-wider text-[10px] mb-1.5">
                    Scope of Inquiry
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your current challenge (e.g. non-stationary regime transition detection, liquidity crisis simulation, or alpha decay)..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#E3E0D8] text-[#141413] px-3.5 py-2.5 focus:border-[#141413] focus:outline-none transition-colors"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] text-[#87857F]">
                    Direct institutional disclosure under confidentiality guarantee.
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#141413] hover:bg-[#2B2A28] text-white font-mono text-xs font-semibold rounded-full transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>Transmit Briefing Request</span>
                    <Send size={12} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
