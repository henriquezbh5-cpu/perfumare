"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create smoke particles
    const particles: HTMLDivElement[] = [];

    function createParticle() {
      if (!container) return;
      const particle = document.createElement("div");
      particle.className = "smoke-particle";

      const x = Math.random() * window.innerWidth;
      const size = Math.random() * 3 + 1;
      const duration = Math.random() * 15 + 10;
      const drift = (Math.random() - 0.5) * 100;

      particle.style.left = `${x}px`;
      particle.style.bottom = `-10px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.setProperty("--drift", `${drift}px`);
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;

      container.appendChild(particle);
      particles.push(particle);

      // Cleanup old particles
      if (particles.length > 30) {
        const old = particles.shift();
        old?.remove();
      }
    }

    // Initial batch
    for (let i = 0; i < 15; i++) {
      createParticle();
    }

    // Add new particles periodically
    const interval = setInterval(createParticle, 2000);

    return () => {
      clearInterval(interval);
      particles.forEach((p) => p.remove());
    };
  }, []);

  return (
    <>
      {/* Gradient orbs */}
      <div className="bg-animated">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      {/* Grid overlay */}
      <div className="bg-grid" />

      {/* Smoke particles container */}
      <div ref={containerRef} className="bg-animated" />
    </>
  );
}
