import { useState, useCallback } from 'react';

export const CHIP_VALUES = {
    Black: 50,
    Green: 20,
    Red: 1,
    Blue: 5,
    Yellow: 100
};

export default function useGameController() {
    const [playerCash, setPlayerCash] = useState(100); // Start with 100€
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
        if (betCash + chipValue > playerCash) {
            console.log('Insufficient funds');
            return false;
        }
        
        setPlayerCash(prev => prev - chipValue);
        setBetCash(prev => prev + chipValue);
        return true;
    }, [playerCash, betCash]);

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

    const processCard = (card) => {
        // Convert API values to match asset file names
        const suitMap = {
            'Hearts': 'Hearts',
            'Diamonds': 'Diamonds',
            'Clubs': 'Clubs',
            'Spades': 'Spades'
        };
        
        const valueMap = {
            'Ace': 'A',
            'King': 'K',
            'Queen': 'Q',
            'Jack': 'J',
            '10': '10',
            '9': '9',
            '8': '8',
            '7': '7',
            '6': '6',
            '5': '5',
            '4': '4',
            '3': '3',
            '2': '2'
        };

        return {
            suit: suitMap[card.suit] || card.suit,
            value: valueMap[card.value] || card.value
        };
    };

    const startRound = async () => {
        try {
            const deckRes = await fetch('http://alvarfs-001-site1.qtempurl.com/Cards/GetDeck');
            const deckData = await deckRes.json();
            setDeckId(deckData.deck);
            
            const cardsRes = await fetch(`http://alvarfs-001-site1.qtempurl.com/Cards/GetCards/${deckData.deck}/4`);
            const cardsData = await cardsRes.json();
            console.log('Cards received:', cardsData);
            
            // Las cartas vienen en formato "5S", "QC", etc.
            const processedCards = cardsData.cards.map(cardValue => ({
                value: cardValue, // Mantenemos el valor completo (ej: "5S")
                suit: cardValue.slice(-1) // Tomamos el último carácter como palo
            }));
            
            setInitialCards(processedCards);
        } catch (error) {
            console.error('Error starting round:', error);
        }
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

