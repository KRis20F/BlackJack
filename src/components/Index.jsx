import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import hero from '../assets/Website/index.png';
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
                            BlckJck<br/>Game
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

            <hr className="border-t-4 border-white my-12 w-full" />
            
            {/* SECCIÓN: LEADERBOARD */}
            <section className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto px-6 py-10">
            <img
                src="/assets/hero.png" // asegúrate que el path sea correcto
                alt="Leaderboard"
                className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-10"
            />
            <div className="text-white font-['Press_Start_2P'] text-sm leading-relaxed text-center md:text-left">
                <h2 className="text-xl mb-4 text-[#e4e42c]">¡Compite en el Leaderboard Global!</h2>
                <p>
                Cada partida que ganes suma puntos. Sube en el ranking global y gana premios semanales.<br />
                ¿Tienes lo que se necesita para llegar a la cima?
                </p>
            </div>
            </section>

            <hr className="border-t-4 border-white my-12 w-full" />

            {/* SECCIÓN: HOW TO PLAY */}
            <section className="flex flex-col md:flex-row items-center justify-between gap-12 px-8 py-16">
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-white text-2xl font-['Press_Start_2P'] mb-6">¿Tienes dudas?</h2>
                    <p className="text-white text-sm font-['Press_Start_2P'] mb-4">
                    Si no sabes cómo se juega o necesitas ayuda con las funciones del juego...
                    </p>
                    <button
                    className="bg-white text-indigo-900 border-2 border-white font-['Press_Start_2P'] text-xs px-6 py-3 
                                shadow-[inset_-2px_-2px_0_0_#1a1a6c,inset_2px_2px_0_0_#6666ff]
                                hover:bg-[#e4e42c] hover:text-black transition-all duration-100 uppercase"
                    >
                    ¡Haz clic aquí!
                    </button>
                </div>

                <div className="md:w-1/2">
                    <img src="/src/assets/images/hero.jpg" alt="How to Play" className="w-full rounded-lg border-4 border-white" />
                </div>
            </section>

        </>
    );
}
