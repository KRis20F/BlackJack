import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import Game from './components/Game';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import "./assets/css/index.css";
import "./assets/css/game.css";

function App() {
  return (
    <Router>
      <Navbar>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/game" element={<Game />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stats" element={<div className="min-h-screen flex items-center justify-center text-white font-['Press_Start_2P']">Statistics Coming Soon...</div>} />
        </Routes>
      </Navbar>
    </Router>
  );
}

export default App;
