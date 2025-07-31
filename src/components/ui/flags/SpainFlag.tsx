interface SpainFlagProps {
  className?: string;
}

export function SpainFlag({ className = "w-5 h-5" }: SpainFlagProps) {
  return (
    <div className={`${className} rounded-full overflow-hidden border border-gray-200 shadow-sm`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <clipPath id="spainCircle">
            <circle cx="50" cy="50" r="50"/>
          </clipPath>
        </defs>
        <g clipPath="url(#spainCircle)">
          {/* Red stripe top */}
          <rect x="0" y="0" width="100" height="25" fill="#C60B1E" />
          {/* Yellow stripe middle */}
          <rect x="0" y="25" width="100" height="50" fill="#FFC400" />
          {/* Red stripe bottom */}
          <rect x="0" y="75" width="100" height="25" fill="#C60B1E" />
        </g>
      </svg>
    </div>
  );
}