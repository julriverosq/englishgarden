import React from 'react';

export const RetroLoading = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="bg-[var(--color-cream)] border-[3px] border-[var(--color-pink-medium)] rounded-xl py-3 px-6 shadow-[4px_4px_0px_var(--color-pink-soft)] flex flex-col items-center gap-3">
                <span className="font-display text-[10px] text-[var(--color-brown-soft)] lowercase tracking-widest animate-pulse">
                    loading...
                </span>
                
                {/* Outer empty bar */}
                <div className="w-48 h-5 border-2 border-[var(--color-pink-medium)] bg-[var(--color-bg-secondary)] rounded-sm p-[2px] overflow-hidden flex relative">
                    {/* Inner blocks that animate left to right */}
                    <div 
                        className="h-full bg-[var(--color-pink-accent)] gap-[2px] grid grid-cols-[repeat(10,1fr)] w-full absolute left-0 top-[2px] bg-clip-content"
                    >
                        {[...Array(10)].map((_, i) => (
                            <div 
                                key={i} 
                                className="h-full bg-[var(--color-pink-medium)] animate-[loading-blocks_1.5s_ease-in-out_infinite]"
                                style={{
                                    animationDelay: `${i * 0.15}s`,
                                    opacity: 0,
                                }}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
