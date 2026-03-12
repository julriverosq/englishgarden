import React from 'react';

export const PlantSproutIcon = ({ className = '', size = 48 }: { className?: string, size?: number }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className={className}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
    >
        {/* Dirt Mound */}
        <path 
            d="M 20 85 Q 50 65 80 85" 
            fill="var(--color-brown-soft)" 
            stroke="var(--color-brown-soft)" 
            strokeWidth="3" 
            strokeLinejoin="round" 
            className="opacity-90"
        />
        <path 
            d="M 25 85 L 75 85" 
            stroke="var(--color-brown-soft)" 
            strokeWidth="4" 
            strokeLinecap="round" 
        />
        
        {/* Stem */}
        <path 
            d="M 50 75 Q 45 55 55 40" 
            fill="none" 
            stroke="var(--color-green-medium)" 
            strokeWidth="4" 
            strokeLinecap="round" 
        />

        {/* Left Leaf */}
        <path 
            d="M 50 50 Q 25 35 30 20 Q 45 15 55 40 Z" 
            fill="var(--color-green-soft)" 
            stroke="var(--color-green-medium)" 
            strokeWidth="3" 
            strokeLinejoin="round" 
        />
        
        {/* Left Leaf Inner Detail */}
        <path 
            d="M 50 48 Q 35 32 30 20" 
            fill="none" 
            stroke="var(--color-green-medium)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            className="opacity-80"
        />

        {/* Right Leaf */}
        <path 
            d="M 55 40 Q 75 30 85 40 Q 80 55 52 46 Z" 
            fill="var(--color-green-soft)" 
            stroke="var(--color-green-medium)" 
            strokeWidth="3" 
            strokeLinejoin="round" 
        />
        
        {/* Right Leaf Inner Detail */}
        <path 
            d="M 55 43 Q 75 35 85 40" 
            fill="none" 
            stroke="var(--color-green-medium)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            className="opacity-80"
        />
    </svg>
);
