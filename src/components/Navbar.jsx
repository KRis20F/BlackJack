import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import useGameController from './GameController';

const Navbar = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isGamePage = location.pathname === '/game';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const { playAgainHandler } = useGame();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setIsAuthenticated(!!userId);
    
    // Fetch username if authenticated
    if (userId) {
      fetch(`http://alvarfs-001-site1.qtempurl.com/User/${userId}`)
        .then(response => response.json())
        .then(data => {
          if (data.username) {
            setUsername(data.username);
          }
        })
        .catch(error => console.error('Error fetching username:', error));
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('playerCash');
    localStorage.removeItem('gamePhase');
    localStorage.removeItem('betCash');
    setIsAuthenticated(false);
    navigate('/');
  };

  const normalNavbar = (
    <div className="min-h-screen flex flex-col" role='navigation'>
      <nav className="bg-[#301d79] fixed w-full z-[999999] top-0 start-0 border-b-4 border-white">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-9">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-4xl font-['Press_Start_2P'] text-[#e4e42c]">BlckJck</span>
          </Link>
          
          <div className="flex md:order-2 space-x-4 md:space-x-4 rtl:space-x-reverse items-center">
            {isAuthenticated ? (
              <>
                <span className="text-white font-['Press_Start_2P'] text-sm hidden md:block">
                  {username}
                </span>
                <button
                  onClick={handleLogout}
                  className="block py-2 px-3 text-[#e0366c] text-hover-yellow rounded-sm md:p-0 font-['Press_Start_2P'] text-sm hover:text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 px-3 text-[#67ed67] text-hover-yellow rounded-sm md:p-0 font-['Press_Start_2P'] text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 px-3 text-[#e0366c] text-hover-yellow rounded-sm md:p-0 font-['Press_Start_2P'] text-sm"
                >
                  Register
                </Link>
              </>
            )}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden 
                       hover:bg-indigo-800 border-2 border-white"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
            </button>
          </div>

          <div className={`items-center justify-between ${isMenuOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`}>
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-['Press_Start_2P'] text-sm border-2 border-white rounded-lg 
                         bg-[#301d79] md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <li>
                <Link 
                  to={isAuthenticated ? "/game" : "/login"} 
                  className="block py-2 px-3 text-white text-hover-yellow rounded-sm md:p-0"
                >
                  Play
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="block py-2 px-3 text-white text-hover-yellow rounded-sm md:p-0">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/tutorial" className="block py-2 px-3 text-white text-hover-yellow rounded-sm md:p-0">
                  Tutorial
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link to="/stats" className="block py-2 px-3 text-white text-hover-yellow rounded-sm md:p-0">
                    Stats
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <main className="flex-1 pt-20">
        {children}
      </main>
    </div>
  );

  const { playerCash, betCash } = useGameController();

  const gameNavbar = (
    <div className="min-h-screen flex">
      
      <main className="flex-1">
        {children}
      </main>
      <nav className="fixed right-0 top-0 h-full w-[200px] bg-indigo-900/80 border-l-4 border-white flex flex-col items-center py-8 space-y-6 z-[999999]">
        <div className="font-['Press_Start_2P'] text-white text-xl mb-8 tracking-wider drop-shadow-[2px_2px_#000]">
          Menu
        </div>
        
        <div className="text-white font-['Press_Start_2P'] text-sm mb-4">
          {username}
        </div>

        {playAgainHandler && (
          <button
            onClick={playAgainHandler}
            className="w-32 py-2 px-4 bg-green-600 text-white border-2 border-white 
                     font-['Press_Start_2P'] text-sm uppercase tracking-wide
                     shadow-[inset_-3px_-3px_0_0_#006400,inset_3px_3px_0_0_#90EE90]
                     hover:scale-105 hover:bg-green-500 active:scale-95
                     transition-all duration-100 ease-in-out
                     active:shadow-[inset_3px_3px_0_0_#006400,inset_-3px_-3px_0_0_#90EE90]"
          >
            Play Again
          </button>
        )}
        
        <Link
          to="/"
          onClick={() => {
            localStorage.removeItem('gamePhase');
            localStorage.removeItem('betCash');
          }}
          className="w-32 py-2 px-4 bg-indigo-600 text-white border-2 border-white 
                   font-['Press_Start_2P'] text-sm uppercase tracking-wide
                   shadow-[inset_-3px_-3px_0_0_#1a1a6c,inset_3px_3px_0_0_#6666ff]
                   hover:scale-105 hover:bg-indigo-500 active:scale-95
                   transition-all duration-100 ease-in-out
                   active:shadow-[inset_3px_3px_0_0_#1a1a6c,inset_-3px_-3px_0_0_#6666ff]"
        >
          Go Back
        </Link>

        <button
          onClick={handleLogout}
          className="w-32 py-2 px-4 bg-red-600 text-white border-2 border-white 
                   font-['Press_Start_2P'] text-sm uppercase tracking-wide
                   shadow-[inset_-3px_-3px_0_0_#8b0000,inset_3px_3px_0_0_#ff6666]
                   hover:scale-105 hover:bg-red-500 active:scale-95
                   transition-all duration-100 ease-in-out
                   active:shadow-[inset_3px_3px_0_0_#8b0000,inset_-3px_-3px_0_0_#ff6666]"
        >
          Logout
        </button>
        {/* Money Information: bottom right, always visible on /game */}
        <div className="fixed right-6 bottom-6 bg-indigo-800/90 px-5 py-3 rounded-lg border-2 border-white text-white font-['Press_Start_2P'] text-base z-[10001] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] pointer-events-none select-none flex flex-col items-end">
          <span>Cash: ${playerCash}</span>
        </div>
      </nav>
    </div>
  );

  return isGamePage ? gameNavbar : normalNavbar;
};

export default Navbar;
