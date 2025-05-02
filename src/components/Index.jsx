import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import hero from '../assets/svg/hero.svg';
import Loading from './Loading';

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {isLoading && <Loading />}
            <div className="min-h-screen flex">
                <div className="flex-1 flex items-center justify-center text-white">
                    <div className="space-y-12">
                        <h1 className="text-6xl font-['Press_Start_2P'] text-center leading-relaxed">
                            BlackJack<br/>Game
                        </h1>
                        
                        <div className="space-y-6 flex justify-center items-center">
                            <Link 
                                to="/login" 
                                className="m-0 block w-64 py-4 px-8 bg-indigo-600 text-white border-2 border-white 
                                         font-['Press_Start_2P'] text-lg uppercase text-center tracking-wide
                                         shadow-[inset_-4px_-4px_0_0_#1a1a6c,inset_4px_4px_0_0_#6666ff]
                                         hover:scale-105 hover:bg-indigo-500 
                                         transition-all duration-100 ease-in-out
                                         active:shadow-[inset_4px_4px_0_0_#1a1a6c,inset_-4px_-4px_0_0_#6666ff]
                                         active:scale-95"
                            >
                                Play Now
                            </Link>
                            
                            <Link 
                                to="/register" 
                                className="block w-64 py-4 px-8 bg-indigo-600 text-white border-2 border-white 
                                         font-['Press_Start_2P'] text-lg uppercase text-center tracking-wide
                                         shadow-[inset_-4px_-4px_0_0_#1a1a6c,inset_4px_4px_0_0_#6666ff]
                                         hover:scale-105 hover:bg-indigo-500 
                                         transition-all duration-100 ease-in-out
                                         active:shadow-[inset_4px_4px_0_0_#1a1a6c,inset_-4px_-4px_0_0_#6666ff]
                                         active:scale-95"
                            >
                                Statistics
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <img 
                        src={hero} 
                        alt="Hero" 
                        
                    />
                </div>
            </div>
        </>
    );
}
