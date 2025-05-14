import React from 'react';
import cardBack from "./Back.png";

export default function Card({ suit, value, isHidden = false }) {
    const getCardImage = () => {
        if (isHidden) return cardBack;
        if (!suit || !value) return cardBack;
        
        try {
            return new URL(`./${suit}/${value}.png`, import.meta.url).href;
        } catch {
            return cardBack;
        }
    };

    return (
        <img 
            src={getCardImage()} 
            alt={isHidden ? "Hidden Card" : `${value} of ${suit}`}
            className="w-[108px] h-[138px] pixel-border"
        />
    );
} 