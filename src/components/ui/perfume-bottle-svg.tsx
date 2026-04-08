interface PerfumeBottleSvgProps {
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { width: 48, height: 64 },
  md: { width: 80, height: 108 },
  lg: { width: 120, height: 160 },
};

export function PerfumeBottleSvg({
  color = "#c9a962",
  size = "md",
  className,
}: PerfumeBottleSvgProps) {
  const { width, height } = sizeMap[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cap */}
      <rect
        x="30"
        y="2"
        width="20"
        height="10"
        rx="3"
        fill={color}
        opacity={0.9}
      />
      {/* Neck */}
      <rect
        x="34"
        y="12"
        width="12"
        height="10"
        rx="1"
        fill={color}
        opacity={0.5}
      />
      {/* Shoulder flare */}
      <path
        d="M34 22 C34 22 20 28 18 38 L62 38 C60 28 46 22 46 22 Z"
        fill={color}
        opacity={0.25}
      />
      {/* Body */}
      <rect
        x="14"
        y="36"
        width="52"
        height="58"
        rx="6"
        fill={color}
        opacity={0.18}
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity={0.4}
      />
      {/* Inner liquid fill */}
      <rect
        x="18"
        y="48"
        width="44"
        height="42"
        rx="4"
        fill={color}
        opacity={0.12}
      />
      {/* Shine highlight */}
      <rect
        x="22"
        y="42"
        width="4"
        height="30"
        rx="2"
        fill="white"
        opacity={0.3}
      />
      {/* Base */}
      <rect
        x="12"
        y="94"
        width="56"
        height="8"
        rx="3"
        fill={color}
        opacity={0.35}
      />
      {/* Label area */}
      <rect
        x="24"
        y="56"
        width="32"
        height="18"
        rx="2"
        fill="white"
        opacity={0.15}
        stroke={color}
        strokeWidth="0.5"
        strokeOpacity={0.3}
      />
      {/* Spray nozzle detail */}
      <circle cx="40" cy="6" r="1.5" fill="white" opacity={0.4} />
    </svg>
  );
}
