interface USFlagProps {
  className?: string;
}

export const USFlag = ({ className = "w-5 h-5" }: USFlagProps) => {
  return (
    <div className={`${className} rounded-full overflow-hidden border border-gray-200 shadow-sm`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <clipPath id="usCircle">
            <circle cx="50" cy="50" r="50"/>
          </clipPath>
        </defs>
        <g clipPath="url(#usCircle)">
          {/* Red background */}
          <rect width="100" height="100" fill="#B22234" />
          
          {/* White stripes */}
          <rect y="7.7" width="100" height="7.7" fill="#FFFFFF" />
          <rect y="23.1" width="100" height="7.7" fill="#FFFFFF" />
          <rect y="38.5" width="100" height="7.7" fill="#FFFFFF" />
          <rect y="53.9" width="100" height="7.7" fill="#FFFFFF" />
          <rect y="69.3" width="100" height="7.7" fill="#FFFFFF" />
          <rect y="84.7" width="100" height="7.7" fill="#FFFFFF" />
          
          {/* Blue field */}
          <rect width="40" height="53.9" fill="#3C3B6E" />
          
          {/* Simplified stars representation */}
          <g fill="#FFFFFF">
            <circle cx="6" cy="8" r="1.5" />
            <circle cx="14" cy="8" r="1.5" />
            <circle cx="22" cy="8" r="1.5" />
            <circle cx="30" cy="8" r="1.5" />
            <circle cx="38" cy="8" r="1.5" />
            
            <circle cx="10" cy="16" r="1.5" />
            <circle cx="18" cy="16" r="1.5" />
            <circle cx="26" cy="16" r="1.5" />
            <circle cx="34" cy="16" r="1.5" />
            
            <circle cx="6" cy="24" r="1.5" />
            <circle cx="14" cy="24" r="1.5" />
            <circle cx="22" cy="24" r="1.5" />
            <circle cx="30" cy="24" r="1.5" />
            <circle cx="38" cy="24" r="1.5" />
            
            <circle cx="10" cy="32" r="1.5" />
            <circle cx="18" cy="32" r="1.5" />
            <circle cx="26" cy="32" r="1.5" />
            <circle cx="34" cy="32" r="1.5" />
            
            <circle cx="6" cy="40" r="1.5" />
            <circle cx="14" cy="40" r="1.5" />
            <circle cx="22" cy="40" r="1.5" />
            <circle cx="30" cy="40" r="1.5" />
            <circle cx="38" cy="40" r="1.5" />
            
            <circle cx="10" cy="48" r="1.5" />
            <circle cx="18" cy="48" r="1.5" />
            <circle cx="26" cy="48" r="1.5" />
            <circle cx="34" cy="48" r="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
};