interface ItalyFlagProps {
  className?: string;
}

export const ItalyFlag = ({ className = "w-5 h-5" }: ItalyFlagProps) => {
  return (
    <div className={`${className} rounded-full overflow-hidden border border-gray-200 shadow-sm`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <clipPath id="italyCircle">
            <circle cx="50" cy="50" r="50"/>
          </clipPath>
        </defs>
        <g clipPath="url(#italyCircle)">
          {/* Green stripe */}
          <rect x="0" y="0" width="33.33" height="100" fill="#009246" />
          {/* White stripe */}
          <rect x="33.33" y="0" width="33.34" height="100" fill="#ffffff" />
          {/* Red stripe */}
          <rect x="66.67" y="0" width="33.33" height="100" fill="#ce2b37" />
        </g>
      </svg>
    </div>
  );
};