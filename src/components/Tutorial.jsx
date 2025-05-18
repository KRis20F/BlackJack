import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import before from '../assets/Website/index.png';
import round1 from '../assets/Website/index.png';
import round2 from '../assets/Website/index.png';
import Loading from './Loading';

export default function Tutorial() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {isLoading && <Loading />}
            <div className="min-h-screen flex">
                <div className="flex-1 flex items-center justify-center text-white">
                    <div className="space-y-12 px-6">
                        <h1 className="text-5xl font-['Press_Start_2P'] text-center leading-relaxed">
                            How to play and <span className="text-[#67ed67]">win</span>.
                        </h1>
                        <p className="text-center font-['Press_Start_2P'] text-sm text-gray-300">
                            Get familiar with each stage of the game before placing your bets!
                        </p>
                    </div>
                </div>
            </div>

            <hr className="border-t-4 border-white my-12 w-full" />

            {/* ROUND 0 */}
            <section className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto px-6 py-6">
                <img src={before} alt="Before Start" className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-10" />
                <div className="text-white font-['Press_Start_2P'] text-sm leading-relaxed text-center md:text-left">
                    <h2 className="text-xl mb-4 text-[#e4e42c]">Round 0 - Before Starting</h2>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>No cards are in play.</li>
                        <li>The player can only click chips into the betting area.</li>
                        <li>The <span className="text-[#67ed67]">START</span> button appears only if there is at least one chip placed.</li>
                        <li>Once you press <span className="text-[#67ed67]">START</span>, the game proceeds to <span className="text-[#e0366c]">Round 1</span>.</li>
                    </ul>
                </div>
            </section>

            <hr className="border-t-4 border-white my-12 w-full" />

            {/* RONDA 1 */}
            <section className="flex flex-col md:flex-row-reverse items-center justify-between max-w-5xl mx-auto px-6 py-6">
                <img src={round1} alt="Round 1" className="w-full md:w-1/2 mb-8 md:mb-0 md:ml-10" />
                <div className="text-white font-['Press_Start_2P'] text-sm leading-relaxed text-center md:text-left">
                    <h2 className="text-xl mb-4 text-[#67ed67]">Ronda 1 - Elige tu Acción</h2>
                    <p>
                        Recibirás tus dos primeras cartas junto al.<br />
                        Luego podrás elegir entre:
                        <br /><br />
                        HIT - Pide otra carta<br />
                        STAND - Te plantas<br />
                        DOUBLE - Doblas tu apuesta y recibes una sola carta<br />
                        SPLIT - Separas tus cartas en dos manos si son iguales<br />
                        DROP - Te retiras sin jugar esta ronda
                    </p>
                </div>
            </section>

            <hr className="border-t-4 border-white my-12 w-full" />

            {/* RONDAS SIGUIENTES */}
            <section className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto px-6 py-6">
                <img src={round2} alt="Round 2+" className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-10" />
                <div className="text-white font-['Press_Start_2P'] text-sm leading-relaxed text-center md:text-left">
                    <h2 className="text-xl mb-4 text-[#e0366c]">Ronda 2+</h2>
                    <p>
                        Cada carta nueva puede acercarte a 21... o hacerte perder.<br />
                        Si superas 21, pierdes automáticamente.<br /><br />
                        Si decides plantarte, el crupier jugará su mano y se comparan los resultados.
                        <br /><br />
                        ¡Buena suerte!
                    </p>
                </div>
            </section>
        </>
    );
}
