import React, { useState, useEffect, useCallback } from "react";
import useGameController from './GameController';
import { useGame } from '../context/GameContext';
import "../assets/css/game.css";
import Loading from './Loading';
import DealerCards from './DealerCards';
import PlayerCards from './PlayerCards';
import deckX5 from "../assets/Cards/Deck/5.png";
import deck2 from "../assets/Cards/Deck/2.png";

// Importar las fichas normales y con borde
import chipBlack from "../assets/Chips/Black.png";
import chipGreen from "../assets/Chips/Green.png";
import chipRed from "../assets/Chips/Red.png";
import chipBlue from "../assets/Chips/Blue.png";
import chipYellow from "../assets/Chips/Yellow.png";
import chipBlackB from "../assets/Chips/BlackB.png";
import chipGreenB from "../assets/Chips/GreenB.png";
import chipRedB from "../assets/Chips/RedB.png";
import chipBlueB from "../assets/Chips/BlueB.png";
import chipYellowB from "../assets/Chips/YellowB.png";

import betGif from '../assets/Actions/BetAnimation.gif';
import startGif from '../assets/Actions/StartAnimation.gif';
import standGif from '../assets/Actions/StandAnimation.gif';
import hitGif from '../assets/Actions/HitAnimation.gif';
import dropGif from '../assets/Actions/DropAnimation.gif';
import doubleGif from '../assets/Actions/DoubleAnimation.gif';
import splitGif from '../assets/Actions/SplitAnimation.gif';

const CHIP_COLORS = [
  { src: chipBlack, srcB: chipBlackB, color: 'Black', id: 'chip-50', value: 50 },
  { src: chipGreen, srcB: chipGreenB, color: 'Green', id: 'chip-20', value: 20 },
  { src: chipRed, srcB: chipRedB, color: 'Red', id: 'chip-5', value: 5 },
  { src: chipBlue, srcB: chipBlueB, color: 'Blue', id: 'chip-1', value: 1 },
  { src: chipYellow, srcB: chipYellowB, color: 'Yellow', id: 'chip-100', value: 100 }
];

export default function BlackjackGame() {
  const [isLoading, setIsLoading] = useState(true);
  const [bettingChips, setBettingChips] = useState([]);
  const [showStartAnim, setShowStartAnim] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [hasDoubled, setHasDoubled] = useState(false);
  const [playerCards, setPlayerCards] = useState([]);
  const [showDiscardPile, setShowDiscardPile] = useState(false);
  const [discardRotation, setDiscardRotation] = useState(0);
  const [recoveryAmount, setRecoveryAmount] = useState(0);
  const { setPlayAgainHandler } = useGame();
  const [dropDeckFrame, setDropDeckFrame] = useState(1);

  const {
    playerCash,
    betCash,
    handleChipAdd,
    handleChipRemove,
    initialCards,
    startRound,
    handleHit: controllerHit,
    handleStand: controllerStand,
    handleDrop: controllerDrop,
    handleDouble: controllerDouble,
    handleSplit: controllerSplit,
    canSplit,
    hasSplit,
    splitHands,
    currentSplitHand,
    gamePhase: controllerGamePhase,
    gameEndReason: controllerGameEndReason,
    dealerHand,
    resetGame
  } = useGameController();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId && window.location.pathname !== '/login') {
      window.location.href = '/login';
      return;
    }
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const handlePlayAgain = useCallback(async () => {
    console.log('[PlayAgain] Handler called');
    const userId = localStorage.getItem('userId');
    let recargado = false;
    if (userId) {
      try {
        // 1. Consultar el usuario
        const res = await fetch(`https://alvarfs-001-site1.qtempurl.com/User/${userId}`);
        if (res.ok) {
          const user = await res.json();
          console.log('[PlayAgain] User data:', user);
          if (user.cash <= 0) {
            // 2. Si no tiene cash, recargarle 50
            const putRes = await fetch(`https://alvarfs-001-site1.qtempurl.com/User/${userId}/50`, { method: 'PUT' });
            if (putRes.ok) {
              console.log('[PlayAgain] Saldo recargado a 50$');
              recargado = true;
            } else {
              alert('Error al recargar saldo');
              console.error('[PlayAgain] Error al recargar saldo');
            }
          }
        } else {
          alert('Error al consultar usuario');
          console.error('[PlayAgain] Error al consultar usuario');
        }
      } catch (err) {
        alert('Error al consultar/recargar saldo');
        console.error('[PlayAgain] Error al consultar/recargar saldo:', err);
      }
    }
    // Si se recargó, vuelve a consultar el saldo y actualiza el estado
    if (recargado && userId) {
      try {
        const res = await fetch(`https://alvarfs-001-site1.qtempurl.com/User/${userId}`);
        if (res.ok) {
          const user = await res.json();
          if (typeof user.cash === 'number') {
            // Actualiza el estado del cash en el GameController
            if (typeof window.setPlayerCash === 'function') {
              window.setPlayerCash(user.cash);
            }
            // Si no, fuerza recarga localStorage (si usas localStorage en GameController)
            localStorage.setItem('playerCash', user.cash);
          }
        }
      } catch (err) {
        console.error('[PlayAgain] Error al actualizar cash después de recarga:', err);
      }
    }
    resetGame();
    setBettingChips([]);
    setShowCards(false);
    setShowStartAnim(false);
    setHasDoubled(false);
    setPlayerCards([]);
    setShowDiscardPile(false);
    setRecoveryAmount(0);
  }, [resetGame]);

  useEffect(() => {
    setPlayAgainHandler(() => handlePlayAgain);
    return () => setPlayAgainHandler(null);
  }, [handlePlayAgain, setPlayAgainHandler]);

  useEffect(() => {
    let frameInterval;
    if (controllerGamePhase === 'playing') {
      frameInterval = setInterval(() => {
        setDropDeckFrame(current => {
          if (current >= 5) return 1;
          return current + 1;
        });
      }, 200); // Cambiar frame cada 200ms
    }
    return () => clearInterval(frameInterval);
  }, [controllerGamePhase]);

  // Si el usuario no está logueado, no renderizamos nada
  if (!localStorage.getItem('userId')) {
    return null;
  }

  const canDouble = showCards && 
                   playerCash >= betCash && 
                   controllerGamePhase === 'playing' && 
                   !hasDoubled &&
                   initialCards.length >= 2 &&
                   playerCards.length === 0;

  const handleChipClick = (chip) => {
    // No permitir modificar fichas si ya empezó el juego
    if (controllerGamePhase !== 'betting') {
      console.log('Cannot modify bets after game has started');
      return;
    }

    const chipValue = chip.value; // Usar el valor directamente del objeto chip
    
    // Buscar las fichas del mismo color
    const sameColorChips = bettingChips.filter(c => c.color === chip.color);
    
    if (sameColorChips.length > 0 && chip.stackPosition === undefined) {
      // Si hacemos clic en una ficha disponible y ya hay fichas de ese color,
      // verificamos si podemos agregar más
      if (sameColorChips.length >= 5) {
        console.log('Cannot add more chips of this color: maximum stack reached');
        return;
      }

      // Intentar agregar la ficha
      const success = handleChipAdd(chipValue);
      
      if (success) {
        const uniqueChipId = `${chip.id}-${Date.now()}-${Math.random()}`;
        const newChip = { 
          ...chip, 
          id: uniqueChipId,
          stackPosition: sameColorChips.length,
          color: chip.color,
          value: chipValue
        };
        setBettingChips(prev => [...prev, newChip]);
      }
    } else if (chip.stackPosition !== undefined) {
      // Si hacemos clic en una ficha en la zona de apuestas, la quitamos
      handleChipRemove(chipValue);
      setBettingChips(prev => prev.filter(c => c.id !== chip.id));
    } else {
      // Primera ficha de este color
      const success = handleChipAdd(chipValue);
      
      if (success) {
        const uniqueChipId = `${chip.id}-${Date.now()}-${Math.random()}`;
        const newChip = { 
          ...chip, 
          id: uniqueChipId,
          stackPosition: 0,
          color: chip.color,
          value: chipValue
        };
        setBettingChips(prev => [...prev, newChip]);
      }
    }
  };

  const handleHit = async () => {
    console.log('Hit attempted:', { controllerGamePhase, hasDoubled });
    if (controllerGamePhase !== 'playing' || hasDoubled) {
      console.log('Cannot hit - game phase or doubled state prevents it');
      return;
    }
    
    const newCard = await controllerHit();
    console.log('New card received:', newCard);
    
    if (newCard) {
      setPlayerCards(prev => [...prev, newCard]);
    }
  };
  
  const handleStand = async () => {
    console.log('Stand attempted:', { controllerGamePhase });
    if (controllerGamePhase !== 'playing') return;
    await controllerStand();
    console.log('Stand successful');
  };
  
  const handleDrop = async () => {
    console.log('Drop attempted:', { controllerGamePhase });
    if (controllerGamePhase !== 'playing') return;
    
    // Mostrar el pilote de descartes con una rotación aleatoria
    setDiscardRotation(Math.random() * 30 - 15); // Rotación entre -15 y 15 grados
    setShowDiscardPile(true);
    
    const recovery = await controllerDrop();
    if (recovery) {
      setRecoveryAmount(recovery);
    }
    console.log('Drop successful, recovered:', recovery);
  };
  
  const handleDouble = async () => {
    console.log('Double attempted:', { canDouble, playerCash, betCash, initialCards });
    if (!canDouble) {
      console.log('Cannot double - conditions not met');
      return;
    }
    const newCard = await controllerDouble();
    if (newCard) {
      setPlayerCards(prev => [...prev, newCard]);
    }
    setHasDoubled(true);
    console.log('Double successful');
  };

  const handleSplit = async () => {
    if (!canSplit()) return;
    await controllerSplit();
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="game-area select-none min-h-screen">
        {/* Dealer Area - Fixed position */}
        <div className="fixed top-[65px] left-[240px] flex gap-6">
          {showCards && initialCards.length >= 2 ? (
            <DealerCards 
              cards={controllerGamePhase === 'ended' ? dealerHand : initialCards.slice(0, 2)} 
              gamePhase={controllerGamePhase}
            />
          ) : null}
        </div>

        {/* Player Cards Area */}
        <div className="fixed top-[359px] left-[240px] flex flex-col items-center">
          <div className="flex gap-4 z-[9999]">
            {showCards && (
              hasSplit ? (
                // Mostrar manos divididas
                <div className="flex gap-20">
                  {splitHands.map((hand, index) => (
                    <div 
                      key={index} 
                      className={`flex gap-4 ${index === currentSplitHand ? 'scale-110' : 'opacity-70'}`}
                    >
                      <PlayerCards cards={hand} />
                    </div>
                  ))}
                </div>
              ) : (
                // Mostrar mano normal
                <PlayerCards 
                  cards={[
                    ...initialCards.slice(2, 4), 
                    ...playerCards
                  ].map(card => ({
                    value: card.value,
                    suit: card.suit
                  }))} 
                />
              )
            )}
          </div>
          {controllerGamePhase === 'ended' && (
            <div className="flex flex-col items-center gap-4">
              {controllerGameEndReason === 'blackjack' ? (
                <div className="text-green-400 text-4xl font-['Press_Start_2P'] animate-bounce">
                  Blackjack! You Win!
                </div>
              ) : controllerGameEndReason === 'bust' ? (
                <>
                  <div className="text-red-500 text-4xl font-['Press_Start_2P'] animate-bounce">
                    BUST!
                  </div>
                  <div className="text-white text-xl font-['Press_Start_2P']">
                    You went over 21
                  </div>
                  <div className="text-red-400 text-xl font-['Press_Start_2P']">
                    Game Over
                  </div>
                </>
              ) : controllerGameEndReason === 'push' ? (
                <div className="text-yellow-400 text-4xl font-['Press_Start_2P'] animate-pulse">
                  Push - It's a Tie!
                </div>
              ) : controllerGameEndReason === 'dealer_bust' ? (
                <div className="text-green-400 text-4xl font-['Press_Start_2P'] animate-bounce">
                  Dealer Bust! You Win!
                </div>
              ) : controllerGameEndReason === 'dealer_wins' ? (
                <div className="text-red-400 text-4xl font-['Press_Start_2P']">
                  Dealer Wins!
                </div>
              ) : controllerGameEndReason === 'player_wins' ? (
                <div className="text-green-400 text-4xl font-['Press_Start_2P'] animate-bounce">
                  You Win!
                </div>
              ) : controllerGameEndReason === 'drop' ? (
                <div className="text-yellow-400 text-4xl font-['Press_Start_2P']">
                  Dropped Out - Recovered ${recoveryAmount}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Discard Pile - Fixed position */}
        {showDiscardPile && (
          <div className="fixed top-[359px] right-[526px] z-[90]">
            <div 
              className="relative w-[93px] h-[140px]"
              style={{ transform: `rotate(${discardRotation}deg)` }}
            >
              {/* Cartas del jugador descartadas */}
              {[...initialCards.slice(2, 4), ...playerCards].map((card, index) => (
                <div
                  key={`discard-${index}`}
                  className="absolute top-0 left-0"
                  style={{
                    transform: `translate(${index * 2}px, ${index * 2}px) rotate(${Math.random() * 10 - 5}deg)`,
                    zIndex: index
                  }}
                >
                  <PlayerCards cards={[card]} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deck Area with Betting - Fixed position */}
        <div className="fixed top-[75px] right-[526px] flex flex-col items-center">
          {/* Deck Stack with Action Buttons */}
          <div className="relative">
            {/* HIT sobre el deck */}
            {showCards && !hasDoubled && controllerGamePhase === 'playing' && (
              <div className="absolute w-[79px] -top-[40px] left-1/2 transform -translate-x-1/2 z-[110]">
                <img
                  src={hitGif}
                  alt="Hit"
                  className="w-20 cursor-pointer hover:scale-110 transition-transform duration-200"
                  onClick={handleHit}
                />
              </div>
            )}

            {/* SPLIT cuando sea posible */}
            {showCards && canSplit() && (
              <div className="absolute -top-[40px] left-[-250px]">
                <img
                  src={splitGif}
                  alt="Split"
                  className="w-20 cursor-pointer hover:scale-110 transition-transform duration-200"
                  onClick={handleSplit}
                />
              </div>
            )}

            {/* STAND sobre las cartas del dealer */}
            {showCards && !hasDoubled && controllerGamePhase === 'playing' && (
              <div className="fixed top-[0px] left-[100px] z-[110]">
                <img
                  src={standGif}
                  alt="Stand"
                  className="w-20 fixed top-4 left-[298px] cursor-pointer hover:scale-110 transition-transform duration-200"
                  onClick={handleStand}
                />
              </div>
            )}

            {/* DROP a la derecha */}
            {showCards && !hasDoubled && controllerGamePhase === 'playing' && (
              <div className="absolute -top-[40px] right-[-203px]">
                <img
                  src={dropGif}
                  alt="Drop"
                  className="w-20 cursor-pointer hover:scale-110 transition-transform duration-200"
                  onClick={handleDrop}
                />
              </div>
            )}

            {/* DOUBLE solo después de recibir las cartas iniciales */}
            {canDouble && (
              <div className="fixed top-[296px] right-[431px] z-[110]">
                <img
                  src={doubleGif}
                  alt="Double"
                  className="w-20 cursor-pointer hover:scale-110 transition-transform duration-200"
                  onClick={handleDouble}
                />
              </div>
            )}

            {/* Deck */}
            <div className="fixed top-[75px] right-[313px] flex gap-[123px]">
              <div className="relative">
                <img
                  src={deckX5}
                  alt="deck"
                  className="w-[93px] z-[100] pixel-border"
                />
              </div>
              <div className="relative">
                <img
                  src={deck2}
                  alt="deck2"
                  className="w-[93px] z-[100] pixel-border"
                />
              </div>
            </div>

            {/* START button */}
            {!showCards && bettingChips.length > 0 && !showStartAnim && controllerGamePhase === 'betting' && (
              <div className="fixed top-[35px] right-[531px] z-[110]">
                <img
                  src={startGif}
                  alt="Start"
                  className="w-20 cursor-pointer hover:scale-110 transition-transform duration-200"
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
              </div>
            )}

            {/* Animación de inicio */}
            {showStartAnim && (
              <div className="fixed top-[35px] right-[531px] z-[110]">
                <img 
                  src={startGif} 
                  alt="Start Animation" 
                  className="w-20" 
                />
              </div>
            )}
          </div>

          {/* Betting Zone */}
          <div className="fixed top-[353px] right-[356px] w-[221px] h-[200px] z-[50]
                       border-4 border-dashed border-white/50 rounded-lg bg-indigo-900/30 shadow-lg shadow-indigo-500/50">
            {!showCards || controllerGamePhase === 'betting' ? (
              <div className="absolute -top-[71px] right-[62px]">
                <img 
                  src={betGif}
                  alt="bet"
                  className="w-[100px] z-[100] pixel-border"
                />
              </div>
            ) : null}
            <div className="flex justify-around items-start h-full relative px-2 pt-4">
              {CHIP_COLORS.map((chipColor) => {
                const colorChips = bettingChips.filter(chip => chip.color === chipColor.color);
                const isStackFull = colorChips.length >= 5;
                
                return (
                  <div key={chipColor.color} className="relative w-[60px]">
                    {colorChips.map((chip, stackIndex) => (
                      <div
                        key={chip.id}
                        onClick={() => handleChipClick(chip)}
                        style={{
                          position: 'absolute',
                          transform: `translateY(${-stackIndex * 4}px)`,
                          zIndex: stackIndex + 10,
                          cursor: controllerGamePhase === 'betting' ? 'pointer' : 'not-allowed'
                        }}
                        className={`transition-all duration-200 hover:brightness-110
                                  ${controllerGamePhase !== 'betting' ? 'opacity-50' : ''}`}
                      >
                        <img
                          src={stackIndex % 2 === 0 ? chipColor.src : chipColor.srcB}
                          alt={`${chip.color} chip`}
                          className="w-[60px] h-[60px]"
                          draggable="false"
                        />
                      </div>
                    ))}
                    {isStackFull && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs font-['Press_Start_2P']">
                        Max
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Total apostado debajo de la zona de apuestas */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-yellow-400 text-6xl mt-2" 
                 style={{ bottom: '-60px', fontFamily: 'Bitty, monospace' }}>
              {betCash}$
            </div>
          </div>
        </div>

        {/* Available Chips */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-6 z-[100] 
                     bg-indigo-900/80 p-4 rounded-lg border-2 border-white/30">
          {CHIP_COLORS.map(chip => {
            const sameColorChips = bettingChips.filter(c => c.color === chip.color);
            const isStackFull = sameColorChips.length >= 5;
            
            return (
              <div
                key={chip.id}
                onClick={() => !isStackFull && handleChipClick(chip)}
                className={`cursor-pointer group relative ${isStackFull ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="fixed -top-8 left-1/2 transform -translate-x-1/2 opacity-0 
                           group-hover:opacity-100 transition-opacity duration-200 
                           text-yellow-400 text-sm font-['Press_Start_2P']">
                  ${chip.value}
                </div>
                <img
                  src={chip.src}
                  alt={`${chip.color} chip`}
                  className={`w-[40px] h-[40px]
                           transition-all duration-200 ease-in-out
                           ${!isStackFull && 'group-hover:scale-110 group-hover:brightness-110 hover:shadow-lg hover:shadow-indigo-500/50'}`}
                  draggable="false"
                />
                {isStackFull && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs font-['Press_Start_2P']">
                    Max
                  </div>
                )}
              </div>
            );
          })}
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

        {/* GO BACK button */}
        <div className="fixed right-4 top-24">
          <button
            onClick={() => {
              resetGame();
              window.location.href = '/menu';
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded font-['Press_Start_2P'] text-sm hover:bg-blue-700 transition-colors"
          >
            GO BACK
          </button>
        </div>
      </div>
    </>
  );
}