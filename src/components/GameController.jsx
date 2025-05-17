import { useState, useCallback, useEffect } from 'react';

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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    // Verificar si el usuario está logueado al iniciar
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setIsLoggedIn(true);
            setUserId(storedUserId);
            console.log('User logged in:', storedUserId);
        } else {
            console.log('No user logged in');
            setIsLoggedIn(false);
            setUserId(null);
        }
    }, []);

    // Función para actualizar el saldo en el servidor
    const updateUserCash = useCallback(async (newCash) => {
        if (!isLoggedIn || !userId) {
            console.log('User not logged in, skipping server update');
            return;
        }

        try {
            const response = await fetch(`http://alvarfs-001-site1.qtempurl.com/User/${userId}/${newCash}`, {
                method: 'PUT'
            });

            if (!response.ok) {
                console.error('Failed to update user cash:', response.status);
                return;
            }

            console.log('User cash updated successfully:', { userId, newCash });
        } catch (error) {
            console.error('Error updating user cash:', error);
        }
    }, [isLoggedIn, userId]);

    // Modificar setPlayerCash para que actualice el servidor cuando cambie el saldo
    const updatePlayerCash = useCallback((newCash) => {
        setPlayerCash(newCash);
        updateUserCash(newCash);
    }, [updateUserCash]);

    // Modificar las funciones que afectan al saldo para usar updatePlayerCash
    const handleGameEnd = useCallback(async (result) => {
        setGamePhase('ended');
        setGameEndReason(result);

        let newCash = playerCash;
        switch (result) {
            case 'blackjack':
                newCash = playerCash + Math.floor(betCash * 2.5);
                break;
            case 'player_wins':
            case 'dealer_bust':
                newCash = playerCash + (betCash * 2);
                break;
            case 'push':
                newCash = playerCash + betCash;
                break;
            case 'dealer_wins':
            case 'bust':
                newCash = playerCash; // El jugador pierde su apuesta
                break;
            default:
                newCash = 100; // Reset to default if something unexpected happens
        }

        updatePlayerCash(newCash);
    }, [playerCash, betCash, updatePlayerCash]);

    const getChipValue = useCallback((chipColor) => {
        return CHIP_VALUES[chipColor] || 0;
    }, []);

    const handleChipAdd = useCallback((chipValue) => {
        if (gamePhase !== 'betting') {
            console.log('Cannot add chips after game has started');
            return false;
        }

        if (betCash + chipValue > playerCash) {
            console.log('Insufficient funds for total bet:', { totalBetAfterAdd: betCash + chipValue, playerCash });
            return false;
        }
        
        updatePlayerCash(playerCash - chipValue);
        setBetCash(prev => prev + chipValue);
        return true;
    }, [playerCash, betCash, gamePhase, updatePlayerCash]);

    const handleChipRemove = useCallback((chipValue) => {
        if (gamePhase !== 'betting') {
            console.log('Cannot remove chips after game has started');
            return false;
        }

        updatePlayerCash(playerCash + chipValue);
        setBetCash(prev => prev - chipValue);
        return true;
    }, [gamePhase, playerCash, updatePlayerCash]);

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
            if (gameEndReason === 'blackjack') {
                setDealerHand(initialCards.slice(0, 2));
                await handleGameEnd('blackjack');
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
            } else if (playerValue === dealerValue || (playerValue === 21 && dealerValue === 21)) {
                result = 'push';
            } else if (playerValue > dealerValue) {
                result = 'player_wins';
            } else {
                result = 'dealer_wins';
            }

            await handleGameEnd(result);
            
        } catch (error) {
            console.error('Error during dealer turn:', error);
        }
    };

    const handleDrop = async () => {
        if (gamePhase !== 'playing') return;

        const recoveryPercentage = 100 / (currentRound + 1);
        const recoveryAmount = Math.floor(betCash * (recoveryPercentage / 100));

        if (recoveryAmount < 1) {
            console.log('Cannot drop - recovery amount too low');
            return;
        }

        const newCash = playerCash + recoveryAmount;
        await updateUserCash(newCash);
        setPlayerCash(newCash);
        setBetCash(0);
        setGamePhase('ended');
        setGameEndReason('drop');
    };

    const handleDouble = async () => {
        if (gamePhase !== 'playing' || currentRound > 1 || playerCash < betCash || hasDoubled) {
            console.log('Cannot double:', { gamePhase, currentRound, playerCash, betCash, hasDoubled });
            return;
        }

        try {
            // Primero verificamos que podemos doblar
            if (playerCash < betCash) {
                console.log('Insufficient funds to double');
                return;
            }

            // Doblamos la apuesta
            setPlayerCash(prev => prev - betCash);
            setBetCash(prev => prev * 2);
            setHasDoubled(true);

            // Pedimos una carta adicional
            const response = await fetch(`http://alvarfs-001-site1.qtempurl.com/Cards/GetCards/${deckId}/1`);
            const data = await response.json();
            const newCard = {
                value: data.cards[0],
                suit: data.cards[0].slice(-1)
            };
            
            // Actualizamos la mano con la nueva carta
            const newHand = [...playerHand, newCard];
            setPlayerHand(newHand);
            
            // Calculamos el valor total
            const currentCards = [...initialCards.slice(2, 4), ...newHand];
            const handValue = calculateHandValue(currentCards);
            
            console.log('Double down result:', { handValue, newCard });
            
            // Verificamos si nos pasamos de 21
            if (handValue > 21) {
                setGamePhase('ended');
                setGameEndReason('bust');
                return;
            }
            
            // Automáticamente nos plantamos después de recibir la carta
            await handleStand();
            
        } catch (error) {
            console.error('Error during double:', error);
            // Revertir cambios si hay error
            setPlayerCash(prev => prev + betCash);
            setBetCash(prev => prev / 2);
            setHasDoubled(false);
        }
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
        gameEndReason,
        isLoggedIn
    };
}

