interface GermanyFlagProps {
  className?: string;
}

export function GermanyFlag({ className = "w-5 h-5" }: GermanyFlagProps) {
  return (
    <div className={`${className} rounded-full overflow-hidden border border-gray-200 shadow-sm`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <clipPath id="germanyCircle">
            <circle cx="50" cy="50" r="50"/>
          </clipPath>
        </defs>
        <g clipPath="url(#germanyCircle)">
          {/* Black stripe */}
          <rect x="0" y="0" width="100" height="33.33" fill="#000000" />
          {/* Red stripe */}
          <rect x="0" y="33.33" width="100" height="33.34" fill="#DD0000" />
          {/* Gold stripe */}
          <rect x="0" y="66.67" width="100" height="33.33" fill="#FFCE00" />
        </g>
      </svg>
    </div>
  );
}