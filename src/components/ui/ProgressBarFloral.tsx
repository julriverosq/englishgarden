import React from 'react';

interface ProgressBarFloralProps {
    progress: number;
    label?: string;
    feedback?: string | null;
}

export const ProgressBarFloral: React.FC<ProgressBarFloralProps> = ({ progress, label = "loading...", feedback }) => {
    return (
        <div className="progress-container flex flex-col w-full">
            <div className="flex justify-between items-end mb-2 w-full">
                <div className="progress-label font-display text-[10px] text-[var(--color-brown-soft)]">{label}</div>
                {feedback && (
                    <div className="font-display text-[9px] text-[var(--color-pink-accent)] text-right">
                        {feedback}
                    </div>
                )}
            </div>
            <div className="relative w-full h-4 mt-2 mb-2 flex items-center">
                {/* Background track line */}
                <div className="absolute w-full h-2 bg-[#F6E1CC] border-2 border-[#5C4532] rounded-full"></div>
                
                {/* Filled progress line */}
                <div 
                    className="absolute h-2 bg-[var(--color-lavender-medium)] border-2 border-[#5C4532] border-r-0 rounded-l-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(2, progress)}%` }}
                ></div>

                {/* Flower indicator (matches the position of the progress) */}
                <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out flex items-center justify-center z-10"
                    style={{ left: `${Math.max(2, progress)}%` }}
                >
                    <div className="w-8 h-8 flex items-center justify-center filter drop-shadow-[0_2px_0_rgba(92,69,50,1)]">
                        <img 
                            src="/flowers/tulip-group.svg" 
                            alt="flower indicator" 
                            className="w-full h-full object-contain drop-shadow-md"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
