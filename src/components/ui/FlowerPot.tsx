'use client';

import React, { useState } from 'react';
import { GardenMilestone } from '@/types';

interface FlowerPotProps {
    milestone: GardenMilestone;
    index: number;
}

const POT_COLORS: Record<string, { fill: string; stroke: string; soil: string }> = {
    reading: { fill: '#C8E6C9', stroke: '#81C784', soil: '#5D4037' },
    practice: { fill: '#F8BBD0', stroke: '#F06292', soil: '#5D4037' },
    mastery: { fill: '#FFF9C4', stroke: '#FFD54F', soil: '#5D4037' },
};

const FLOWER_COLORS = [
    // Reading row
    { petals: '#FFFFFF', center: '#FFD54F', leaves: '#66BB6A' },
    { petals: '#EF5350', center: '#FFEB3B', leaves: '#66BB6A' },
    { petals: '#FF9800', center: '#795548', leaves: '#66BB6A' },
    // Practice row
    { petals: '#E91E63', center: '#FFF9C4', leaves: '#66BB6A' },
    { petals: '#F48FB1', center: '#F06292', leaves: '#66BB6A' },
    { petals: '#FFCDD2', center: '#E91E63', leaves: '#66BB6A' },
    // Mastery row
    { petals: '#FF8F00', center: '#5D4037', leaves: '#66BB6A' },
    { petals: '#CE93D8', center: '#FFF9C4', leaves: '#66BB6A' },
    { petals: '#FFD54F', center: '#FF6F00', leaves: '#66BB6A' },
];

const PETAL_COUNTS = [6, 5, 8, 5, 7, 5, 6, 6, 8];

function FlowerHead({ colorIdx, cx, cy }: { colorIdx: number; cx: number; cy: number }) {
    const colors = FLOWER_COLORS[colorIdx] || FLOWER_COLORS[0];
    const petalCount = PETAL_COUNTS[colorIdx] || 6;
    const petalR = 7;
    const dist = 9;

    const petals = [];
    for (let i = 0; i < petalCount; i++) {
        const angle = (2 * Math.PI * i) / petalCount;
        const px = cx + dist * Math.cos(angle);
        const py = cy + dist * Math.sin(angle);
        petals.push(
            <ellipse
                key={i}
                cx={px}
                cy={py}
                rx={petalR}
                ry={petalR * 0.65}
                fill={colors.petals}
                stroke={colors.center}
                strokeWidth={0.5}
                transform={`rotate(${(angle * 180) / Math.PI} ${px} ${py})`}
            />
        );
    }

    return (
        <g>
            {petals}
            <circle cx={cx} cy={cy} r={5} fill={colors.center} />
        </g>
    );
}

export const FlowerPot: React.FC<FlowerPotProps> = ({ milestone, index }) => {
    const [hovered, setHovered] = useState(false);
    const potColor = POT_COLORS[milestone.category];
    const progressPct = Math.round(milestone.progress * 100);

    return (
        <g
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ cursor: 'pointer' }}
        >
            {/* Pot body */}
            <polygon
                points="20,55 60,55 56,80 24,80"
                fill={potColor.fill}
                stroke={potColor.stroke}
                strokeWidth={2}
            />
            {/* Pot rim */}
            <rect x="17" y="50" width="46" height="7" rx="2" fill={potColor.stroke} />
            {/* Soil arc */}
            <ellipse cx="40" cy="55" rx="18" ry="4" fill={potColor.soil} />

            {milestone.isUnlocked ? (
                <>
                    {/* Stem */}
                    <line x1="40" y1="55" x2="40" y2="22" stroke="#66BB6A" strokeWidth={2.5} />
                    {/* Left leaf */}
                    <ellipse cx="33" cy="42" rx="6" ry="3" fill="#81C784" transform="rotate(-30 33 42)" />
                    {/* Right leaf */}
                    <ellipse cx="47" cy="36" rx="6" ry="3" fill="#81C784" transform="rotate(25 47 36)" />
                    {/* Flower head */}
                    <FlowerHead colorIdx={index} cx={40} cy={18} />
                </>
            ) : (
                <>
                    {/* Faint sprout silhouette */}
                    <line x1="40" y1="55" x2="40" y2="38" stroke="#A5D6A7" strokeWidth={1.5} opacity={0.3} />
                    <ellipse cx="36" cy="44" rx="4" ry="2" fill="#A5D6A7" opacity={0.3} transform="rotate(-30 36 44)" />
                </>
            )}

            {/* Tooltip */}
            {hovered && (
                <g>
                    <rect x="0" y="-10" width="80" height="22" rx="4" fill="rgba(0,0,0,0.8)" />
                    <text x="40" y="1" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="sans-serif">
                        {milestone.label}
                    </text>
                    <text x="40" y="9" textAnchor="middle" fill="#ccc" fontSize="6" fontFamily="sans-serif">
                        {progressPct}%
                    </text>
                </g>
            )}
        </g>
    );
};
