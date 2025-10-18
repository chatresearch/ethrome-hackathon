import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
export const Confetti = ({ trigger }) => {
    const [pieces, setPieces] = useState([]);
    useEffect(() => {
        if (trigger === 0)
            return;
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
    return (_jsx("div", { className: "confetti-container", children: pieces.map((piece) => (_jsx("div", { className: "confetti-piece", style: {
                left: `${piece.left}%`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                fontSize: `${piece.size}px`,
            }, children: piece.emoji }, piece.id))) }));
};
//# sourceMappingURL=Confetti.js.map