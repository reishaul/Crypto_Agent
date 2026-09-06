import React, { useEffect, useState } from 'react';

interface Drop {
  id: number;
  left: number;
  duration: number;
  size: number;
  opacity: number;
  delay: number;
}

export default function CryptoRain() {
  const [drops, setDrops] = useState<Drop[]>([]);

  useEffect(() => {
    // יצירת 25 מטבעות שנופלים במרווחים שונים
    const generatedDrops: Drop[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // מיקום אופקי באחוזים
      duration: Math.random() * 5 + 5, // מהירות נפילה (בין 5 ל-10 שניות)
      size: Math.random() * 16 + 14, // גודל האייקון (בין 14px ל-30px)
      opacity: Math.random() * 0.3 + 0.1, // שקיפות עדינה כדי שלא יפריע לקריאה
      delay: Math.random() * 5, // השהייה אקראית בתחילת הנפילה
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
      pointerEvents: 'none', // מוודא שהלחיצות עוברות דרך המטבעות אל האלמנטים שמתחת
      overflow: 'hidden',
      zIndex: 0 // ממוקם מתחת לתוכן של הדאשבורד
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
            color: '#f7931a', // הצבע האופייני של ביטקוין
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