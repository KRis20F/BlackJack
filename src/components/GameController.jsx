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

    const startRound = async () => {
        try {
            const deckRes = await fetch('http://alvarfs-001-site1.qtempurl.com/Cards/GetDeck');
            const deckData = await deckRes.json();
            setDeckId(deckData.deck);
            
            const cardsRes = await fetch(`http://alvarfs-001-site1.qtempurl.com/Cards/GetCards/${deckData.deck}/4`);
            const cardsData = await cardsRes.json();
            
            const processedCards = cardsData.cards.map(cardValue => ({
                value: cardValue,
                suit: cardValue.slice(-1)
            }));
            
            setInitialCards(processedCards);
            setGamePhase('playing');
            setCurrentRound(1);

            // Verificar Blackjack natural (21 con dos cartas)
            const playerCards = processedCards.slice(2, 4);
            const playerValue = calculateHandValue(playerCards);
            
            if (playerValue === 21) {
                console.log('Natural Blackjack! Instant win!');
                setGamePhase('ended');
                setGameEndReason('blackjack');
                // Pago 3:2 para Blackjack natural
                const blackjackPayout = betCash * 2.5;
                setPlayerCash(prev => prev + blackjackPayout);
                setDealerHand(processedCards.slice(0, 2)); // Mantener las cartas del dealer visibles
            }

        } catch (error) {
            console.error('Error starting round:', error);
        }
    };

    const calculateHandValue = (cards) => {
        let value = 0;
        let aces = 0;
        
        console.log('Starting calculation for cards:', cards);
        
        // Primero sumamos todas las cartas que no son Ases
        cards.forEach(card => {
            const cardValue = typeof card === 'string' 
                ? card.slice(0, -1) 
                : (typeof card.value === 'string' 
                    ? card.value.slice(0, -1) 
                    : card.value);
            
            console.log('Processing card value:', cardValue);
            
            if (cardValue === 'A') {
                aces += 1;
            } else if (['K', 'Q', 'J', '0'].includes(cardValue)) {
                value += 10;
                console.log(`Added 10 for ${cardValue}, current total: ${value}`);
            } else {
                const numValue = parseInt(cardValue);
                if (!isNaN(numValue)) {
                    value += numValue;
                    console.log(`Added ${numValue}, current total: ${value}`);
                }
            }
        });
        
        // Ahora añadimos los Ases uno por uno
        for (let i = 0; i < aces; i++) {
            if (value + 11 <= 21) {
                value += 11;
                console.log(`Added Ace as 11, current total: ${value}`);
            } else {
                value += 1;
                console.log(`Added Ace as 1, current total: ${value}`);
            }
        }
        
        console.log('Final hand value:', value);
        return value;
    };

    const handleHit = async () => {
        if (gamePhase !== 'playing' || hasDoubled) {
            console.log('Cannot hit:', { gamePhase, hasDoubled });
            return null;
        }
        
        try {
            const response = await fetch(`http://alvarfs-001-site1.qtempurl.com/Cards/GetCards/${deckId}/1`);
            const data = await response.json();
            const newCard = {
                value: data.cards[0],
                suit: data.cards[0].slice(-1)
            };
            
            // Primero actualizamos la mano con la nueva carta
            const newHand = [...playerHand, newCard];
            setPlayerHand(newHand);
            
            // Calculamos el valor total
            const currentCards = [...initialCards.slice(2, 4), ...newHand];
            const handValue = calculateHandValue(currentCards);
            
            console.log('Current hand:', currentCards);
            console.log('Current hand value:', handValue);
            
            // Actualizamos el contador de ronda
            setCurrentRound(prev => prev + 1);
            
            // Verificamos si nos pasamos de 21
            if (handValue > 21) {
                console.log('BUST! Hand value:', handValue);
                setGamePhase('ended');
                setGameEndReason('bust');
                // El jugador pierde su apuesta (no hacemos nada con playerCash)
                return newCard;
            }
            
            // Si llegamos a 21, nos plantamos automáticamente
            if (handValue === 21) {
                console.log('Player reached 21, auto-standing');
                await handleStand();
                return newCard;
            }
            
            return newCard;
            
        } catch (error) {
            console.error('Error hitting:', error);
            return null;
        }
    };

    const handleStand = async () => {
        if (gamePhase !== 'playing') return;
        
        try {
            // Si ya ganamos por Blackjack natural, no necesitamos hacer nada más
            if (gameEndReason === 'blackjack') {
                setDealerHand(initialCards.slice(0, 2));
                return;
            }

            const dealerCards = [...initialCards.slice(0, 2)];
            let dealerValue = calculateHandValue(dealerCards);
            console.log('Dealer initial hand:', dealerValue);

            // El dealer pide cartas hasta tener 17 o más
            while (dealerValue < 17) {
                const response = await fetch(`http://alvarfs-001-site1.qtempurl.com/Cards/GetCards/${deckId}/1`);
                const data = await response.json();
                const newCard = {
                    value: data.cards[0],
                    suit: data.cards[0].slice(-1)
                };
                dealerCards.push(newCard);
                dealerValue = calculateHandValue(dealerCards);
                console.log('Dealer drew card:', newCard.value, 'New total:', dealerValue);
                
                // Si el dealer se pasa de 21, paramos inmediatamente
                if (dealerValue > 21) {
                    console.log('Dealer busted with:', dealerValue);
                    break;
                }
                
                // Si el dealer tiene 17 o más, paramos
                if (dealerValue >= 17) {
                    console.log('Dealer stands with:', dealerValue);
                    break;
                }
            }

            setDealerHand(dealerCards);
            
            const playerCards = [...initialCards.slice(2, 4), ...playerHand];
            const playerValue = calculateHandValue(playerCards);
            
            console.log('Final comparison - Player:', playerValue, 'Dealer:', dealerValue);
            
            let result;
            if (dealerValue > 21) {
                result = 'dealer_bust';
                setPlayerCash(prev => prev + (betCash * 2)); // Gana el doble de la apuesta
            } else if (playerValue === dealerValue) {
                result = 'push';
                setPlayerCash(prev => prev + betCash); // Recupera su apuesta
            } else if (playerValue > dealerValue) {
                result = 'player_wins';
                setPlayerCash(prev => prev + (betCash * 2)); // Gana el doble de la apuesta
            } else {
                result = 'dealer_wins';
                // El jugador pierde su apuesta (no hacemos nada)
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

