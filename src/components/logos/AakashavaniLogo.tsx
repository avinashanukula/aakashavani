import React from 'react';

interface AakashavaniLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  color?: string;
}

export const AakashavaniLogo: React.FC<AakashavaniLogoProps> = ({
  className = '',
  size = 56,
  showWordmark = true,
  color = 'currentColor',
}) => {
  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        width={size}
        height={size * (showWordmark ? 1.05 : 0.85)}
        viewBox="0 0 100 95"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Emblem: stylized cosmic eye intersecting soaring acute chevron 'A' */}
        <g stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Outer Chevron 'A' Frame */}
          <path
            d="M 26 78 L 70 12 L 77 77"
            className="opacity-95"
          />
          {/* Inner Chevron 'A' Inset */}
          <path
            d="M 34.5 74.5 L 59 44 L 71 67"
            className="opacity-95"
          />
          {/* Chevron Peak Cap & Base detailing */}
          <path
            d="M 66 24 L 71 67"
            strokeWidth="0.8"
            className="opacity-40"
          />

          {/* Left Eye: Outer Eyelids */}
          <path
            d="M 19 49 C 23 37, 36 34, 48 36"
            className="opacity-90"
          />
          <path
            d="M 19 49 C 23 57, 34 60, 44 59"
            className="opacity-90"
          />

          {/* Inner Iris Arcs */}
          <path
            d="M 31 43.5 A 6.5 6.5 0 0 1 43 45"
            strokeWidth="1.3"
            className="opacity-80"
          />
          <path
            d="M 33 52 A 6.5 6.5 0 0 1 31 43.5"
            strokeWidth="1.3"
            className="opacity-80"
          />

          {/* Pupil */}
          <circle
            cx="38"
            cy="48"
            r="2.2"
            fill={color}
            stroke="none"
            className="opacity-95"
          />
        </g>

        {/* Wordmark below emblem */}
        {showWordmark && (
          <text
            x="50"
            y="90"
            textAnchor="middle"
            fill={color}
            fontSize="7"
            fontFamily="'Inter', 'JetBrains Mono', sans-serif"
            fontWeight="300"
            letterSpacing="0.48em"
            className="tracking-[0.48em] uppercase select-none opacity-90"
          >
            Aakashavani
          </text>
        )}
      </svg>
    </div>
  );
};
