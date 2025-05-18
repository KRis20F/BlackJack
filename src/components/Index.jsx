import React from 'react';
import { Link } from 'react-router-dom';
import hero from '../assets/Website/Index.png';
import leaderboard from '../assets/Website/chips.png';
import question from '../assets/Website/question.gif';

export default function Index() {
    return (
        <>
            <div className="min-h-screen flex">
                <div className="flex-1 flex items-center justify-center text-white">
                    <div className="space-y-12">
                        <h1 className="text-6xl font-['Press_Start_2P'] text-center leading-relaxed">
                            Go <span className="text-[#67ed67]">big</span> or <span className="text-[#e0366c]">bust</span>.
                        </h1>
                        
                        <div className="space-y-6 flex justify-center items-center">
                            <Link 
                                to="/game" 
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
            <section className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto px-6 py-6">
                <img
                    src={leaderboard}
                    alt="Leaderboard"
                    className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-10"
                />
                <div className="text-white font-['Press_Start_2P'] text-sm leading-relaxed text-center md:text-left">
                    <h2 className="text-xl mb-4 text-[#e4e42c]">Compete on the Global Leaderboard!</h2>
                    <p>
                        Each round you win earns you $. <br></br>
                        Climb the global rankings and win weekly prizes.<br></br><br></br>
                        Do you have what it takes to reach the top?
                    </p>
                    
                    <Link 
                        to="/leaderboard" 
                        className="mt-6 inline-block bg-white text-indigo-900 border-2 border-white font-['Press_Start_2P'] text-xs px-6 py-3 
                                shadow-[inset_-2px_-2px_0_0_#1a1a6c,inset_2px_2px_0_0_#6666ff]
                                hover:bg-[#e4e42c] hover:text-black transition-all duration-100 uppercase"
                    >
                        Check rankings!
                    </Link>
                </div>
            </section>

            <hr className="border-t-4 border-white my-12 w-full" />
            
            {/* SECCIÓN: HOW TO PLAY */}
            <section className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto px-6 py-6">
                <div className="text-white font-['Press_Start_2P'] text-sm leading-relaxed text-center md:text-left">
                    <h2 className="text-xl mb-4 text-[#e4e42c]">Got questions?</h2>
                    <p>
                        If you're not sure how to play or need help with the game's features...
                    </p>
                    <Link 
                        to="/tutorial" 
                        className="mt-6 inline-block bg-white text-indigo-900 border-2 border-white font-['Press_Start_2P'] text-xs px-6 py-3 
                                shadow-[inset_-2px_-2px_0_0_#1a1a6c,inset_2px_2px_0_0_#6666ff]
                                hover:bg-[#e4e42c] hover:text-black transition-all duration-100 uppercase"
                    >
                        Click here!
                    </Link>
                </div>
                <img
                    src={question}
                    alt="Question"
                    className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-10"
                />
            </section>
        </>
    );
}