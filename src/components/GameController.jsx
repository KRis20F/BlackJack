import { useState, useCallback } from 'react';

export const CHIP_VALUES = {
    Black: 50,
    Green: 20,
    Red: 1,
    Blue: 5,
    Yellow: 100
};

export default function useGameController() {
    const [playerCash, setPlayerCash] = useState(1000);
    const [playerHand, setPlayerHand] = useState([]);
    const [betCash, setBetCash] = useState(0);
    const [dealerHand, setDealerHand] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);

    const getChipValue = useCallback((chipColor) => {
        return CHIP_VALUES[chipColor] || 0;
    }, []);

    const handleChipAdd = useCallback((chipValue) => {
        if (chipValue > playerCash) {
            console.log('Insufficient funds');
            return false;
        }
        
        setPlayerCash(prev => prev - chipValue);
        setBetCash(prev => prev + chipValue);
        return true;
    }, [playerCash]);

    const handleChipRemove = useCallback((chipValue) => {
        setPlayerCash(prev => prev + chipValue);
        setBetCash(prev => prev - chipValue);
    }, []);

    const clearBet = useCallback(() => {
        setBetCash(0);
    }, []);

    const start = useCallback(() => {
        if (betCash <= 0) return;
        setCurrentRound(prev => prev + 1);
    }, [betCash]);

    return {
        playerCash,
        setPlayerCash,
        playerHand,
        setPlayerHand,
        betCash,
        dealerHand,
        setDealerHand,
        currentRound,
        handleChipAdd,
        handleChipRemove,
        clearBet,
        start,
        getChipValue
    };
}

