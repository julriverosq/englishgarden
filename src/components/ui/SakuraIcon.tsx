import React from 'react';

export const SakuraIcon = ({ className = '', size = 48 }: { className?: string, size?: number }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className={className}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
    >
        {/* Background Leaves */}
        <path 
            d="M 25 45 Q 10 40 5 50 Q 20 60 30 55 Z" 
            fill="var(--color-green-soft)" 
            stroke="var(--color-green-medium)" 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
        />
        <path 
            d="M 35 30 Q 20 15 25 20 Q 35 35 40 30 Z" 
            fill="var(--color-green-soft)" 
            stroke="var(--color-green-medium)" 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
        />
        <path 
            d="M 75 50 Q 90 60 85 70 Q 70 65 65 60 Z" 
            fill="var(--color-green-soft)" 
            stroke="var(--color-green-medium)" 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
        />

        {/* Stem for buds */}
        <path 
            d="M 50 60 Q 60 70 75 80" 
            fill="none" 
            stroke="var(--color-green-medium)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
        />
        <path 
            d="M 50 60 Q 55 75 60 85" 
            fill="none" 
            stroke="var(--color-green-medium)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
        />

        {/* Bud 1 (Right) */}
        <path 
            d="M 72 75 Q 85 75 80 90 Q 75 95 68 90 Q 65 80 72 75 Z" 
            fill="var(--color-pink-soft)" 
            stroke="var(--color-pink-medium)" 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
        />
        <path 
            d="M 75 75 Q 73 85 75 92" 
            fill="none" 
            stroke="var(--color-pink-medium)" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            className="opacity-60"
        />

        {/* Bud 2 (Left) */}
        <path 
            d="M 58 80 Q 70 80 65 95 Q 60 100 55 95 Q 52 85 58 80 Z" 
            fill="var(--color-pink-soft)" 
            stroke="var(--color-pink-medium)" 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
        />
        <path 
            d="M 61 80 Q 59 90 61 97" 
            fill="none" 
            stroke="var(--color-pink-medium)" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            className="opacity-60"
        />

        {/* Top/Back Flower */}
        <path 
            d="M 45 40 
               C 35 30 45 15 55 20
               C 65 10 75 20 70 30
               C 85 25 90 40 80 45
               C 95 55 80 70 70 60
               C 65 75 50 70 55 55
               C 40 65 30 50 45 40 Z" 
            fill="var(--color-pink-soft)" 
            stroke="var(--color-pink-medium)" 
            strokeWidth="3" 
            strokeLinejoin="round" 
        />
        
        {/* Top/Back Flower Details */}
        <path 
            d="M 55 20 C 58 28 62 25 60 35 M 70 30 C 65 35 68 38 62 42 M 80 45 C 72 45 70 42 65 46 M 70 60 C 65 52 68 48 62 48 M 55 55 C 55 45 60 48 60 42" 
            fill="none" 
            stroke="var(--color-pink-medium)" 
            strokeWidth="2" 
            strokeLinecap="round"
            className="opacity-50"
        />
        {/* Top/Back Flower Center Dots */}
        <circle cx="62" cy="38" r="1.5" fill="var(--color-pink-accent)" />
        <circle cx="65" cy="40" r="1.5" fill="var(--color-pink-accent)" />
        <circle cx="60" cy="42" r="1.5" fill="var(--color-pink-accent)" />
        <circle cx="63" cy="44" r="1.5" fill="var(--color-pink-accent)" />

        {/* Front Main Flower */}
        <path 
            d="M 35 55 
               C 20 40 35 25 45 35
               C 55 20 70 35 60 45
               C 75 45 80 65 65 70
               C 70 85 50 85 50 75
               C 35 85 20 75 35 55 Z" 
            fill="var(--color-cream)" 
            stroke="var(--color-pink-medium)" 
            strokeWidth="3" 
            strokeLinejoin="round" 
        />
        <path 
            d="M 35 55 
               C 20 40 35 25 45 35
               C 55 20 70 35 60 45
               C 75 45 80 65 65 70
               C 70 85 50 85 50 75
               C 35 85 20 75 35 55 Z" 
            fill="var(--color-pink-soft)" 
            stroke="none"
            className="opacity-70"
        />

        {/* Front Main Flower Details */}
        <path 
            d="M 45 35 C 45 45 50 42 48 50 M 60 45 C 52 48 55 52 48 55 M 65 70 C 55 65 52 68 48 60 M 50 75 C 48 65 45 68 45 60 M 35 55 C 42 55 45 58 48 52" 
            fill="none" 
            stroke="var(--color-pink-medium)" 
            strokeWidth="2" 
            strokeLinecap="round"
            className="opacity-50"
        />
        {/* Front Main Flower Center Dots */}
        <circle cx="48" cy="52" r="1.5" fill="var(--color-pink-accent)" />
        <circle cx="52" cy="54" r="1.5" fill="var(--color-pink-accent)" />
        <circle cx="46" cy="56" r="1.5" fill="var(--color-pink-accent)" />
        <circle cx="50" cy="58" r="1.5" fill="var(--color-pink-accent)" />

    </svg>
);
