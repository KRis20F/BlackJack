import { useState, useCallback, useEffect } from 'react';

export const CHIP_VALUES = {
    Black: 50,
    Green: 20,
    Red: 5,
    Blue: 1,
    Yellow: 100
};

export default function useGameController() {
    const [playerCash, setPlayerCash] = useState(() => {
        const saved = localStorage.getItem('playerCash');
        return saved ? parseInt(saved) : 100;
    });
    const [playerHand, setPlayerHand] = useState([]);
    const [splitHands, setSplitHands] = useState([]); // Array para manos divididas
    const [currentSplitHand, setCurrentSplitHand] = useState(0); // Índice de la mano actual
    const [hasSplit, setHasSplit] = useState(false);
    const [betCash, setBetCash] = useState(() => {
        const saved = localStorage.getItem('betCash');
        return saved ? parseInt(saved) : 0;
    });
    const [dealerHand, setDealerHand] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [deckId, setDeckId] = useState(null);
    const [initialCards, setInitialCards] = useState([]);
    const [hasDoubled, setHasDoubled] = useState(false);
    const [gamePhase, setGamePhase] = useState(() => {
        const saved = localStorage.getItem('gamePhase');
        return saved || 'betting';
    });
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

    // Efecto para monitorear playerCash y resetearlo cuando llegue a 0
    useEffect(() => {
        if (playerCash <= 0) {
            console.log('Player is out of money, resetting to 100');
            const resetCash = 100;
            setPlayerCash(resetCash);
            localStorage.setItem('playerCash', resetCash);
            
            // Resetear el estado del juego
            setGamePhase('betting');
            setBetCash(0);
            setPlayerHand([]);
            setDealerHand([]);
            setHasDoubled(false);
            setCurrentRound(0);
            setInitialCards([]);
            
            // Si el usuario está logueado, actualizar en el servidor
            if (isLoggedIn && userId) {
                fetch(`http://alvarfs-001-site1.qtempurl.com/User/${userId}/${resetCash}`, {
                    method: 'PUT'
                }).catch(error => {
                    console.error('Error updating user cash on server:', error);
                });
            }
        }
    }, [playerCash, isLoggedIn, userId]);

    // Guardar estados importantes en localStorage
    useEffect(() => {
        if (playerCash) localStorage.setItem('playerCash', playerCash);
        if (gamePhase) localStorage.setItem('gamePhase', gamePhase);
        if (betCash) localStorage.setItem('betCash', betCash);
    }, [playerCash, gamePhase, betCash]);

    // Modificar updatePlayerCash para verificar si el jugador se queda sin dinero
    const updatePlayerCash = useCallback(async (newCash) => {
        // Si el nuevo saldo es 0 o negativo, resetear a 100
        if (newCash <= 0) {
            console.log('Preventing zero balance, resetting to 100');
            newCash = 100;
        }
        
        setPlayerCash(newCash);
        localStorage.setItem('playerCash', newCash);
        
        if (isLoggedIn && userId) {
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
        }
    }, [isLoggedIn, userId]);

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

        const totalBetAfterAdd = betCash + chipValue;
        console.log('Adding chip:', { chipValue, currentBet: betCash, totalBetAfterAdd, playerCash });
        
        // Verificar si el jugador tiene suficiente dinero para la apuesta total
        if (chipValue > playerCash) {
            console.log('Insufficient funds for chip:', { chipValue, playerCash });
            return false;
        }
        
        updatePlayerCash(playerCash - chipValue);
        setBetCash(totalBetAfterAdd);
        return true;
    }, [playerCash, betCash, gamePhase, updatePlayerCash]);

    const handleChipRemove = useCallback((chipValue) => {
        if (gamePhase !== 'betting') {
            console.log('Cannot remove chips after game has started');
            return false;
        }

        const newBetCash = betCash - chipValue;
        const newPlayerCash = playerCash + chipValue;
        
        console.log('Removing chip:', { chipValue, currentBet: betCash, newBetCash, newPlayerCash });
        
        updatePlayerCash(newPlayerCash);
        setBetCash(newBetCash);
        return true;
    }, [gamePhase, playerCash, betCash, updatePlayerCash]);

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

        // Calcular el porcentaje de recuperación basado en la ronda actual
        // Ronda 1: 50%, Ronda 2: 25%, Ronda 3: 12.5%, etc.
        const recoveryPercentage = 50;  // Siempre recuperar el 50%
        const recoveryAmount = Math.floor(betCash * 0.5);  // Multiplicar por 0.5 para obtener el 50%

        console.log('Drop calculation:', { currentRound, recoveryPercentage, recoveryAmount, betCash });

        if (recoveryAmount < 1) {
            console.log('Cannot drop - recovery amount too low');
            return;
        }

        // Actualizar el saldo del jugador
        const newCash = playerCash + recoveryAmount;
        updatePlayerCash(newCash);

        // Finalizar el juego sin mostrar las cartas del dealer
        setGamePhase('ended');
        setGameEndReason('drop');
        
        // Mantener solo la primera carta del dealer visible
        setDealerHand([initialCards[0]]);
        
        // Resetear la apuesta
        setBetCash(0);

        return recoveryAmount;
    };

    const handleDouble = async () => {
        console.log('Double attempted:', { gamePhase, hasDoubled, playerCash, betCash });
        
        if (gamePhase !== 'playing' || hasDoubled) {
            console.log('Cannot double - wrong game phase or already doubled');
            return null;
        }

        try {
            // Verificar si tenemos suficiente dinero para doblar
            if (playerCash < betCash) {
                console.log('Insufficient funds to double');
                return null;
            }

            console.log('Doubling bet:', { currentBet: betCash, newBet: betCash * 2, playerCash });

            // Doblar la apuesta y actualizar el saldo
            const doubledBet = betCash * 2;
            const newCash = playerCash - betCash; // Restar la cantidad adicional
            
            // Primero actualizar el saldo y la apuesta
            updatePlayerCash(newCash);
            setBetCash(doubledBet);
            setHasDoubled(true);

            // Pedir una carta adicional
            const response = await fetch(`http://alvarfs-001-site1.qtempurl.com/Cards/GetCards/${deckId}/1`);
            const data = await response.json();
            const newCard = {
                value: data.cards[0],
                suit: data.cards[0].slice(-1)
            };
            
            // Actualizar la mano con la nueva carta
            const newHand = [...playerHand, newCard];
            setPlayerHand(newHand);
            
            // Calcular el valor total
            const currentCards = [...initialCards.slice(2, 4), ...newHand];
            const handValue = calculateHandValue(currentCards);
            
            console.log('Double down result:', { handValue, newCard, doubledBet });
            
            // Verificar si nos pasamos de 21
            if (handValue > 21) {
                setGamePhase('ended');
                setGameEndReason('bust');
                return newCard;
            }
            
            // Automáticamente nos plantamos después de recibir la carta
            await handleStand();
            
            return newCard;
            
        } catch (error) {
            console.error('Error during double:', error);
            // Revertir cambios si hay error
            setHasDoubled(false);
            updatePlayerCash(playerCash);
            setBetCash(betCash);
            return null;
        }
    };

    const canDouble = useCallback(() => {
        return gamePhase === 'playing' && 
               currentRound === 1 && 
               playerCash >= betCash && 
               !hasDoubled;
    }, [gamePhase, currentRound, playerCash, betCash, hasDoubled]);

    const canSplit = useCallback(() => {
        if (gamePhase !== 'playing' || currentRound !== 1 || hasSplit) return false;
        
        // Obtener las dos cartas iniciales del jugador
        const playerCards = initialCards.slice(2, 4);
        if (playerCards.length !== 2) return false;

        // Obtener los valores de las cartas
        const value1 = playerCards[0].value.slice(0, -1);
        const value2 = playerCards[1].value.slice(0, -1);

        // Verificar si los valores son iguales
        return value1 === value2 && playerCash >= betCash;
    }, [gamePhase, currentRound, hasSplit, initialCards, playerCash, betCash]);

    const handleSplit = async () => {
        if (!canSplit()) return;

        try {
            // Doblar la apuesta
            const newCash = playerCash - betCash;
            updatePlayerCash(newCash);
            setBetCash(betCash * 2);

            // Dividir las cartas en dos manos
            const playerCards = initialCards.slice(2, 4);
            
            // Pedir dos cartas nuevas, una para cada mano
            const response = await fetch(`http://alvarfs-001-site1.qtempurl.com/Cards/GetCards/${deckId}/2`);
            const data = await response.json();
            
            // Crear las dos manos divididas
            const hand1 = [playerCards[0], { value: data.cards[0], suit: data.cards[0].slice(-1) }];
            const hand2 = [playerCards[1], { value: data.cards[1], suit: data.cards[1].slice(-1) }];
            
            setSplitHands([hand1, hand2]);
            setCurrentSplitHand(0);
            setHasSplit(true);

            // Si son ases, terminar automáticamente
            if (playerCards[0].value.startsWith('A')) {
                // Manejar automáticamente ambas manos
                await handleSplitAces(hand1, hand2);
            }

        } catch (error) {
            console.error('Error during split:', error);
            // Revertir cambios si hay error
            updatePlayerCash(playerCash);
            setBetCash(betCash);
        }
    };

    const handleSplitAces = async (hand1, hand2) => {
        // Con ases divididos, el jugador solo recibe una carta por mano y termina automáticamente
        setGamePhase('ended');
        await handleStand();
    };

    // Función para reiniciar el juego
    const resetGame = useCallback(() => {
        setGamePhase('betting');
        setGameEndReason(null);
        setBetCash(0);
        setPlayerHand([]);
        setDealerHand([]);
        setHasDoubled(false);
        setCurrentRound(0);
        setInitialCards([]);
        
        // Limpiar estados del juego pero mantener el saldo
        localStorage.removeItem('gamePhase');
        localStorage.removeItem('betCash');
    }, []);

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
        handleSplit,
        canSplit,
        hasSplit,
        splitHands,
        currentSplitHand,
        gamePhase,
        hasDoubled,
        gameEndReason,
        isLoggedIn,
        resetGame
    };
}

