import React from 'react';

interface HorizonBannerProps {
  headline?: string;
  subtext?: string;
  tag?: string;
}

export const HorizonBanner: React.FC<HorizonBannerProps> = ({
  headline = "The world changes. The model changes with it.",
  subtext = "Continuous, self-updating intelligence for high-stakes environments.",
  tag = "VEIRON HORIZON MANIFOLD"
}) => {
  return (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px] bg-[#0A0A09] overflow-hidden flex items-center justify-center text-center select-none border-y border-[#262624]">
      {/* Deep Space Background with subtle star grain */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 140px 70px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 220px 180px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 300px 120px, #ffffff, rgba(0,0,0,0))',
          backgroundSize: '360px 360px'
        }}
      />

      {/* Atmospheric Curved Horizon (matching Anthropic video frame 00:01) */}
      <div 
        className="absolute -bottom-[280px] sm:-bottom-[380px] lg:-bottom-[440px] left-1/2 -translate-x-1/2 w-[900px] sm:w-[1400px] lg:w-[1800px] h-[600px] sm:h-[800px] lg:h-[950px] rounded-[50%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 15%, rgba(229, 24, 43, 0.45) 0%, rgba(200, 70, 30, 0.25) 30%, rgba(10, 10, 9, 0.95) 75%)',
          boxShadow: '0 -20px 100px 30px rgba(229, 24, 43, 0.2), inset 0 2px 25px 2px rgba(255, 230, 200, 0.4)',
          borderTop: '1px solid rgba(255, 240, 220, 0.5)'
        }}
      />

      {/* Subtle Luminous Rays / Glow Flares rising from the curve */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none opacity-50"
        style={{
          background: 'linear-gradient(to top, rgba(229, 24, 43, 0.15), transparent)'
        }}
      />

      {/* Typography Overlaid on Horizon (matching Anthropic video typography at 00:01) */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-4">
        <div className="inline-block font-mono text-[11px] uppercase tracking-[0.3em] text-[#E5182B] opacity-90">
          {tag}
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#FAF8F5] tracking-tight leading-[1.12] drop-shadow-md">
          {headline}
        </h2>

        <p className="text-sm sm:text-base text-[#D4D0C5] font-sans max-w-xl mx-auto font-light leading-relaxed">
          {subtext}
        </p>

        <div className="pt-2 font-mono text-[10px] text-[#A19F97] tracking-widest uppercase">
          CONTINUOUS WORLD MANIFOLD :: 12,400 DIMENSIONS
        </div>
      </div>
    </div>
  );
};
