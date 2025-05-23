import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import Game from './components/Game';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Leaderboard from './components/Leaderboard';
import Tutorial from './components/Tutorial';
import ProtectedRoute from './components/ProtectedRoute';
import { GameProvider } from './context/GameContext';
import "./assets/css/index.css";
import "./assets/css/game.css";

function App() {
  return (
    <GameProvider>
      <Router>
        <Navbar>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/tutorial" element={<Tutorial />} />

            {/* Rutas protegidas */}
            <Route 
              path="/game" 
              element={
                <ProtectedRoute>
                  <Game />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/stats" 
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex items-center justify-center text-white font-['Press_Start_2P']">
                    Statistics Coming Soon...
                  </div>
                </ProtectedRoute>
              } 
            />

            {/* Ruta para manejar URLs no encontradas */}
            <Route path="*" element={<Index />} />
          </Routes>
        </Navbar>
      </Router>
    </GameProvider>
  );
}

export default App;
