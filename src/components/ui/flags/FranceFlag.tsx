interface FranceFlagProps {
  className?: string;
}

export function FranceFlag({ className = "w-5 h-5" }: FranceFlagProps) {
  return (
    <div className={`${className} rounded-full overflow-hidden border border-gray-200 shadow-sm`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <clipPath id="franceCircle">
            <circle cx="50" cy="50" r="50"/>
          </clipPath>
        </defs>
        <g clipPath="url(#franceCircle)">
          {/* Blue stripe */}
          <rect x="0" y="0" width="33.33" height="100" fill="#002395" />
          {/* White stripe */}
          <rect x="33.33" y="0" width="33.34" height="100" fill="#ffffff" />
          {/* Red stripe */}
          <rect x="66.67" y="0" width="33.33" height="100" fill="#ED2939" />
        </g>
      </svg>
    </div>
  );
}