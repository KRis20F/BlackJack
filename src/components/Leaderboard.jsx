import React from 'react';

export default function Leaderboard() {
  const players = [
    { name: "PLAYER NAME", score: 58 },
    { name: "PLAYER NAME", score: 56 },
    { name: "PLAYER NAME", score: 55 },
    { name: "PLAYER NAME", score: 50 },
    { name: "PLAYER NAME", score: 49 },
    { name: "PLAYER NAME", score: 46 },
    { name: "PLAYER NAME", score: 44 },
    { name: "PLAYER NAME", score: 42 },
    { name: "PLAYER NAME", score: 40 },
    { name: "PLAYER NAME", score: 38 }
  ];

  return (
    <div className="min-h-screen bg-indigo-900/95 p-8 font-['Press_Start_2P']">
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
        {players.map((player, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-4 mb-2 rounded-lg ${
              index < 3
                ? 'bg-purple-500/50 text-white'
                : 'bg-indigo-800/50 text-purple-200'
            } transition-all hover:scale-105`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl w-8">{index + 1}</span>
              <div className="w-8 h-8 bg-purple-300 rounded-full"></div>
              <span className="text-xl">{player.name}</span>
            </div>
            <span className="text-2xl font-bold">
              {player.score}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-purple-300/50">
        <div className="w-12 h-12 mx-auto mb-4 border-2 border-dashed border-purple-300/30"></div>
        <p>www.blackjackmasters.com</p>
      </div>
    </div>
  );
} 