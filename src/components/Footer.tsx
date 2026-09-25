import React, { useState } from 'react';
import { VeironLogo } from './logos/VeironLogo';
import { AakashavaniLogo } from './logos/AakashavaniLogo';
import { Page } from '../types';
import { Mail, Copy, Check, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('avianukula@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full bg-[#111110] border-t border-[#262624] text-[#A19F97] pt-16 pb-28 sm:pb-36 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid Columns matching Anthropic video frames 00:03 - 00:05 */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-16 border-b border-[#262624]">
          {/* Brand Mark Column */}
          <div className="col-span-2 space-y-4 pr-4">
            <div className="flex items-center gap-3">
              <VeironLogo size={36} showText={true} textColor="text-[#FAF8F5]" />
            </div>
            <p className="text-base font-serif text-[#FAF8F5] leading-snug">
              Build the model of the world.
            </p>
            <p className="text-xs text-[#87857F] leading-relaxed max-w-sm">
              Veiron builds AI-native world models that understand complex, continuously changing environments and help institutions reason, simulate, and make decisions under uncertainty.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#87857F] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E5182B]" />
              <span>AKHVNI-0.1.2 :: FINANCIAL_ENVIRONMENT</span>
            </div>
          </div>

          {/* Column 1: Products */}
          <div className="space-y-3 text-xs">
            <div className="text-[#FAF8F5] font-semibold tracking-wide text-xs">
              Products
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('aakashavani')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Aakashavani</span>
                  <span className="text-[10px] text-[#E5182B] font-mono">0.1.2</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('aakashavani')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  World State Kernel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('aakashavani')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Belief State Posterior
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('aakashavani')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Simulation Console
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Research */}
          <div className="space-y-3 text-xs">
            <div className="text-[#FAF8F5] font-semibold tracking-wide text-xs">
              Research
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('approach')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  World-Model Approach
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('approach')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cascading Invalidation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('aakashavani')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Adversarial Red Teaming
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Epistemic Uncertainty
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Applications & Verticals */}
          <div className="space-y-3 text-xs">
            <div className="text-[#FAF8F5] font-semibold tracking-wide text-xs">
              Institutions
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('applications')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Hedge Funds & Quants
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('applications')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Central Banks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('applications')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Global Corporates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('applications')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sovereign Strategy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Access */}
          <div className="space-y-3 text-xs">
            <div className="text-[#FAF8F5] font-semibold tracking-wide text-xs">
              Inquiries
            </div>
            <p className="text-[11px] text-[#87857F]">
              Direct communication for institutions:
            </p>
            <a
              href="mailto:avianukula@gmail.com"
              className="text-white hover:text-[#E5182B] transition-colors break-all font-mono text-xs block"
            >
              avianukula@gmail.com
            </a>
            <div className="pt-1">
              <button
                onClick={copyEmail}
                className="text-[10px] font-mono text-[#87857F] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={11} className="text-emerald-400" />
                    <span className="text-emerald-400">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span>COPY EMAIL</span>
                  </>
                )}
              </button>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('contact')}
                className="px-3 py-1.5 bg-[#222220] hover:bg-[#2B2A28] text-white text-[11px] font-medium transition-colors cursor-pointer"
              >
                Request Briefing →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Slogan & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#63625D]">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} VEIRON TECHNOLOGIES INC.</span>
            <span>·</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>FINANCE</span>
            <span>·</span>
            <span>HEDGE FUNDS</span>
            <span>·</span>
            <span>BANKS</span>
            <span>·</span>
            <span>GOVERNMENTS</span>
            <span>·</span>
            <span>BUSINESSES</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
