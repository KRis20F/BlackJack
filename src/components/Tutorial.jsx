import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import trophy from '../assets/Website/trophy.gif';
import before from '../assets/Website/round0.png';
import round1 from '../assets/Website/round1.png';
import drop from '../assets/Website/drop.gif';
import double from '../assets/Website/double.gif';
import round2 from '../assets/Website/round2.png';
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
            <div className="min-h-screen flex relative overflow-hidden">
                <div className="flex-1 flex items-center justify-center text-white relative z-10 translate-x-4 md:translate-x-30">
                    <div className="space-y-12 px-6">
                        <h1 className="text-5xl font-['Press_Start_2P'] text-center leading-relaxed">
                            How to <span className="text-[#e4e42c]">play</span> and <span className="text-[#67ed67]">win</span>.
                        </h1>
                        <p className="text-center font-['Press_Start_2P'] text-sm text-[#c0c0c0]">
                            Get familiar with each stage of the game before placing your bets!
                        </p>
                    </div>
                </div>

                <img
                    src={trophy}
                    alt="trophy"
                    className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-10 relative z-0 object-contain"
                />
            </div>

            <hr className="border-t-4 border-white my-12 w-full" />

            {/* ROUND 0 */}
            <section className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto px-6 py-6">
                <img src={before} alt="Before Start" className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-10" />
                <div className="text-white font-['Press_Start_2P'] text-sm leading-relaxed text-center md:text-left">
                    <h2 className="text-xl mb-4 text-[#e4e42c]">Round 0 - Before Starting</h2>
                    <ul className="list-disc pl-6 space-y-3">
                        <li>No cards are in play.</li>
                        <li>The player can only place chips in the betting area.</li>
                        <li>The <span className="text-[#67ed67]">START</span> button only appears if there's at least one chip placed.</li>
                        <li>Once you press <span className="text-[#67ed67]">START</span>, the game moves to <span className="text-[#e4e42c]">Round 1</span>.</li>
                    </ul>
                </div>
            </section>

            <hr className="border-t-4 border-white my-12 w-full" />

            {/* ROUND 1 */}
            <section className="flex flex-col md:flex-row-reverse items-center justify-between max-w-5xl mx-auto px-6 py-6">
                <img src={round1} alt="Round 1" className="w-full md:w-1/2 mb-8 md:mb-0 md:ml-10" />
                <div className="text-white font-['Press_Start_2P'] text-sm leading-relaxed text-center md:text-left">
                    <h2 className="text-xl mb-4 text-[#e4e42c]">Round 1 - Decision Making</h2>
                    <p>
                        You’ll receive your first two cards along with the dealer.<br />
                        Then you can choose between:
                        <br /><br />
                        <div>
                            <h3 className="text-lg mb-4 text-[#67ed67]">HIT</h3>
                            <p className='mb-8'>
                                Draw one additional card.<br />
                            </p>
                            <h3 className="text-lg mb-4 text-[#67ed67]">STAND</h3>
                            <p>
                                Stick with your current score.<br />
                            </p>
                        </div>
                    </p>
                </div>
            </section>

            {/* DROP */}
            <section className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto px-6 py-6">
                <img
                    src={drop}
                    alt="drop"
                    className="w-full md:w-1/2 mb-8 md:mb-0 md:ml-10"
                />
                
                <div className="text-white font-['Press_Start_2P'] text-sm leading-relaxed space-y-8 text-center md:text-left">
                    <div>
                        <h3 className="text-lg mb-4 text-[#e0366c]">DROP</h3>
                        <p className='mb-2'>
                            You voluntarily withdraw and recover part of your bet:<br />
                        </p>
                        <ul className="list-disc pl-6 space-y-3">
                            <li>In the initial round, you recover <span className="text-[#e4e42c]">50%</span>.</li>
                            <li>For each extra card drawn, the recoverable value <span className="text-[#e0366c]">decreases progressively.</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* DOUBLE */}
            <section className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto px-6">
                <div className="text-white font-['Press_Start_2P'] text-sm leading-relaxed space-y-8 text-center md:text-left">
                    <div>
                        <h3 className="text-lg mb-4 text-[#c0c0c0]">DOUBLE</h3>
                        <ul className="list-disc pl-6 space-y-3">
                            <li>You <span className="text-[#c0c0c0]">DOUBLE</span> your initial bet.</li>
                            <li>You receive only one more card.</li>
                            <li><span className="text-[#e4e42c]">Your turn ends automatically.</span></li>
                        </ul>
                    </div>
                </div>
                <img
                    src={double}
                    alt="double"
                    className="w-full md:w-1/2 mb-8 md:mb-0 md:ml-10"
                />
            </section>

            <hr className="border-t-4 border-white my-12 w-full" />

            {/* LATER ROUNDS */}
            <section className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto px-6 py-6">
                <img src={round2} alt="Round 2+" className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-10" />
                <div className="text-white font-['Press_Start_2P'] text-sm leading-relaxed text-center md:text-left">
                    <h2 className="text-xl mb-4 text-[#e4e42c]">Round 2+</h2>
                    <p>
                        Each new card may bring you <span className="text-[#67ed67]">closer to 21</span>... <span className="text-[#e0366c]">or make you lose.</span><br/><br />
                        If you go over 21, you automatically lose.<br /><br />
                        If you choose to <span className="text-[#67ed67]">STAND</span>, the dealer will play their hand and results will be compared.
                        <br /><br />
                        <span className="text-[#e4e42c]">Good luck!</span>
                    </p>
                </div>
            </section>
        </>
    );
}
