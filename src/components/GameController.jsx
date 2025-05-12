export default function gameController() {
    const [playerCash, setPlayerCash] = useState(0);
    const [playerHand, setPlayerHand] = useState([[]]);
    const [betCash, setBetCash] = useState(0);
    const [dealerHand, setDealerHand] = useState([]);
    const [currentRound, setCurrentRound] = useState(0);
    
    const bet = (chip) => {
        const chipValues = {
            red: 1,
            blue: 5,
            green: 20,
            black: 50,
            yellow: 100
        };

        const betValue = chipValues[chip.color];

        setBetCash(prev => prev += betValue)
        setPlayerCash(prev => prev -= betValue)
    }

    const start = () => {
        // Peticion al Backend para guardar playerCash
        setCurrentRound(currentRound += 1);
    }

    return {
        playerCash, setPlayerCash,
        playerHand, setPlayerHand,
        betCash, setBetCash,
        dealerHand, setDealerHand,
        activeHandIndex, setActiveHandIndex,
        currentRound, setCurrentRound,

        bet, start
    };
}

