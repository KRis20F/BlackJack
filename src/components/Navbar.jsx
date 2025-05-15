import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import add from '../assets/svg/add.svg';
import user from '../assets/svg/user.svg';

const Navbar = ({ children }) => {
  const location = useLocation();
  const isGamePage = location.pathname === '/game';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const normalNavbar = (
    <div className="min-h-screen flex flex-col" role='navigation'>
      <nav className="bg-[#301d79] fixed w-full z-[999999] top-0 start-0 border-b-4 border-white">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-9">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-4xl font-['Press_Start_2P'] text-[#e4e42c]">BlckJck</span>
          </Link>
          
          <div className="flex md:order-2 space-x-4 md:space-x-4 rtl:space-x-reverse">
            <Link
              to="/login"
              className="block py-2 px-3 text-white text-hover-yellow rounded-sm md:p-0 font-['Press_Start_2P'] text-sm"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block py-2 px-3 text-white text-hover-yellow rounded-sm md:p-0 font-['Press_Start_2P'] text-sm"
            >
              Register
            </Link>

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
                <Link to="/game" className="block py-2 px-3 text-white text-hover-yellow rounded-sm md:p-0">
                  Play
                </Link>
              </li>
              <li>
                <Link to="/stats" className="block py-2 px-3 text-white text-hover-yellow rounded-sm md:p-0">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/tutorial" className="block py-2 px-3 text-white text-hover-yellow rounded-sm md:p-0">
                  Tutorial
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="flex-1 pt-20">
        {children}
      </main>
    </div>
  );

  const gameNavbar = (
    <div className="min-h-screen flex">
      <main className="flex-1">
        {children}
      </main>
      <nav className="fixed right-0 top-0 h-full w-[200px] bg-indigo-900/80 border-l-4 border-white flex flex-col items-center py-8 space-y-6 z-[999999]">
        <div className="font-['Press_Start_2P'] text-white text-xl mb-8 tracking-wider drop-shadow-[2px_2px_#000]">
          Menu
        </div>
        
        {['Home', 'Leaderboard', 'Tutorial'].map((text) => (
          <button
            key={text}
            className="w-32 py-2 px-4 bg-indigo-600 text-white border-2 border-white 
                     font-['Press_Start_2P'] text-sm uppercase tracking-wide
                     shadow-[inset_-3px_-3px_0_0_#1a1a6c,inset_3px_3px_0_0_#6666ff]
                     hover:scale-105 hover:bg-indigo-500 active:scale-95
                     transition-all duration-100 ease-in-out
                     active:shadow-[inset_3px_3px_0_0_#1a1a6c,inset_-3px_-3px_0_0_#6666ff]"
          >
            {text}
          </button>
        ))}
      </nav>
    </div>
  );

  return isGamePage ? gameNavbar : normalNavbar;
};

export default Navbar;
