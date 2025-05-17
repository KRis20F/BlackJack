import React from 'react';
import Card from '../assets/Cards/Card';

export default function DealerCards({ cards, gamePhase }) {
  if (!cards || cards.length < 2) return null;
  
  const calculateHandValue = (cards) => {
    let value = 0;
    let aces = 0;
    
    cards.forEach(card => {
      const cardValue = typeof card.value === 'string' ? card.value.slice(0, -1) : card.value;
      if (cardValue === 'A') {
        aces += 1;
        value += 11;
      } else if (['K', 'Q', 'J'].includes(cardValue)) {
        value += 10;
      } else {
        value += parseInt(cardValue);
      }
    });
    
    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }
    
    return value;
  };

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
      {gamePhase === 'ended' && (
        <div className="text-white text-xl mt-2 font-['Press_Start_2P']">
          {calculateHandValue(cards)}
        </div>
      )}
    </div>
  );
} 