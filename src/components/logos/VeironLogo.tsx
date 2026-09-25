import React from 'react';

interface VeironLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export const VeironLogo: React.FC<VeironLogoProps> = ({
  className = '',
  size = 32,
  showText = false,
  textColor = 'text-current',
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        {/* Isometric Cube - VEIRON Original Identity */}
        {/* Top Face */}
        <polygon
          points="50,6 90,29 50,52 10,29"
          fill="#E5192C"
        />
        
        {/* Left Face (Deep Shadow) */}
        <polygon
          points="10,29 50,52 50,96 10,73"
          fill="#B60B1A"
        />
        
        {/* Right Face (Mid Crimson) */}
        <polygon
          points="50,52 90,29 90,73 50,96"
          fill="#CD1223"
        />

        {/* White Isometric 'V' on the Right Face */}
        {/* Rendered to match perspective transform along the right face plane */}
        <path
          d="M 54.5 48.5 L 61 45 L 75 75.5 L 87 30 L 90 31.8 L 76.5 82.5 L 72.5 80 Z"
          fill="#FFFFFF"
        />
      </svg>
      {showText && (
        <span className={`font-bold tracking-[0.22em] text-[15px] uppercase font-sans ${textColor}`}>
          VEIRON
        </span>
      )}
    </div>
  );
};
