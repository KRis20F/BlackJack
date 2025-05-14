import React, { useEffect, useState } from "react";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
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
  { src: chipBlack, color: 'Black' },
  { src: chipGreen, color: 'Green' },
  { src: chipRed, color: 'Red' },
  { src: chipBlue, color: 'Blue' },
  { src: chipYellow, color: 'Yellow' }
];

export default function BlackjackGame() {
  const [isLoading, setIsLoading] = useState(true);
  const {
    playerCash,
    betCash,
    handleChipAdd,
    handleChipRemove,
    getChipValue
  } = useGameController();

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
      removable: '#trash',
      acceptWidgets: true,
      staticGrid: false,
      minWidth: 47,
      width: 5,
      disableOneColumnMode: true,
    };

    // Initialize chips area
    const chipsGrid = GridStack.init(options, document.querySelector('.chips-grid'));
    
    if (chipsGrid) {
      chipsGrid.cellHeight(47);
      chipsGrid.column(5);

      // Add chip items
      CHIP_COLORS.forEach((chip, i) => {
        chipsGrid.addWidget({
          x: i,
          y: 0,
          w: 1,
          h: 1,
          content: `
            <div class="grid-stack-item-content cursor-move">
              <img 
                src="${chip.src}" 
                alt="chip" 
                class="w-[47px] h-[47px] hover:scale-110 transition-transform pixel-border"
                data-chip-color="${chip.color}"
              />
            </div>
          `,
          noResize: true,
        });
      });
    }

    // Initialize betting area
    const bettingGrid = GridStack.init({
      ...options,
      acceptWidgets: true,
      float: true,
    }, document.querySelector('.betting-grid'));

    if (bettingGrid) {
      // Handle chip placement
      bettingGrid.on('added', (event, items) => {
        const chipElement = items.el.querySelector('img');
        const chipColor = chipElement.dataset.chipColor;
        const chipValue = getChipValue(chipColor);
        handleChipAdd(chipValue);
      });

      // Handle chip removal
      bettingGrid.on('removed', (event, items) => {
        const chipElement = items.el.querySelector('img');
        const chipColor = chipElement.dataset.chipColor;
        const chipValue = getChipValue(chipColor);
        handleChipRemove(chipValue);
      });
    }

    // Simulate resource loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      if (chipsGrid) chipsGrid.destroy(false);
      if (bettingGrid) bettingGrid.destroy(false);
    };
  }, [getChipValue, handleChipAdd, handleChipRemove]);

  return (
    <>
      {isLoading && <Loading />}
      <div className="game-area">
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

          {/* Betting Zone */}
          <div className="absolute z-[9999] left-1/2 bottom-[20%] w-64 h-32 transform -translate-x-1/2">
            <div className="betting-grid grid-stack h-full w-full border-2 border-dashed border-white/30 rounded-lg">
            </div>
          </div>

          {/* Deck */}
          <div className="absolute right-[484px] top-[-20%]">
            <img src={deckX5} alt="deck" className="pixel-border" />
          </div>
        </div>

        {/* Chips Area */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="chips-grid grid-stack h-[47px] w-[300px]">
          </div>
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

        {/* Hidden removal area */}
        <div id="trash" className="hidden"></div>
      </div>
    </>
  );
}