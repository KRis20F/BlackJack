import React from 'react';
import Card from '../assets/Cards/Card';

export default function DealerCards({ cards, gamePhase }) {
  if (!cards || cards.length < 2) return null;
  
  const calculateHandValue = (cardsToCalculate) => {
    let value = 0;
    let aces = 0;
    
    console.log('Calculating dealer hand:', cardsToCalculate);
    
    cardsToCalculate.forEach(card => {
      const cardValue = typeof card === 'string' 
        ? card.slice(0, -1) 
        : (typeof card.value === 'string' 
          ? card.value.slice(0, -1) 
          : card.value);
      
      console.log('Dealer card value:', cardValue);
      
      if (cardValue === 'A') {
        aces += 1;
      } else if (['K', 'Q', 'J', '0', '10'].includes(cardValue)) {
        value += 10;
      } else {
        const numValue = parseInt(cardValue);
        if (!isNaN(numValue)) {
          value += numValue;
        }
      }
    });
    
    // Añadir los Ases
    for (let i = 0; i < aces; i++) {
      if (value + 11 <= 21) {
        value += 11;
      } else {
        value += 1;
      }
    }
    
    return value;
  };

  // Durante el juego, solo calculamos el valor de la primera carta
  // Al final del juego, calculamos el valor de todas las cartas
  const visibleCards = gamePhase === 'playing' ? [cards[0]] : cards;
  const dealerValue = calculateHandValue(visibleCards);
  const shouldShowValue = gamePhase === 'playing' || gamePhase === 'ended';

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-4">
        {cards.map((card, index) => (
          <Card 
            key={index} 
            value={card} 
            isHidden={index === 1 && gamePhase === 'playing'}
          />
        ))}
      </div>
      {shouldShowValue && (
        <div className="text-white text-xl mt-2 font-['Press_Start_2P']">
          {dealerValue}
        </div>
      )}
    </div>
  );
} 