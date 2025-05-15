import React, { useState, useEffect } from "react";
import useGameController from './GameController';
import "../assets/css/game.css";
import Loading from './Loading';
import Card from '../assets/Cards/Card';

import deckX5 from "../assets/Cards/Deck/5.png";
import chipBlack from "../assets/Chips/Black.png";
import chipGreen from "../assets/Chips/Green.png";
import chipRed from "../assets/Chips/Red.png";
import chipBlue from "../assets/Chips/Blue.png";
import chipYellow from "../assets/Chips/Yellow.png";

const CHIP_COLORS = [
  { src: chipBlack, color: 'Black', value: 100, id: 'chip-100' },
  { src: chipGreen, color: 'Green', value: 25, id: 'chip-25' },
  { src: chipRed, color: 'Red', value: 5, id: 'chip-5' },
  { src: chipBlue, color: 'Blue', value: 2, id: 'chip-2' },
  { src: chipYellow, color: 'Yellow', value: 1, id: 'chip-1' }
];

export default function BlackjackGame() {
  const [isLoading, setIsLoading] = useState(true);
  const [bettingChips, setBettingChips] = useState([]);

  const {
    playerCash,
    betCash,
    handleChipAdd,
    handleChipRemove
  } = useGameController();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const handleChipClick = (chip) => {
    const isChipBetting = bettingChips.some(c => c.id === chip.id);
    
    if (isChipBetting) {
      // Si la ficha ya está en apuestas, la quitamos
      setBettingChips(prev => prev.filter(c => c.id !== chip.id));
      handleChipRemove(chip.value);
    } else {
      // Si la ficha no está en apuestas, la agregamos
      setBettingChips(prev => [...prev, chip]);
      handleChipAdd(chip.value);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="game-area select-none min-h-screen">
        {/* Dealer Area */}
        <div className="card-container flex gap-6 ml-28 mt-8 mb-8">
          <Card isHidden={true} />
          <Card suit="D" value="7" />
          <Card suit="D" value="7" />
          <Card suit="D" value="7" />
        </div>

        {/* Player and Betting Area */}
        <div className="relative w-full h-[60vh]">
          {/* Player Cards */}
          <div className="card-container absolute z-[9999] left-[20%] bottom-[30%] flex gap-4">
            <Card suit="D" value="7" />
            <Card suit="D" value="7" />
          </div>

          {/* Betting Zone - Moved to right side */}
          <div className="fixed right-0 top-0 h-full w-[200px] bg-indigo-900/80 border-l-4 border-white 
                       flex flex-col items-center py-8 z-[50]">
            <div className="font-['Press_Start_2P'] text-white text-xl mb-8">
              Apuestas
            </div>
            <div className="flex flex-col gap-4 items-center">
              {bettingChips.map(chip => (
                <div
                  key={chip.id}
                  onClick={() => handleChipClick(chip)}
                  className="cursor-pointer transform hover:scale-110 transition-all duration-200"
                >
                  <img
                    src={chip.src}
                    alt={`${chip.color} chip`}
                    className="w-[60px] h-[60px] pixel-border hover:brightness-110"
                    draggable="false"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Deck */}
          <div className="absolute right-[484px] top-[-20%]">
            <img src={deckX5} alt="deck" className="pixel-border" />
          </div>
        </div>

        {/* Available Chips - Moved lower */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-6 z-[100] 
                     bg-indigo-900/80 p-4 rounded-lg border-2 border-white/30 mr-[200px]">
          {CHIP_COLORS.map(chip => (
            <div
              key={chip.id}
              onClick={() => handleChipClick(chip)}
              className="cursor-pointer group relative"
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 
                           group-hover:opacity-100 transition-opacity duration-200 
                           text-white text-sm font-['Press_Start_2P']">
                ${chip.value}
              </div>
              <img
                src={chip.src}
                alt={`${chip.color} chip`}
                className={`w-[60px] h-[60px] pixel-border
                          transition-all duration-200 ease-in-out
                          group-hover:scale-110 group-hover:brightness-110
                          hover:shadow-lg hover:shadow-indigo-500/50
                          ${bettingChips.some(c => c.id === chip.id) ? 'opacity-50' : ''}`}
                draggable="false"
              />
            </div>
          ))}
        </div>

        {/* Money Information - Adjusted position */}
        <div className="fixed right-[220px] top-4 text-white font-['Press_Start_2P'] text-sm">
          Cash: ${playerCash}
          {betCash > 0 && (
            <div className="mt-2">
              Bet: ${betCash}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
