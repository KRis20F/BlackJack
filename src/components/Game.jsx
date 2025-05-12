import React, { useEffect, useState } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import cardBack from "../assets/Cards/Back.png";
import sevenCard from "../assets/Cards/D/7.png";
import Baraja from "../assets/Cards/Baraja.png";
import chipCyan from "../assets/Chips/Cyan.png";
import chipGreen from "../assets/Chips/Green.png";
import chipRed from "../assets/Chips/Red.png";
import chipBlue from "../assets/Chips/Blue.png";
import chipYellow from "../assets/Chips/Yellow.png";
import "../assets/css/game.css";
import Loading from './Loading';

const CHIP_COLORS = [chipRed , chipBlue, chipGreen, chipCyan, chipYellow];

export default function BlackjackGame() {
  const [isLoading, setIsLoading] = useState(true);
  const [chips, setChips] = useState([]);

  useEffect(() => {
    const options = {
      float: true,
      disableResize: true,
      cellHeight: 47,
      column: 5,
      margin: 0,
      draggable: {
        handle: '.grid-stack-item-content',
        scroll: true,
      },
      removable: false,
      acceptWidgets: true,
      staticGrid: false,
      minWidth: 47,
      width: 5,
      disableOneColumnMode: true,
    };

    // Inicializar el área de fichas
    const chipsGrid = GridStack.init(options, document.querySelector('.chips-grid'));
    
    if (chipsGrid) {
      // Forzar el tamaño de la celda
      chipsGrid.cellHeight(47);
      chipsGrid.column(5);
    }

    // Inicializar el área de apuestas
    const bettingGrid = GridStack.init({
      ...options,
      acceptWidgets: true,
      float: true,
    }, document.querySelector('.betting-grid'));

    // Simular carga de recursos
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      if (chipsGrid) chipsGrid.destroy(false);
      if (bettingGrid) bettingGrid.destroy(false);
    };
  }, []);

  const handleDragStart = (e, color) => {
    const img = e.target;
    e.dataTransfer.setData('text/plain', color);
    
    // Crear una imagen fantasma del mismo tamaño
    const ghost = img.cloneNode(true);
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 23, 23);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const color = e.dataTransfer.getData('text/plain');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 23; // 23 es la mitad del tamaño del chip
    const y = e.clientY - rect.top - 23;
    
    setChips(prev => [...prev, {
      id: Date.now(),
      x,
      y,
      color
    }]);
  };

  // if (!isLoggedIn) {
  //   return <Login onLogin={() => setIsLoggedIn(true)} />;
  // }

  return (
    <>
      {isLoading && <Loading />}
      <div className="game-area">
        {/* Área del Dealer */}
        <div className="card-container flex gap-6 ml-28 mt-8 mb-8 p-4">
          <img src={cardBack} alt="card back" className="pixel-border" />
          <img src={sevenCard} alt="card" className="pixel-border" />
          <img src={sevenCard} alt="card" className="pixel-border" />
          <img src={sevenCard} alt="card" className="pixel-border" />
        </div>

        {/* Área del Jugador y Apuestas */}
        <div className="relative w-full h-[60vh]">
          {/* Cartas del Jugador */}
          <div className="card-container absolute z-[9999] left-[20%] bottom-[30%] flex gap-4">
            <img src={sevenCard} alt="card" className="pixel-border" />
            <img src={sevenCard} alt="card" className="pixel-border" />
          </div>

          {/* Zona de Apuestas */}
          <div className="absolute z-[9999] left-1/2 bottom-[20%] w-64 h-32 transform -translate-x-1/2">
            <div className="betting-grid grid-stack h-full w-full">
            </div>
          </div>

          {/* Mazo */}
          <div className="absolute right-[484px] top-[-20%]">
            <img src={Baraja} alt="deck" className="pixel-border" />
          </div>
        </div>

        {/* Área de Fichas */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-4 justify-center items-center">
            {CHIP_COLORS.map((color, i) => (
              <img
                key={`chip-${i}`}
                src={color}
                alt="chip"
                className="w-[47px] h-[47px] hover:scale-110 transition-transform pixel-border cursor-grab"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, color)}
              />
            ))}
          </div>
        </div>

        {/* Área de Apuestas */}
        <div 
          className="bet-area fixed top-[421px] left-[1289px] h-64 bottom-32 transform -translate-x-1/2 w-64  border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <span className="text-white/50 font-['Press_Start_2P'] text-sm">Drop chips here to bet</span>
          {chips.map(chip => (
            <img
              key={chip.id}
              src={chip.color}
              alt="placed chip"
              className="absolute w-[47px] h-[47px] pixel-border"
              style={{
                left: `${chip.x}px`,
                top: `${chip.y}px`
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}