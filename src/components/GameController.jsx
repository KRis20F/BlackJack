import { useState } from 'react';

export default function gameController() {
    const [playerCash, setPlayerCash] = useState(0);
    const [playerHand, setPlayerHand] = useState([[]]);
    const [betCash, setBetCash] = useState(0);
    const [dealerHand, setDealerHand] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    
    const updateBet = (chips) => {
        const betValue = 0;
        const chipValues = {
            red: 1,
            blue: 5,
            green: 20,
            black: 50,
            yellow: 100
        };

        chips.forEach(chip => {
            betValue += chipValues[chip.color];
        });

        setBetCash(prev => prev += betValue)
        setPlayerCash(prev => prev -= betValue)
    }

    const start = () => {
        if (betCash <= 0) return;
        
        // Peticion al Backend para guardar playerCash a la BD
        
        setCurrentRound(currentRound += 1);
    }

    return {
        playerCash, setPlayerCash,
        playerHand, setPlayerHand,
        betCash, setBetCash,
        dealerHand, setDealerHand,
        currentRound, setCurrentRound,

        updateBet, start
    };
}

