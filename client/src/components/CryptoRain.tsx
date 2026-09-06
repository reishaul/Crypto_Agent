import React, { useEffect, useState } from 'react';

// This component creates a visual effect of falling Bitcoin symbols (₿) across the screen, simulating a "crypto rain" effect.
//  It generates multiple drops with random properties such as position, size, opacity, and animation duration to create a dynamic and
//  visually appealing background effect.

// Define the structure of a single drop in the crypto rain effect
interface Drop{
  id: number;
  left: number;
  duration: number;
  size: number;
  opacity: number;
  delay: number;
}

// The CryptoRain component generates and renders multiple falling Bitcoin symbols across the screen.
export default function CryptoRain() {
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    // Generate an array of drops with random properties for the crypto rain effect
    const generatedDrops: Drop[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // placement across the width of the screen
      duration: Math.random() * 5 + 5, // 
      size: Math.random() * 16 + 14, //size
      opacity: Math.random() * 0.3 + 0.1, //transparency (בין 0.1 ל-0.4)
      delay: Math.random() * 5, // randomdelay 
    }));
    setDrops(generatedDrops);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none', // validates that the rain effect does not interfere with user interactions on the page
      overflow: 'hidden',
      zIndex: 0 // places the rain effect behind other content on the page
    }}>
      {drops.map(drop => (
        <div
          key={drop.id}
          style={{
            position: 'absolute',
            top: '-50px',
            left: `${drop.left}%`,
            fontSize: `${drop.size}px`,
            opacity: drop.opacity,
            color: '#f7931a', //Bitcoin color
            animation: `fall ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`,
            userSelect: 'none'
          }}
        >
          ₿
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-50px) rotate(0deg);
          }
          100% {
            transform: translateY(105vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}