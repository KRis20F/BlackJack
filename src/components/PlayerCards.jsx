import React from 'react';
import Card from '../assets/Cards/Card';

const calculateHandValue = (cards) => {
  let value = 0;
  let aces = 0;
  
  console.log('Calculating value for cards:', cards);
  
  cards.forEach(card => {
    // Asegurarnos de que tenemos el objeto carta completo
    console.log('Raw card:', card);
    
    // Si la carta es un string (ej: "10H"), extraer el valor
    const cardValue = typeof card === 'string' 
      ? card.slice(0, -1) 
      : (typeof card.value === 'string' 
        ? card.value.slice(0, -1) 
        : card.value);
    
    console.log('Extracted card value:', cardValue);
    
    if (cardValue === 'A') {
      aces += 1;
      value += 11;
      console.log('Ace found, current value:', value);
    } else if (['K', 'Q', 'J', '0'].includes(cardValue)) {
      value += 10;
      console.log('Face card found, current value:', value);
    } else {
      const numValue = parseInt(cardValue);
      if (!isNaN(numValue)) {
        value += numValue;
        console.log(`Number ${numValue} found, current value:`, value);
      } else {
        console.log('WARNING: Could not parse card value:', cardValue);
      }
    }
  });
  
  // Adjust for aces
  while (value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
    console.log('Adjusted for ace, new value:', value);
  }
  
  console.log('Final hand value:', value);
  return value;
};

export default function PlayerCards({ cards }) {
  if (!cards || cards.length < 2) return null;
  
  const handValue = calculateHandValue(cards);
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-4">
        {cards.map((card, index) => (
          <Card key={index} value={card} />
        ))}
      </div>
      <div className="text-white text-xl mt-2 font-['Press_Start_2P']">
        {handValue}
      </div>
    </div>
  );
} 