import React from 'react';
import Card from '../assets/Cards/Card';

export default function DealerCards({ cards }) {
  if (!cards || cards.length < 2) return null;
  return (
    <>
      <Card isHidden={true} />
      <Card suit={cards[0].suit} value={cards[0].value} />
      <Card suit={cards[1].suit} value={cards[1].value} />
    </>
  );
} 