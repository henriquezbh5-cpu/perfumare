"use client";

import { useEffect, useRef, useState } from "react";

interface TransparentImageProps {
  src: string;
  alt: string;
  className?: string;
  threshold?: number;
}

export function TransparentImage({
  src,
  alt,
  className = "",
  threshold = 230,
}: TransparentImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    setReady(false);
    setFailed(false);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          if (r > threshold && g > threshold && b > threshold) {
            const brightness = (r + g + b) / 3;
            if (brightness > 248) {
              data[i + 3] = 0;
            } else {
              const alpha = Math.round(((255 - brightness) / (255 - threshold)) * 255);
              data[i + 3] = Math.min(data[i + 3], Math.max(0, alpha));
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setReady(true);
      } catch {
        setFailed(true);
      }
    };

    img.onerror = () => setFailed(true);

    // Use proxy to bypass CORS
    img.src = `/api/proxy-image?url=${encodeURIComponent(src)}`;
  }, [src, threshold]);

  if (failed) {
    // Fallback with CSS blend
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={className}
        style={{
          mixBlendMode: "multiply",
          filter: "brightness(1.3) contrast(1.05) saturate(1.2)",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      role="img"
      className={`${className} transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
      style={{
        filter: "drop-shadow(0 15px 35px rgba(0,0,0,0.5))",
      }}
    />
  );
}
