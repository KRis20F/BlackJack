import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [playAgainHandler, setPlayAgainHandler] = useState(null);
  const [playerCash, setPlayerCash] = useState(() => {
    const saved = localStorage.getItem('playerCash');
    return saved ? parseInt(saved) : 100;
  });

  useEffect(() => {
    localStorage.setItem('playerCash', playerCash);
  }, [playerCash]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'playerCash') {
        setPlayerCash(parseInt(e.newValue) || 0);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://alvarfs-001-site1.qtempurl.com/User/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data && typeof data.cash === 'number') {
            setPlayerCash(data.cash);
            localStorage.setItem('playerCash', data.cash);
          }
        })
        .catch(() => {});
    }
  }, []);

  const value = {
    playAgainHandler,
    setPlayAgainHandler,
    playerCash,
    setPlayerCash
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 