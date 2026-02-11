import React from 'react';
import Image from 'next/image';

interface WindowRetroProps {
    title: string;
    children: React.ReactNode;
    showFlowers?: boolean;
    flowerType?: 'lavender' | 'tulip' | 'daisy';
    className?: string;
}

export const WindowRetro: React.FC<WindowRetroProps> = ({
    title,
    children,
    showFlowers = true,
    flowerType = 'lavender',
    className = ''
}) => {
    return (
        <div className={`window-retro bg-[var(--color-cream)] border-[3px] border-[var(--color-pink-medium)] rounded-2xl shadow-[4px_4px_0px_var(--color-pink-soft),8px_8px_0px_rgba(0,0,0,0.05)] overflow-hidden relative ${className}`}>
            {/* Header */}
            <div className="window-header bg-gradient-to-b from-[var(--color-pink-soft)] to-[var(--color-pink-medium)] px-3 py-2 flex items-center border-b-2 border-[var(--color-pink-medium)]">
                <div className="window-controls flex gap-1.5 mr-3">
                    <span className="control minimize w-4 h-4 rounded-full flex items-center justify-center text-[10px] cursor-pointer border-2 border-black/10 bg-[var(--color-tulip-yellow)]">−</span>
                    <span className="control maximize w-4 h-4 rounded-full flex items-center justify-center text-[10px] cursor-pointer border-2 border-black/10 bg-[var(--color-green-soft)]">□</span>
                    <span className="control close w-4 h-4 rounded-full flex items-center justify-center text-[10px] cursor-pointer border-2 border-black/10 bg-[var(--color-tulip-pink)]">×</span>
                </div>
                <span className="window-title font-display text-[10px] text-[var(--color-brown-soft)] lowercase">{title}</span>
            </div>

            {/* Content */}
            <div className="window-content p-6 relative">
                {showFlowers && (
                    <>
                        <div className="flower-decoration top-left absolute top-2 left-2 opacity-60 pointer-events-none">
                            <Image
                                src={`/flowers/${flowerType}-corner.svg`}
                                alt=""
                                width={60}
                                height={60}
                            />
                        </div>
                        <div className="flower-decoration bottom-right absolute bottom-2 right-2 opacity-60 pointer-events-none">
                            <Image
                                src="/flowers/tulip-group.svg"
                                alt=""
                                width={80}
                                height={40}
                            />
                        </div>
                    </>
                )}
                {children}
            </div>
        </div>
    );
};
