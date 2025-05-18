import React, { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch('https://alvarfs-001-site1.qtempurl.com/User')
      .then(response => response.json())
      .then(data => {
        setPlayers(data);
      })
      .catch(error => {
        console.error('Error fetching players:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-indigo-900/95 pt-24 pb-8 px-8 font-['Press_Start_2P']">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-white mb-4 animate-pulse">
          LEADERBOARD
        </h1>
        <h2 className="text-2xl text-purple-300">
          BLACKJACK MASTERS
        </h2>
      </div>

      {/* Leaderboard List */}
      <div className="max-w-3xl mx-auto">
        {players.map((player, index) => {
          let bgColor = 'bg-purple-500/50 text-white';

          if (index === 0) {
            bgColor = 'bg-[#e4e42c] text-white';
          } else if (index === 1) {
            bgColor = 'bg-[#c0c0c0] text-white';
          } else if (index === 2) {
            bgColor = 'bg-[#cd7f32] text-white';
          }

          return (
            <div
              key={index}
              className={`flex items-center justify-between p-4 mb-2 rounded-lg ${bgColor} transition-all hover:scale-105`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{index + 1}.</span>
                <span className="w-2"></span> {/* Separador */}
                <span className="text-xl">{player.username}</span>
              </div>
              <span className="text-2xl font-bold">
                {player.cash}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
