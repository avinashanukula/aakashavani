import React, { useState } from 'react';
import { Page, BetaRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { BETA_ROLES, getBetaRoleInfo } from '../data/betaRoles';
import { VeironLogo } from '../components/logos/VeironLogo';
import { AakashavaniLogo } from '../components/logos/AakashavaniLogo';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Phone, 
  Building2, 
  User as UserIcon, 
  CheckCircle2, 
  Activity, 
  Sparkles,
  Layers,
  Check
} from 'lucide-react';

interface AuthPageProps {
  onNavigate: (page: Page) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  onNavigate,
  initialMode = 'signup' 
}) => {
  const { signIn, signUp, currentUser } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sign Up Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [institution, setInstitution] = useState('');
  const [selectedRole, setSelectedRole] = useState<BetaRole>('quant-researcher');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Sign In Form Fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim()) {
      setErrorMsg('Please enter your full name and institutional email.');
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter a contact phone number for beta clearance.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: `${phonePrefix} ${phoneNumber.trim()}`,
        institution: institution.trim() || 'Institutional Research Desk',
        role: selectedRole
      });

      // Navigate to aakashavani page to preview beta version with active approval
      setTimeout(() => {
        onNavigate('aakashavani');
      }, 500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to complete registration.');
      setIsSubmitting(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!signInEmail.trim()) {
      setErrorMsg('Please enter your registered institutional email.');
      return;
    }

    if (!signInPassword.trim()) {
      setErrorMsg('Please enter your clearance code or password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(signInEmail.trim(), signInPassword.trim());
      setTimeout(() => {
        onNavigate('aakashavani');
      }, 400);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to sign in.');
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async (role: BetaRole) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    const demoEmail = role === 'quant-researcher' ? 'a.vance@blackrock-alpha.com' : 'm.chen@citadel-fx.com';
    try {
      try {
        await signIn(demoEmail, 'DEMO-CLEARANCE');
      } catch {
        await signUp({
          fullName: role === 'quant-researcher' ? 'Alex Vance' : 'Marcus Chen',
          email: demoEmail,
          phone: '+1 (212) 810-5300',
          institution: role === 'quant-researcher' ? 'BlackRock Systematic Macro Desk' : 'Citadel Fixed Income & Currencies',
          role: role
        });
      }
      setTimeout(() => {
        onNavigate('aakashavani');
      }, 400);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Demo sign in failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141413] py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E3E0D8]">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Branding */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <VeironLogo size={36} showText={true} textColor="text-[#141413]" />
          </div>

          <div className="space-y-1">
            <div className="font-mono text-xs uppercase tracking-widest text-[#E5182B] font-semibold">
              INSTITUTIONAL ACCESS PORTAL · COHORT 01
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif text-[#141413] tracking-tight">
              {mode === 'signup' ? 'Beta Testing Registration' : 'Institutional Sign In'}
            </h1>
            <p className="text-sm text-[#66645E]">
              {mode === 'signup' 
                ? 'Register for early access to Veiron\'s Aakashavani financial world model and receive your role approval credentials.'
                : 'Sign in with your authorized institutional email or active clearance code.'}
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex justify-center">
          <div className="bg-[#EAE6DD] p-1 rounded-full border border-[#D5D0C5] flex items-center">
            <button
              onClick={() => { setMode('signup'); setErrorMsg(null); }}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#141413] text-white shadow-md'
                  : 'text-[#66645E] hover:text-[#141413]'
              }`}
            >
              Opt-In / Register for Beta
            </button>
            <button
              onClick={() => { setMode('signin'); setErrorMsg(null); }}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#141413] text-white shadow-md'
                  : 'text-[#66645E] hover:text-[#141413]'
              }`}
            >
              Institutional Sign In
            </button>
          </div>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="max-w-2xl mx-auto p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
            <Lock size={14} className="shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Card Container */}
        <div className="max-w-2xl mx-auto bg-white border-2 border-[#141413] shadow-xl p-6 sm:p-10 space-y-8">
          {mode === 'signup' ? (
            /* ================= SIGN UP FORM ================= */
            <form onSubmit={handleSignUpSubmit} className="space-y-6">
              {/* Identity & Contact Section */}
              <div className="space-y-4">
                <div className="text-xs font-mono text-[#87857F] uppercase tracking-wider pb-2 border-b border-[#F0EEE6]">
                  1. APPLICANT DETAILS
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#141413]">
                      Full Name <span className="text-[#E5182B]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#87857F]">
                        <UserIcon size={15} />
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Dr. Julian Mercer"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E3E0D8] text-xs text-[#141413] focus:outline-none focus:border-[#141413] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Work Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#141413]">
                      Institutional Email <span className="text-[#E5182B]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#87857F]">
                        <Mail size={15} />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. jmercer@fund-alpha.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E3E0D8] text-xs text-[#141413] focus:outline-none focus:border-[#141413] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number with Prefix */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#141413]">
                      Phone Number <span className="text-[#E5182B]">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={phonePrefix}
                        onChange={(e) => setPhonePrefix(e.target.value)}
                        className="px-2 py-2.5 bg-[#FAF8F5] border border-[#E3E0D8] text-xs text-[#141413] focus:outline-none focus:border-[#141413] shrink-0"
                      >
                        <option value="+1">+1 (US/CA)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+91">+91 (IN)</option>
                        <option value="+81">+81 (JP)</option>
                        <option value="+41">+41 (CH)</option>
                        <option value="+65">+65 (SG)</option>
                        <option value="+49">+49 (DE)</option>
                      </select>
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#87857F]">
                          <Phone size={14} />
                        </div>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="212-555-0199"
                          className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E3E0D8] text-xs text-[#141413] focus:outline-none focus:border-[#141413] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Institution / Firm Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#141413]">
                      Firm / Institution Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#87857F]">
                        <Building2 size={15} />
                      </div>
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="e.g. Citadel / Millennium / Bridgewater"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E3E0D8] text-xs text-[#141413] focus:outline-none focus:border-[#141413] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Beta Tester Role Selection */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EEE6]">
                  <span className="text-xs font-mono text-[#87857F] uppercase tracking-wider">
                    2. SELECT BETA TESTER ROLE & CLEARANCE TIER
                  </span>
                  <span className="text-[11px] font-mono text-[#E5182B] font-semibold">
                    ROLE APPROVAL DISPATCHED ON REGISTRATION
                  </span>
                </div>

                <div className="space-y-2.5">
                  {BETA_ROLES.map((role) => {
                    const isSelected = selectedRole === role.id;

                    return (
                      <div
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-3.5 border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'border-[#141413] bg-[#FAF8F5] ring-1 ring-[#141413]'
                            : 'border-[#E3E0D8] hover:border-[#141413]/50 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-serif font-bold text-[#141413]">
                                {role.title}
                              </span>
                              <span className="px-1.5 py-0.5 bg-[#E5182B]/10 text-[#E5182B] text-[10px] font-mono font-semibold">
                                {role.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#66645E] leading-relaxed">
                              {role.description}
                            </p>
                          </div>

                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'border-[#E5182B] bg-[#E5182B]' : 'border-[#C5C2BA]'
                          }`}>
                            {isSelected && <Check size={11} className="text-white" />}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-3 pt-2.5 border-t border-[#E3E0D8] text-[10px] font-mono text-[#4F4D47] grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {role.permissions.map((p, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[#141413]">
                                <span className="text-[#E5182B]">✓</span>
                                <span className="truncate">{p}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#474540]">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 accent-[#E5182B] cursor-pointer"
                  />
                  <span>
                    I confirm that I am registering on behalf of an institutional research, trading, or model governance desk and agree to the Veiron Institutional Non-Disclosure and Beta Evaluation Terms.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || !agreedToTerms}
                className="w-full py-4 px-6 bg-[#E5182B] hover:bg-[#FF2A3D] disabled:opacity-50 text-white font-semibold text-sm rounded-none transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>PROVISIONING CREDENTIALS...</span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Opt-In & Request Beta Tester Role Approval</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ================= SIGN IN FORM ================= */
            <form onSubmit={handleSignInSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-mono text-[#87857F] uppercase tracking-wider pb-2 border-b border-[#F0EEE6]">
                  INSTITUTIONAL CREDENTIALS
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#141413]">
                    Institutional Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#87857F]">
                      <Mail size={15} />
                    </div>
                    <input
                      type="email"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="e.g. analyst@institution.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E3E0D8] text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-[#141413]">
                      Clearance Code / Password
                    </label>
                    <span className="text-[10px] font-mono text-[#E5182B] font-semibold">REQUIRED FOR INSTITUTIONAL ACCESS</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#87857F]">
                      <Lock size={15} />
                    </div>
                    <input
                      type="password"
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="e.g. AKHVNI-AUTH-XXXX-XXX or password"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E3E0D8] text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-[#141413] hover:bg-[#2B2A28] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isSubmitting ? (
                  <span>AUTHENTICATING SESSION...</span>
                ) : (
                  <>
                    <span>Sign In to Beta Session</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              {/* Instant 1-Click Demo Testing Logins */}
              <div className="pt-4 border-t border-[#E3E0D8] space-y-2">
                <div className="text-[11px] font-mono text-[#87857F] uppercase tracking-wider text-center">
                  OR INSTANT 1-CLICK DEMO AUTHENTICATION
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('quant-researcher')}
                    className="p-2.5 bg-[#FAF8F5] hover:bg-[#F0EEE6] border border-[#E3E0D8] text-left transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-[#141413]">Sign in as Quant Auditor</div>
                    <div className="text-[10px] font-mono text-[#87857F]">QUANT-AUDITOR-LV1</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoSignIn('fx-rates-trader')}
                    className="p-2.5 bg-[#FAF8F5] hover:bg-[#F0EEE6] border border-[#E3E0D8] text-left transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-[#141413]">Sign in as FX Trader</div>
                    <div className="text-[10px] font-mono text-[#87857F]">FX-RATES-EXEC-LV1</div>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Security & Verification Footer */}
        <div className="text-center font-mono text-xs text-[#87857F] space-y-1">
          <div>VEIRON RECURSIVE ARCHITECTURE · SECURITY TIERS AUDITED UNDER NIST & ISO 27001</div>
          <div className="text-[#B5B2A8]">Instance: AKHVNI-0.1.2-BETA-SECURED</div>
        </div>
      </div>
    </div>
  );
};
