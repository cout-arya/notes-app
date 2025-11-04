import { useRef, useState, useMemo } from "react";
import React from "react";

const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  // Extract glow color from gradient class
  const spotlightColor = useMemo(() => {
    const match = className.match(/from-(\w+)-(\d+)/); // e.g., "from-pink-500"
    if (!match) return "rgba(255,255,255,0.35)";
    const colorName = match[1];
    const colorValue = match[2];

    // Tailwind to rgba mapping (basic)
    const tailwindColors = {
      pink: "255,100,150",
      yellow: "255,220,100",
      blue: "100,180,255",
      green: "80,255,120",
      purple: "200,140,255",
      orange: "255,170,90",
    };

    const rgb = tailwindColors[colorName] || "255,255,255";
    return `rgba(${rgb}, 0.45)`;
  }, [className]);

  const handleMouseMove = (e) => {
    const rect = divRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / rect.height) * -10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 10;

    setPosition({ x, y });
    setTilt({ rotateX, rotateY });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => {
    setOpacity(0);
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ease-out ${className}`}
      style={{
        transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transformStyle: "preserve-3d",
        transition: "transform 0.15s ease-out",
        perspective: "1000px",
      }}
    >
      {/* Animated border glow */}
      <div
        className="absolute inset-0 rounded-2xl border-[2px] transition-all duration-300"
        style={{
          borderColor: spotlightColor,
          boxShadow: `0 0 25px ${spotlightColor}`,
          opacity,
          pointerEvents: "none",
        }}
      />

      {/* Moving spotlight glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(
            450px circle at ${position.x}px ${position.y}px,
            ${spotlightColor},
            transparent 70%
          )`,
          mixBlendMode: "screen",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SpotlightCard;
