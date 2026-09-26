import React from 'react';

interface ArchiveLogoProps {
  className?: string;
  isDark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ArchiveLogo: React.FC<ArchiveLogoProps> = ({
  className = '',
  isDark = false,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const titleSizes = {
    sm: 'text-[13px] tracking-wider',
    md: 'text-[15px] tracking-wider',
    lg: 'text-[18px] tracking-wider',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Emblem Icon: Burgundy shield with Gold Double Border & Classical Temple */}
      <div
        className={`${iconSizes[size]} relative rounded-[6px] shrink-0 p-[2px] bg-gradient-to-br from-[#7a1c27] via-[#540414] to-[#3a020c] shadow-[0_2px_6px_rgba(84,4,20,0.35)] flex items-center justify-center border border-[#d4af37]/70`}
      >
        <div className="w-full h-full rounded-[4px] border border-[#d4af37]/40 flex items-center justify-center p-0.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Triangular Pediment */}
            <path
              d="M12 4L4 9H20L12 4Z"
              fill="#d4af37"
              stroke="#edd791"
              strokeWidth="0.5"
            />
            {/* Center dot in pediment */}
            <circle cx="12" cy="7.2" r="0.8" fill="#ffffff" />
            {/* Architrave Beam */}
            <rect x="5" y="9.2" width="14" height="1.2" fill="#d4af37" />
            {/* 3 Classical Columns */}
            <rect x="6.8" y="10.8" width="1.8" height="6.4" fill="#ffffff" rx="0.3" />
            <rect x="11.1" y="10.8" width="1.8" height="6.4" fill="#ffffff" rx="0.3" />
            <rect x="15.4" y="10.8" width="1.8" height="6.4" fill="#ffffff" rx="0.3" />
            {/* Base Plinth */}
            <rect x="4.5" y="17.4" width="15" height="1.4" fill="#d4af37" rx="0.2" />
            <rect x="3.5" y="19" width="17" height="1.2" fill="#bfa55a" rx="0.2" />
          </svg>
        </div>
      </div>

      {/* Typography Label */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-serif uppercase font-bold tracking-[0.16em] ${
            isDark ? 'text-white' : 'text-[#1d1b18]'
          } ${titleSizes[size]}`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          DIGITAL HERITAGE
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="font-serif font-bold uppercase tracking-[0.24em] text-[#721d28] text-[11px]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            ARCHIVE
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#805610] opacity-80">
            EST. KNOWLEDGE SYSTEM
          </span>
        </div>
      </div>
    </div>
  );
};
