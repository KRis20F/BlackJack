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
            
            try {
                // Importar la imagen dinámicamente
                return new URL(`./${suit}/${cardValue}.png`, import.meta.url).href;
            } catch (error) {
                console.error('Error loading card image:', error);
                return cardBack;
            }
        } catch (error) {
            console.error('Error processing card value:', error);
            return cardBack;
        }
    };

    const cardSrc = getCardImage();
    // console.log('Loading card:', value, 'from path:', cardSrc); // Debug log

    return (
        <img 
            src={cardSrc}
            alt={isHidden ? "Hidden Card" : `${typeof value === 'string' ? value : value.value}`}
            className="w-[93px] h-[114px] pixel-border"
            onError={(e) => {
                console.error('Error loading image for card:', value);
                e.target.src = cardBack;
            }}
        />
    );
} 