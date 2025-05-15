import React, { useState, useEffect } from "react";
import useGameController from './GameController';
import "../assets/css/game.css";
import Loading from './Loading';
import DealerCards from './DealerCards';
import PlayerCards from './PlayerCards';
import deckX5 from "../assets/Cards/Deck/5.png";

import chipBlack from "../assets/Chips/Black.png";
import chipGreen from "../assets/Chips/Green.png";
import chipRed from "../assets/Chips/Red.png";
import chipBlue from "../assets/Chips/Blue.png";
import chipYellow from "../assets/Chips/Yellow.png";
import betGif from '../assets/Actions/BetAnimation.gif';
import startGif from '../assets/Actions/StartAnimation.gif';
import standGif from '../assets/Actions/StartAnimation.gif';

const CHIP_COLORS = [
  { src: chipBlack, color: 'Black', id: 'chip-100' },
  { src: chipGreen, color: 'Green', id: 'chip-25' },
  { src: chipRed, color: 'Red', id: 'chip-5' },
  { src: chipBlue, color: 'Blue', id: 'chip-2' },
  { src: chipYellow, color: 'Yellow', id: 'chip-1' }
];

export default function BlackjackGame() {
  const [isLoading, setIsLoading] = useState(true);
  const [bettingChips, setBettingChips] = useState([]);
  const [showStartAnim, setShowStartAnim] = useState(false);
  const [showCards, setShowCards] = useState(false);

  const {
    playerCash,
    betCash,
    handleChipAdd,
    handleChipRemove,
    getChipValue,
    initialCards,
    startRound
  } = useGameController();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  // Verificación de saldo correcta
  const totalBet = bettingChips.reduce((sum, chip) => sum + getChipValue(chip.color), 0);
  const handleChipClick = (chip) => {
    const chipValue = getChipValue(chip.color);
    const isChipBetting = bettingChips.some(c => c.id === chip.id);

    if (isChipBetting) {
      setBettingChips(prev => prev.filter(c => c.id !== chip.id));
      handleChipRemove(chipValue);
    } else {
      if (totalBet + chipValue > playerCash) {
        // No permitir apostar más de lo que hay en saldo
        return;
      }
      setBettingChips(prev => [...prev, chip]);
      handleChipAdd(chipValue);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="game-area select-none min-h-screen">
        {/* Dealer Area */}
        <div className="card-container flex gap-6 ml-28 mt-8 mb-8 relative cursor-pointer" onClick={async () => {
          if (!showCards && bettingChips.length > 0 && !showStartAnim) {
            setShowStartAnim(true);
            setShowCards(false);
            await startRound();
            setTimeout(() => {
              setShowStartAnim(false);
              setShowCards(true);
            }, 1000);
          }
        }}>
          {/* Ejemplo: GIF de STAND encima de la carta del dealer */}
          {showCards && (
            <img
              src={standGif}
              alt="Stand"
              className="fixed top-[40px] left-[921px] w-20 z-[110]"
            />
          )}
          {showStartAnim && (
            <img src={startGif} alt="Start Animation" className="absolute left-1/2 -translate-x-1/2 top-0 z-50 w-24" />
          )}
          {showCards && initialCards.length >= 2 ? (
            <DealerCards cards={initialCards.slice(0, 2)} />
          ) : null}
        </div>

        {/* Player and Betting Area */}
        <div className="relative w-full h-[60vh]">
          {/* Player Cards */}
          <div className="card-container absolute z-[9999] left-[20%] bottom-[30%] flex gap-4">
            {showCards && initialCards.length >= 4 ? (
              <PlayerCards cards={initialCards.slice(2, 4)} />
            ) : null}
          </div>

          {/* Betting Zone */}
          <div className="absolute z-[50] left-[70%] bottom-[-16%] w-57 h-49 transform -translate-x-1/2
                       border-2 border-dashed border-white/30 rounded-lg bg-white/5 p-4 flex items-center justify-center">
            <img 
              src={betGif} 
              alt="Bet Animation" 
              className="w-32 absolute -top-[62px] left-[43px]"
            />
            <div className="flex flex-wrap gap-4 justify-center items-center h-full">
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
            {/* Total apostado debajo de la zona de apuestas */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-yellow-400 text-3xl mt-2" style={{ bottom: '-40px', fontFamily: 'Bitty, monospace' }}>
              {totalBet}₴
            </div>
          </div>

          {/* GIF de acción (START) en posición fija respecto al viewport con Tailwind */}
          {!showCards && bettingChips.length > 0 && !showStartAnim && (
            <img
              src={startGif}
              alt="Start"
              className="fixed top-[60px] left-[1080px] w-20 z-[110] cursor-pointer"
              onClick={async () => {
                setShowStartAnim(true);
                setShowCards(false);
                await startRound();
                setTimeout(() => {
                  setShowStartAnim(false);
                  setShowCards(true);
                }, 1000);
              }}
            />
          )}
          {/* Mazo en posición fija con Tailwind */}
          <img
            src={deckX5}
            alt="deck"
            className="fixed top-[71px] left-[910px] w-[100px] z-[100] pixel-border"
          />
        </div>

        {/* Available Chips */}
        <div className="fixed bottom-2 left-1/3 transform -translate-x-1/2 flex gap-6 z-[100] 
                     bg-indigo-900/80 p-4 rounded-lg border-2 border-white/30">
          {CHIP_COLORS.map(chip => (
            <div
              key={chip.id}
              onClick={() => handleChipClick(chip)}
              className="cursor-pointer group relative"
            >
              <div className="fixed -top-8 left-1/2 transform -translate-x-1/2 opacity-0 
                           group-hover:opacity-100 transition-opacity duration-200 
                           text-white text-sm font-['Press_Start_2P']">
                ${getChipValue(chip.color)}
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

        {/* Money Information */}
        <div className="fixed right-4 top-4 text-white font-['Press_Start_2P'] text-sm">
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
