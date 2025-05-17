import React from 'react';
import Card from '../assets/Cards/Card';

const calculateHandValues = (cards) => {
  let value = 0;
  let aces = 0;
  
  console.log('Calculating value for cards:', cards);
  
  // Primero sumamos todas las cartas que no son Ases
  cards.forEach(card => {
    console.log('Raw card:', card);
    
    const cardValue = typeof card === 'string' 
      ? card.slice(0, -1) 
      : (typeof card.value === 'string' 
        ? card.value.slice(0, -1) 
        : card.value);
    
    console.log('Extracted card value:', cardValue);
    
    if (cardValue === 'A') {
      aces += 1;
    } else if (['K', 'Q', 'J', '0', '10'].includes(cardValue)) {
      value += 10;
      console.log('Face card or 10 found, current value:', value);
    } else {
      const numValue = parseInt(cardValue);
      if (!isNaN(numValue)) {
        value += numValue;
        console.log(`Number ${numValue} found, current value:`, value);
      }
    }
  });

  // Si no hay Ases, retornamos el valor directamente
  if (aces === 0) {
    console.log('No aces, final value:', value);
    return { value, altValue: null };
  }

  // Si hay Ases, siempre calculamos ambos valores posibles
  let highValue = value;
  let lowValue = value;

  // Calculamos ambos valores (con As como 11 y como 1)
  for (let i = 0; i < aces; i++) {
    // Valor alto: intentar usar 11 si es posible
    if (highValue + 11 <= 21) {
      highValue += 11;
      console.log(`Added Ace as 11, high value: ${highValue}`);
    } else {
      highValue += 1;
      console.log(`Added Ace as 1 (high), high value: ${highValue}`);
    }
    // Valor bajo: siempre usar 1
    lowValue += 1;
    console.log(`Added Ace as 1 (low), low value: ${lowValue}`);
  }

  // Si el valor alto es válido (≤21), lo usamos como valor principal
  if (highValue <= 21) {
    console.log(`Final values: ${highValue}/${lowValue}`);
    return { value: highValue, altValue: lowValue };
  }

  // Si el valor alto se pasa, usamos el valor bajo como principal
  console.log(`Final values: ${lowValue}/${highValue}`);
  return { value: lowValue, altValue: highValue };
};

export default function PlayerCards({ cards }) {
  if (!cards || cards.length < 2) return null;
  
  const { value, altValue } = calculateHandValues(cards);
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-4">
        {cards.map((card, index) => (
          <Card key={index} value={card} />
        ))}
      </div>
      <div className="text-white text-xl mt-2 font-['Press_Start_2P']">
        {altValue !== null ? `${value}/${altValue}` : value}
      </div>
    </div>
  );
} 