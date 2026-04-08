/**
 * Arabian-inspired decorative SVG elements.
 * Minimalist geometric patterns — luxury hotel in Dubai, not a mosque.
 */

interface PatternProps {
  className?: string;
  color?: string;
}

/**
 * Ornamental divider with central 8-pointed star motif and extending lines.
 * Replaces the simple .gold-divider.
 */
export function ArabianDivider({
  className = "",
  color = "#c9a962",
}: PatternProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width="280"
        height="24"
        viewBox="0 0 280 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Left line */}
        <line
          x1="0"
          y1="12"
          x2="110"
          y2="12"
          stroke={color}
          strokeWidth="0.5"
          opacity="0.6"
        />
        {/* Left diamond */}
        <polygon
          points="105,12 110,9 115,12 110,15"
          fill={color}
          opacity="0.4"
        />
        {/* Central 8-pointed star */}
        <g transform="translate(140, 12)">
          {/* Outer star */}
          <polygon
            points="0,-8 2.3,-2.3 8,0 2.3,2.3 0,8 -2.3,2.3 -8,0 -2.3,-2.3"
            fill={color}
            opacity="0.7"
          />
          {/* Inner rotated square */}
          <rect
            x="-3.5"
            y="-3.5"
            width="7"
            height="7"
            transform="rotate(45)"
            fill={color}
            opacity="0.3"
          />
          {/* Center dot */}
          <circle r="1.5" fill={color} opacity="0.9" />
        </g>
        {/* Right diamond */}
        <polygon
          points="165,12 170,9 175,12 170,15"
          fill={color}
          opacity="0.4"
        />
        {/* Right line */}
        <line
          x1="170"
          y1="12"
          x2="280"
          y2="12"
          stroke={color}
          strokeWidth="0.5"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}

/**
 * Subtle repeating geometric border — Islamic geometric art inspired.
 * Renders as a thin horizontal band.
 */
export function ArabianBorder({
  className = "",
  color = "#c9a962",
}: PatternProps) {
  return (
    <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg
        width="100%"
        height="6"
        viewBox="0 0 120 6"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="arabian-border"
            x="0"
            y="0"
            width="20"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            {/* Interlocking diamond chain */}
            <polygon
              points="10,0 14,3 10,6 6,3"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              opacity="0.5"
            />
            <polygon
              points="0,0 4,3 0,6"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              opacity="0.3"
            />
            <polygon
              points="20,0 16,3 20,6"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              opacity="0.3"
            />
            <circle cx="10" cy="3" r="0.8" fill={color} opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="6" fill="url(#arabian-border)" />
      </svg>
    </div>
  );
}

/**
 * 8-pointed Islamic star. Can be used as a standalone decorative accent.
 */
export function ArabianStar({
  className = "",
  color = "#c9a962",
  size = 24,
}: PatternProps & { size?: number }) {
  const half = size / 2;
  const outer = half;
  const inner = half * 0.38;

  // Generate 8-pointed star path
  const points: string[] = [];
  for (let i = 0; i < 8; i++) {
    const outerAngle = (Math.PI / 4) * i - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 8;
    points.push(
      `${half + outer * Math.cos(outerAngle)},${half + outer * Math.sin(outerAngle)}`
    );
    points.push(
      `${half + inner * Math.cos(innerAngle)},${half + inner * Math.sin(innerAngle)}`
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <polygon points={points.join(" ")} fill={color} opacity="0.6" />
      <circle cx={half} cy={half} r={half * 0.15} fill={color} opacity="0.9" />
    </svg>
  );
}

/**
 * Decorative arabesque corner — for placing at corners of hero sections.
 * Renders a geometric L-shaped corner ornament.
 */
export function ArabianCorner({
  className = "",
  color = "#c9a962",
  size = 60,
}: PatternProps & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer corner lines */}
      <path
        d="M 0 0 L 0 50 Q 0 55, 5 55 L 10 55"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M 0 0 L 50 0 Q 55 0, 55 5 L 55 10"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.4"
        fill="none"
      />
      {/* Inner corner lines */}
      <path
        d="M 8 8 L 8 40 Q 8 44, 12 44 L 18 44"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.3"
        fill="none"
      />
      <path
        d="M 8 8 L 40 8 Q 44 8, 44 12 L 44 18"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.3"
        fill="none"
      />
      {/* Corner star */}
      <g transform="translate(4, 4)">
        <polygon
          points="0,-4 1.2,-1.2 4,0 1.2,1.2 0,4 -1.2,1.2 -4,0 -1.2,-1.2"
          fill={color}
          opacity="0.5"
        />
      </g>
      {/* Small diamonds along the edges */}
      <polygon
        points="0,20 2,18 4,20 2,22"
        fill={color}
        opacity="0.25"
      />
      <polygon
        points="0,35 2,33 4,35 2,37"
        fill={color}
        opacity="0.2"
      />
      <polygon
        points="20,0 18,2 20,4 22,2"
        fill={color}
        opacity="0.25"
      />
      <polygon
        points="35,0 33,2 35,4 37,2"
        fill={color}
        opacity="0.2"
      />
    </svg>
  );
}
