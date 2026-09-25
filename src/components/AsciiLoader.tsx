import React, { useState, useEffect } from 'react';

interface AsciiLoaderProps {
  label?: string;
  variant?: 'inline' | 'banner' | 'card' | 'overlay';
  progress?: number; // 0 to 100, or undefined for indeterminate
  durationMs?: number;
  onComplete?: () => void;
  className?: string;
}

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const CLASSIC_SLASH_FRAMES = ['/', '—', '\\', '|'];
const BLOCK_PULSE = [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃', ' '];

export const AsciiLoader: React.FC<AsciiLoaderProps> = ({
  label = 'RESOLVING WORLD STATE...',
  variant = 'card',
  progress: externalProgress,
  durationMs,
  onComplete,
  className = '',
}) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [pulseIndex, setPulseIndex] = useState(0);
  const [internalProgress, setInternalProgress] = useState(externalProgress ?? 0);

  // Spinner animation ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % SPINNER_FRAMES.length);
      setPulseIndex((prev) => (prev + 1) % BLOCK_PULSE.length);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  // Timed progress simulation if durationMs provided
  useEffect(() => {
    if (externalProgress !== undefined) {
      setInternalProgress(externalProgress);
      return;
    }

    if (!durationMs) {
      // Loop indeterminate progress
      const pTimer = setInterval(() => {
        setInternalProgress((prev) => {
          if (prev >= 98) return 12;
          return prev + 2;
        });
      }, 70);
      return () => clearInterval(pTimer);
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / durationMs) * 100));
      setInternalProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [durationMs, externalProgress, onComplete]);

  // Construct ASCII progress bar: [████████████░░░░░░░░░░░░]
  const barWidth = variant === 'inline' ? 12 : 24;
  const filledCount = Math.round((internalProgress / 100) * barWidth);
  const emptyCount = Math.max(0, barWidth - filledCount);
  const progressBarAscii = `[${'█'.repeat(filledCount)}${'░'.repeat(emptyCount)}]`;

  const spinner = SPINNER_FRAMES[frameIndex];
  const slash = CLASSIC_SLASH_FRAMES[frameIndex % CLASSIC_SLASH_FRAMES.length];
  const pulseBlock = BLOCK_PULSE[pulseIndex];

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 font-mono text-xs text-[#141413] select-none ${className}`}>
        <span className="text-[#E5182B] font-bold">{spinner}</span>
        <span className="text-[#66645E]">{label}</span>
        <span className="text-[#87857F] tracking-tighter text-[11px]">{progressBarAscii}</span>
        <span className="text-[#141413] font-semibold text-[11px]">{internalProgress}%</span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`w-full py-2.5 px-4 bg-[#F2EFE9] border-y border-[#E3E0D8] font-mono text-xs text-[#141413] flex flex-wrap items-center justify-between gap-3 select-none ${className}`}>
        <div className="flex items-center gap-2.5">
          <span className="text-[#E5182B] font-bold text-sm">{spinner}</span>
          <span className="font-semibold tracking-wider text-[11px] uppercase">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#87857F] tracking-widest text-[11px]">{progressBarAscii}</span>
          <span className="font-bold text-[#E5182B] text-[11px]">{internalProgress}%</span>
          <span className="text-[#87857F] text-[10px] hidden sm:inline">CYCLE {slash}</span>
        </div>
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 z-50 bg-[#FAF8F5]/85 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white border border-[#E3E0D8] p-6 max-w-md w-full shadow-xl space-y-4 font-mono select-none">
          <div className="flex items-center justify-between text-xs pb-3 border-b border-[#E3E0D8]">
            <div className="flex items-center gap-2">
              <span className="text-[#E5182B] font-bold text-sm">{spinner}</span>
              <span className="text-[#141413] font-semibold tracking-wider text-[11px]">VEIRON COGNITIVE CYCLE</span>
            </div>
            <span className="text-[#87857F] text-[11px]">AKHVNI-0.1.2</span>
          </div>

          <div className="space-y-2 py-2">
            <div className="text-xs text-[#474540] flex items-center justify-between">
              <span>{label}</span>
              <span className="text-[#E5182B] font-bold">{internalProgress}%</span>
            </div>
            <div className="text-xs text-[#87857F] tracking-wider overflow-hidden text-center sm:text-left">
              {progressBarAscii}
            </div>
          </div>

          <div className="text-[10px] text-[#87857F] pt-2 border-t border-[#F0EEE6] flex items-center justify-between">
            <span>BAYESIAN EVIDENCE CONVERGENCE</span>
            <span className="text-[#141413] font-bold">{pulseBlock} ACTIVE</span>
          </div>
        </div>
      </div>
    );
  }

  // Default 'card' variant
  return (
    <div className={`p-5 bg-white border border-[#E3E0D8] font-mono text-xs select-none space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-[#87857F] pb-2 border-b border-[#F0EEE6]">
        <div className="flex items-center gap-2">
          <span className="text-[#E5182B] font-bold text-sm">{spinner}</span>
          <span className="font-semibold text-[#141413] tracking-wide text-[11px]">{label}</span>
        </div>
        <span className="text-[11px] font-bold text-[#E5182B]">{internalProgress}%</span>
      </div>

      <div className="py-1 flex items-center justify-between text-[#66645E]">
        <span className="tracking-widest text-xs font-mono">{progressBarAscii}</span>
        <span className="text-[11px] text-[#87857F] font-mono">TICK {slash}</span>
      </div>

      <div className="text-[10px] text-[#87857F] flex items-center justify-between pt-1">
        <span>MANIFOLD RECOMPUTATION</span>
        <span className="text-emerald-700">OK</span>
      </div>
    </div>
  );
};
