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
    const [deckId, setDeckId] = useState(null);
    const [initialCards, setInitialCards] = useState([]);

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

    const start = useCallback( async() => {
        if (betCash <= 0) return;
        setCurrentRound(prev => prev + 1);

        let response = await fetch('http://alvarfs-001-site1.qtempurl.com/User/3/69', {
            method: 'PUT',
            body: JSON.stringify({
                betCash: betCash
            })
        });
        
        console.log(response);

    }, [betCash]);

    const startRound = async () => {
        const deckRes = await fetch('http://alvarfs-001-site1.qtempurl.com/Cards/GetDeck');
        const deckData = await deckRes.json();
        setDeckId(deckData.deck);
        const cardsRes = await fetch(`http://alvarfs-001-site1.qtempurl.com/Cards/GetCards/${deckData.deck}/4`);
        const cardsData = await cardsRes.json();
        setInitialCards(cardsData.cards || []);
    };

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
        getChipValue,
        deckId,
        initialCards,
        startRound
    };
}

