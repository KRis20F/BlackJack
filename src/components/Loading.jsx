import React from 'react';
import flip from '../assets/Cards/flip.gif';

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-indigo-900/95 z-[999999]">
            <div className="text-center">
                <div className="relative">
                    <img 
                        src={flip} 
                        alt="loading" 
                        className="w-32 h-32 mx-auto mb-4"
                    />
                </div>
                <div className="font-['Press_Start_2P'] text-white text-xl">
                    Loading
                    <span className="animate-[blink_1s_steps(1)_infinite]">...</span>
                </div>
                <div className="mt-4 w-64 h-4 bg-white/20 rounded-full overflow-hidden border-2 border-white">
                    <div className="h-full bg-white animate-[progress_2s_ease-in-out_infinite] rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
