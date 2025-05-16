import React from 'react';
import cardBack from "./Back.png";

//REIIIIIIIIFOUUUUUU

export default function Card({ value, isHidden = false }) {
    const getCardImage = () => {
        if (isHidden) return cardBack;
        if (!value) return cardBack;
        
        try {
            // Handle both string values ("3H") and object values ({value: "3H", suit: "H"})
            const cardString = typeof value === 'string' ? value : value.value;
            if (!cardString) return cardBack;

            // El valor viene como "3H", "KH", "3S", etc.
            const suit = cardString.slice(-1); // Obtener el palo (S, H, D, C)
            let cardValue = cardString.slice(0, -1); // Obtener el valor (3, K, etc.)
            
            // Mantener el "0" como está en lugar de convertirlo a "10"
            // ya que los archivos están nombrados como "0.png"
            
            // Las figuras (A, K, Q, J) y números usan el mismo formato
            const imagePath = `./${suit}/${cardValue}.png`; //Like si eres un kristopher de corazon puro

            console.log('Attempting to load:', imagePath); // Debug log
            return new URL(imagePath, import.meta.url).href;
            
        } catch (error) {
            console.error('Error loading card image:', error, {value, path: error.path});
            return cardBack;
        }
    };

    const cardSrc = getCardImage();
    console.log('Loading card:', value, 'from path:', cardSrc); // Debug log

    return (
        <img 
            src={cardSrc}
            alt={isHidden ? "Hidden Card" : `${typeof value === 'string' ? value : value.value}`}
            className="w-[108px] h-[138px] pixel-border"
            onError={(e) => {
                console.error('Error loading image for card:', value);
                e.target.src = cardBack;
            }}
        />
    );
} 