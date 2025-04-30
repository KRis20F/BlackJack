// blackjack-ui.jsx
import React, { useEffect } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "./App.css"; // Aquí incluirás estilos base y de tailwind
import chip from "./assets/svg/Chip.svg";
import sevenCard from "./assets/svg/7.svg";
import cardBack from "./assets/svg/image1.svg";

const CHIP_COLORS = ["#e74c3c", "#3498db", "#2ecc71"];

export default function BlackjackUI() {
  useEffect(() => {
    const options = {
      float: true,
      disableResize: true,
      cellHeight: 40,
      column: 12,
      margin: 2,
      draggable: {
        handle: '.grid-stack-item-content',
        scroll: true,
      },
      removable: false,
      acceptWidgets: true,
      staticGrid: false
    };

    // Inicializar el área de fichas
    const chipsGrid = GridStack.init(options, document.querySelector('.chips-grid'));
    
    // Inicializar el área de apuestas
    const bettingGrid = GridStack.init({
      ...options,
      acceptWidgets: true,
      float: true,
    }, document.querySelector('.betting-grid'));

    return () => {
      chipsGrid.destroy(false);
      bettingGrid.destroy(false);
    };
  }, []);

  return (
    <div className="text-white p-4">
      {/* Dealer area */}
      <div className="flex justify-center gap-6 mb-8">
        <img src={cardBack} alt="card back" className="w-16 h-24" />
        <img src={sevenCard} alt="card" className="w-16 h-24" />
        <img src={sevenCard} alt="card" className="w-16 h-24" />
        <img src={sevenCard} alt="card" className="w-16 h-24" />
      </div>

      {/* Player and betting area */}
      <div className="flex justify-center gap-10">
        {/* Player cards */}
        <div className="p-4 flex absolute left-[12em] bottom-[168px] gap-[23px]">
          <img src={sevenCard} alt="card" className="w-16 h-24" />
          <img src={sevenCard} alt="card" className="w-16 h-24" />
        </div>

        {/* Bet chips drop zone */}
        <div className="border-2 p-4">
          <div className="betting-grid grid-stack h-40 w-80">
          </div>
        </div>
      </div>
      <div className="border-2 p-4 fixed bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="chips-grid grid-stack h-40 w-80 flex justify-evenly items-center">
            {CHIP_COLORS.map((color, i) => (
              <div
                key={`chip-${i}`}
                className="grid-stack-item"
                gs-x={i}
                gs-y="0"
                gs-w="2"
                gs-h="2"
                gs-no-resize="true"
              >
                <div className="grid-stack-item-content cursor-move flex items-center justify-center">
                  <div className="w-10 h-10">
                    <img src={chip} alt="chip" className="w-full h-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
