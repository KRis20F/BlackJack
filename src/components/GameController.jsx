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
    const [hasDoubled, setHasDoubled] = useState(false);
    const [gamePhase, setGamePhase] = useState('betting'); // betting, playing, ended
    const [gameEndReason, setGameEndReason] = useState(null); // 'bust' or 'stand'

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

    const start = useCallback(async() => {
        if (betCash <= 0) return;
        setCurrentRound(prev => prev + 1);
        setGamePhase('playing');

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
            // console.log('Cards received:', cardsData);
            
            // Las cartas vienen en formato "5S", "QC", etc.
            const processedCards = cardsData.cards.map(cardValue => ({
                value: cardValue, // Mantenemos el valor completo (ej: "5S")
                suit: cardValue.slice(-1) // Tomamos el último carácter como palo
            }));
            
            setInitialCards(processedCards);
            setGamePhase('playing');
            setCurrentRound(1);
        } catch (error) {
            console.error('Error starting round:', error);
        }
    };

    const calculateHandValue = (cards) => {
        let value = 0;
        let aces = 0;
        
        console.log('Calculating value for cards:', cards);
        
        cards.forEach(card => {
            // Asegurarnos de que tenemos el objeto carta completo
            console.log('Raw card:', card);
            
            // Si la carta es un string (ej: "10H"), extraer el valor
            const cardValue = typeof card === 'string' 
                ? card.slice(0, -1) 
                : (typeof card.value === 'string' 
                    ? card.value.slice(0, -1) 
                    : card.value);
            
            console.log('Extracted card value:', cardValue);
            
            if (cardValue === 'A') {
                aces += 1;
                value += 11;
                console.log('Ace found, current value:', value);
            } else if (['K', 'Q', 'J'].includes(cardValue)) {
                value += 10;
                console.log('Face card found, current value:', value);
            } else if (cardValue === '10') {
                value += 10;
                console.log('10 found, current value:', value);
            } else {
                const numValue = parseInt(cardValue);
                if (!isNaN(numValue)) {
                    value += numValue;
                    console.log(`Number ${numValue} found, current value:`, value);
                } else {
                    console.log('WARNING: Could not parse card value:', cardValue);
                }
            }
        });
        
        // Adjust for aces
        while (value > 21 && aces > 0) {
            value -= 10;
            aces -= 1;
            console.log('Adjusted for ace, new value:', value);
        }
        
        console.log('Final hand value:', value);
        return value;
    };

    const handleHit = async () => {
        if (gamePhase !== 'playing' || hasDoubled) {
            console.log('Cannot hit:', { gamePhase, hasDoubled });
            return;
        }
        
        try {
            const response = await fetch(`http://alvarfs-001-site1.qtempurl.com/Cards/GetCards/${deckId}/1`);
            const data = await response.json();
            const newCard = {
                value: data.cards[0],
                suit: data.cards[0].slice(-1)
            };
            
            const newHand = [...playerHand, newCard];
            const handValue = calculateHandValue([...initialCards.slice(2, 4), ...newHand]);
            
            console.log('Current hand value:', handValue);
            
            if (handValue > 21) {
                console.log('BUST! Hand value:', handValue);
                setGamePhase('ended');
                setGameEndReason('bust');
                setPlayerHand(newHand);
                return newCard;
            }
            
            setPlayerHand(newHand);
            setCurrentRound(prev => prev + 1);
            return newCard;
        } catch (error) {
            console.error('Error hitting:', error);
            return null;
        }
    };

    const handleStand = async () => {
        if (gamePhase !== 'playing') return;
        
        try {
            // Revelar la segunda carta del dealer
            const dealerCards = [...initialCards.slice(0, 2)];
            let dealerValue = calculateHandValue(dealerCards);
            console.log('Dealer initial hand:', dealerValue);

            // Dealer debe tomar cartas hasta tener 17 o más
            while (dealerValue < 17) {
                const response = await fetch(`http://alvarfs-001-site1.qtempurl.com/Cards/GetCards/${deckId}/1`);
                const data = await response.json();
                const newCard = {
                    value: data.cards[0],
                    suit: data.cards[0].slice(-1)
                };
                dealerCards.push(newCard);
                dealerValue = calculateHandValue(dealerCards);
                console.log('Dealer drew card:', newCard, 'New value:', dealerValue);
            }

            setDealerHand(dealerCards);
            
            // Comparar manos para determinar el ganador
            const playerValue = calculateHandValue([...initialCards.slice(2, 4), ...playerHand]);
            
            let result;
            if (dealerValue > 21) {
                result = 'dealer_bust';
            } else if (dealerValue > playerValue) {
                result = 'dealer_wins';
            } else if (dealerValue < playerValue) {
                result = 'player_wins';
            } else {
                result = 'push';
            }

            setGamePhase('ended');
            setGameEndReason(result);
            
        } catch (error) {
            console.error('Error during dealer turn:', error);
        }
    };

    const handleDrop = () => {
        if (gamePhase !== 'playing') return;

        const recoveryPercentage = Math.max(50 / Math.pow(2, currentRound - 1), 1);
        const recoveryAmount = Math.floor(betCash * (recoveryPercentage / 100));

        if (recoveryAmount < 1) {
            console.log('Cannot drop - recovery amount too low');
            return;
        }

        setPlayerCash(prev => prev + recoveryAmount);
        setBetCash(0);
        setGamePhase('ended');
    };

    const handleDouble = () => {
        if (gamePhase !== 'playing' || currentRound > 1 || playerCash < betCash) return;

        setPlayerCash(prev => prev - betCash);
        setBetCash(prev => prev * 2);
        setHasDoubled(true);
        // Aquí iría la lógica para recibir una carta más
    };

    const canDouble = useCallback(() => {
        return gamePhase === 'playing' && 
               currentRound === 1 && 
               playerCash >= betCash && 
               !hasDoubled;
    }, [gamePhase, currentRound, playerCash, betCash, hasDoubled]);

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
        startRound,
        handleHit,
        handleStand,
        handleDrop,
        handleDouble,
        canDouble,
        gamePhase,
        hasDoubled,
        gameEndReason
    };
}

