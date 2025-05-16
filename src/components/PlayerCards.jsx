import React from 'react';
import Card from '../assets/Cards/Card';

export default function PlayerCards({ cards }) {
  if (!cards || cards.length < 2) return null;
  
  return (
    <div className="flex gap-4">
      <Card value={cards[0]} />
      <Card value={cards[1]} />
    </div>
  );
} 