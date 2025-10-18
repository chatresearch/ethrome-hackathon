import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  emoji: string;
}

export const Confetti: React.FC<{ trigger: number }> = ({ trigger }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    const emojis = ['🔥', '🎉', '😂', '💀', '⭐', '✨', '🤣', '💯'];
    const newPieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1,
      size: 20 + Math.random() * 40,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));

    setPieces(newPieces);

    const timeout = setTimeout(() => setPieces([]), 3500);
    return () => clearTimeout(timeout);
  }, [trigger]);

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            fontSize: `${piece.size}px`,
          }}
        >
          {piece.emoji}
        </div>
      ))}
    </div>
  );
};
