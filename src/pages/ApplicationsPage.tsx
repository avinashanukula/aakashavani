import React from 'react';
import { Page } from '../types';
import { TrendingUp, Landmark, Building2, Scale, ArrowRight } from 'lucide-react';

interface ApplicationsPageProps {
  onNavigate: (page: Page) => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen bg-[#FAF8F5] text-[#141413]">
      {/* Hero */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-[#E3E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#E5182B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E5182B]" />
              <span className="font-semibold tracking-wider">INSTITUTIONAL VERTICALS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif text-[#141413] tracking-tight leading-[1.08]">
              Institutional Applications
            </h1>

            <p className="text-lg sm:text-xl font-serif text-[#474540] leading-relaxed">
              Veiron builds world models for environments where decisions carry systemic consequence, capital risk is asymmetric, and stationary assumptions fail.
            </p>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#87857F] pt-2">
              <span className="text-[#141413]">HEDGE FUNDS</span>
              <span>·</span>
              <span className="text-[#141413]">CENTRAL BANKS</span>
              <span>·</span>
              <span className="text-[#141413]">SOVEREIGN WEALTH</span>
              <span>·</span>
              <span className="text-[#141413]">GLOBAL ENTERPRISES</span>
              <span>·</span>
              <span className="text-[#141413]">GOVERNMENTS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Cards */}
      <section className="py-20 sm:py-28 border-b border-[#E3E0D8] bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Domain 1 */}
            <div className="p-8 bg-white border border-[#E3E0D8] space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-[#E5182B]">
                <TrendingUp size={16} />
                <span>DOMAIN 01 · CAPITAL ALLOCATION</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#141413]">
                Hedge Funds & Quantitative Asset Managers
              </h2>
              <p className="text-sm text-[#4F4D47] leading-relaxed">
                Quantitative strategies suffer from alpha decay because statistical relationships discovered in historical backtests fail when market regimes mutate.
              </p>
              <ul className="space-y-2 text-xs font-mono text-[#66645E]">
                <li>• Continuous regime classification before trailing covariances adapt</li>
                <li>• Counterfactual portfolio rollouts across 10,000 synthetic paths</li>
                <li>• Adversarial dialectic red-teaming against dealer gamma traps</li>
              </ul>
            </div>

            {/* Domain 2 */}
            <div className="p-8 bg-white border border-[#E3E0D8] space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-[#E5182B]">
                <Landmark size={16} />
                <span>DOMAIN 02 · SYSTEMIC PRUDENTIAL</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#141413]">
                Central Banks & Sovereign Wealth Funds
              </h2>
              <p className="text-sm text-[#4F4D47] leading-relaxed">
                Sovereign entities manage systemic stability where policy moves trigger reflexive responses across banking systems and currency markets.
              </p>
              <ul className="space-y-2 text-xs font-mono text-[#66645E]">
                <li>• Interbank contagion and non-bank liquidity squeeze mapping</li>
                <li>• Continuous macroprudential stress simulations replacing quarterly static runs</li>
                <li>• Sovereign bond spread de-anchoring propagation models</li>
              </ul>
            </div>

            {/* Domain 3 */}
            <div className="p-8 bg-white border border-[#E3E0D8] space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-[#E5182B]">
                <Building2 size={16} />
                <span>DOMAIN 03 · ENTERPRISE</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#141413]">
                Global Corporations & Supply Chains
              </h2>
              <p className="text-sm text-[#4F4D47] leading-relaxed">
                Multinational corporates navigate maritime disruptions, currency volatility, and commodity shocks with forward counterfactual rollouts.
              </p>
              <ul className="space-y-2 text-xs font-mono text-[#66645E]">
                <li>• Dynamic maritime and raw material bottleneck forecasting</li>
                <li>• Cash-flow FX volatility collar optimization</li>
                <li>• Strategic capex allocation under uncertain cost of capital</li>
              </ul>
            </div>

            {/* Domain 4 */}
            <div className="p-8 bg-white border border-[#E3E0D8] space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-[#E5182B]">
                <Scale size={16} />
                <span>DOMAIN 04 · GEOPOLITICS</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#141413]">
                Governments & Sovereign Policy
              </h2>
              <p className="text-sm text-[#4F4D47] leading-relaxed">
                Sovereign policymakers anticipate second- and third-order consequences of sanctions, tariffs, trade corridor closures, and subsidies.
              </p>
              <ul className="space-y-2 text-xs font-mono text-[#66645E]">
                <li>• Sanction blowback simulation across international financial rails</li>
                <li>• Strategic petroleum and critical mineral supply security</li>
                <li>• Multi-year counterfactual policy evaluations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 sm:py-28 border-b border-[#E3E0D8] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 mb-12">
            <div className="font-mono text-xs uppercase tracking-widest text-[#E5182B]">
              CAPABILITY MATRIX
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#141413] tracking-tight">
              Institutional Stack Evolution
            </h2>
          </div>

          <div className="overflow-x-auto border border-[#E3E0D8] bg-white">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#F7F5F0] border-b border-[#E3E0D8] font-mono text-[#4F4D47]">
                <tr>
                  <th className="p-4">CAPABILITY</th>
                  <th className="p-4 text-[#87857F]">LEGACY DASHBOARDS</th>
                  <th className="p-4 text-[#87857F]">MULTI-AGENT LLMs</th>
                  <th className="p-4 text-[#141413] bg-[#FAF8F5] font-bold border-l border-[#E3E0D8]">
                    VEIRON WORLD MODELS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E0D8] text-[#474540]">
                <tr>
                  <td className="p-4 font-bold text-[#141413]">State Representation</td>
                  <td className="p-4 text-[#87857F]">Static charts & tables</td>
                  <td className="p-4 text-[#87857F]">Unstructured conversational tokens</td>
                  <td className="p-4 font-semibold text-[#141413] bg-[#FAF8F5] border-l border-[#E3E0D8]">
                    Continuous 12,400-dim manifold tensor
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#141413]">Uncertainty Handling</td>
                  <td className="p-4 text-[#87857F]">None (deterministic displays)</td>
                  <td className="p-4 text-[#87857F]">Uncalibrated output confidence</td>
                  <td className="p-4 font-semibold text-[#141413] bg-[#FAF8F5] border-l border-[#E3E0D8]">
                    Rigorous epistemic Bayesian bounds
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#141413]">Regime Adaptation</td>
                  <td className="p-4 text-[#87857F]">Catastrophic delay</td>
                  <td className="p-4 text-[#87857F]">Hallucinates prior patterns</td>
                  <td className="p-4 font-semibold text-[#141413] bg-[#FAF8F5] border-l border-[#E3E0D8]">
                    Sub-20ms assumption purge & re-anchor
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#141413]">Counterfactual Simulation</td>
                  <td className="p-4 text-[#87857F]">None (trailing historical only)</td>
                  <td className="p-4 text-[#87857F]">Unverified natural language stories</td>
                  <td className="p-4 font-semibold text-[#141413] bg-[#FAF8F5] border-l border-[#E3E0D8]">
                    Continuous causal Monte Carlo rollouts
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#F7F5F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-serif text-[#141413]">
            Deploy Customized Models in Your Institution
          </h2>
          <p className="text-sm text-[#66645E] max-w-xl mx-auto">
            Schedule an executive briefing to evaluate deployment topologies and private cluster security.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-7 py-3.5 bg-[#141413] hover:bg-[#2B2A28] text-white text-sm font-medium rounded-full transition-colors cursor-pointer"
          >
            Request Institutional Briefing →
          </button>
        </div>
      </section>
    </div>
  );
};
