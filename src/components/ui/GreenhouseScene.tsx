'use client';

import React from 'react';
import { GardenMilestone } from '@/types';
import { FlowerPot } from './FlowerPot';

interface GreenhouseSceneProps {
    milestones: GardenMilestone[];
}

export const GreenhouseScene: React.FC<GreenhouseSceneProps> = ({ milestones }) => {
    const shelfY = [190, 340, 490];
    const potXOffsets = [70, 200, 330];
    const shelfLabels = ['Reading', 'Practice', 'Mastery'];

    return (
        <svg
            viewBox="0 0 500 700"
            width="100%"
            height="100%"
            style={{ maxWidth: '500px', display: 'block', margin: '0 auto' }}
        >
            <defs>
                <radialGradient id="greenhouse-glow" cx="50%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#FFFDE7" stopOpacity={0.8} />
                    <stop offset="60%" stopColor="#F1F8E9" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#E8F5E9" stopOpacity={0} />
                </radialGradient>
                <linearGradient id="glass-panel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E3F2FD" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#B3E5FC" stopOpacity={0.08} />
                </linearGradient>
                {/* Leaf shape for reuse */}
                <ellipse id="leaf-sm" cx="0" cy="0" rx="7" ry="4" />
                <ellipse id="leaf-md" cx="0" cy="0" rx="9" ry="5" />
                <ellipse id="leaf-lg" cx="0" cy="0" rx="11" ry="6" />
            </defs>

            {/* Background glow */}
            <rect x="0" y="0" width="500" height="700" fill="url(#greenhouse-glow)" />

            {/* Arched glass window frame */}
            <path
                d="M 60 650 L 60 180 Q 60 40 250 40 Q 440 40 440 180 L 440 650 Z"
                fill="url(#glass-panel)"
                stroke="#4A5568"
                strokeWidth={5}
            />

            {/* Cross-bars (vertical) */}
            <line x1="250" y1="40" x2="250" y2="650" stroke="#4A5568" strokeWidth={2.5} opacity={0.5} />
            {/* Cross-bars (horizontal) */}
            <line x1="60" y1="180" x2="440" y2="180" stroke="#4A5568" strokeWidth={2} opacity={0.4} />
            <line x1="60" y1="330" x2="440" y2="330" stroke="#4A5568" strokeWidth={2} opacity={0.4} />
            <line x1="60" y1="480" x2="440" y2="480" stroke="#4A5568" strokeWidth={2} opacity={0.4} />

            {/* Faint glass panels */}
            <path d="M 61 180 L 61 650 L 249 650 L 249 180 Q 249 42 155 72 Q 61 110 61 180Z" fill="#E8F5E9" opacity={0.06} />
            <path d="M 251 180 L 251 650 L 439 650 L 439 180 Q 439 42 345 72 Q 251 110 251 180Z" fill="#E3F2FD" opacity={0.06} />

            {/* ===== LEFT VINE - long cascading vine from top to bottom ===== */}
            <g opacity={0.55}>
                <path
                    d="M 72 60 Q 55 110 68 160 Q 80 210 62 270 Q 48 320 70 380 Q 85 430 65 490 Q 50 540 72 600 Q 80 630 75 650"
                    fill="none" stroke="#66BB6A" strokeWidth={2.5}
                />
                {/* Leaves along the left vine */}
                <use href="#leaf-md" x="58" y="90" fill="#A5D6A7" transform="rotate(-25 58 90)" />
                <use href="#leaf-sm" x="70" y="130" fill="#C8E6C9" transform="rotate(20 70 130)" />
                <use href="#leaf-md" x="55" y="170" fill="#81C784" transform="rotate(-15 55 170)" />
                <use href="#leaf-sm" x="75" y="210" fill="#A5D6A7" transform="rotate(30 75 210)" />
                <use href="#leaf-lg" x="58" y="260" fill="#C8E6C9" transform="rotate(-20 58 260)" />
                <use href="#leaf-sm" x="72" y="300" fill="#81C784" transform="rotate(15 72 300)" />
                <use href="#leaf-md" x="52" y="340" fill="#A5D6A7" transform="rotate(-30 52 340)" />
                <use href="#leaf-sm" x="78" y="390" fill="#C8E6C9" transform="rotate(25 78 390)" />
                <use href="#leaf-md" x="60" y="440" fill="#81C784" transform="rotate(-10 60 440)" />
                <use href="#leaf-sm" x="68" y="485" fill="#A5D6A7" transform="rotate(20 68 485)" />
                <use href="#leaf-lg" x="55" y="530" fill="#C8E6C9" transform="rotate(-25 55 530)" />
                <use href="#leaf-sm" x="75" y="580" fill="#81C784" transform="rotate(15 75 580)" />
                <use href="#leaf-md" x="70" y="625" fill="#A5D6A7" transform="rotate(10 70 625)" />
            </g>

            {/* ===== RIGHT VINE - long cascading vine ===== */}
            <g opacity={0.55}>
                <path
                    d="M 428 60 Q 445 115 432 165 Q 418 215 438 275 Q 452 325 430 385 Q 415 435 435 495 Q 450 545 428 605 Q 420 635 425 650"
                    fill="none" stroke="#66BB6A" strokeWidth={2.5}
                />
                <use href="#leaf-md" x="442" y="95" fill="#A5D6A7" transform="rotate(25 442 95)" />
                <use href="#leaf-sm" x="430" y="135" fill="#C8E6C9" transform="rotate(-20 430 135)" />
                <use href="#leaf-md" x="445" y="180" fill="#81C784" transform="rotate(15 445 180)" />
                <use href="#leaf-sm" x="425" y="225" fill="#A5D6A7" transform="rotate(-30 425 225)" />
                <use href="#leaf-lg" x="442" y="270" fill="#C8E6C9" transform="rotate(20 442 270)" />
                <use href="#leaf-sm" x="428" y="310" fill="#81C784" transform="rotate(-15 428 310)" />
                <use href="#leaf-md" x="448" y="355" fill="#A5D6A7" transform="rotate(30 448 355)" />
                <use href="#leaf-sm" x="422" y="400" fill="#C8E6C9" transform="rotate(-25 422 400)" />
                <use href="#leaf-md" x="440" y="445" fill="#81C784" transform="rotate(10 440 445)" />
                <use href="#leaf-sm" x="432" y="490" fill="#A5D6A7" transform="rotate(-20 432 490)" />
                <use href="#leaf-lg" x="445" y="535" fill="#C8E6C9" transform="rotate(25 445 535)" />
                <use href="#leaf-sm" x="425" y="585" fill="#81C784" transform="rotate(-15 425 585)" />
                <use href="#leaf-md" x="430" y="630" fill="#A5D6A7" transform="rotate(-10 430 630)" />
            </g>

            {/* ===== SECONDARY LEFT VINE (shorter, inner) ===== */}
            <g opacity={0.35}>
                <path
                    d="M 85 55 Q 100 100 90 150 Q 80 190 95 230"
                    fill="none" stroke="#81C784" strokeWidth={1.8}
                />
                <use href="#leaf-sm" x="96" y="85" fill="#C8E6C9" transform="rotate(35 96 85)" />
                <use href="#leaf-sm" x="85" y="125" fill="#A5D6A7" transform="rotate(-15 85 125)" />
                <use href="#leaf-sm" x="92" y="175" fill="#C8E6C9" transform="rotate(20 92 175)" />
                <use href="#leaf-sm" x="88" y="215" fill="#81C784" transform="rotate(-25 88 215)" />
            </g>

            {/* ===== SECONDARY RIGHT VINE (shorter, inner) ===== */}
            <g opacity={0.35}>
                <path
                    d="M 415 55 Q 400 105 410 155 Q 420 195 405 240"
                    fill="none" stroke="#81C784" strokeWidth={1.8}
                />
                <use href="#leaf-sm" x="404" y="90" fill="#C8E6C9" transform="rotate(-35 404 90)" />
                <use href="#leaf-sm" x="415" y="130" fill="#A5D6A7" transform="rotate(15 415 130)" />
                <use href="#leaf-sm" x="408" y="180" fill="#C8E6C9" transform="rotate(-20 408 180)" />
                <use href="#leaf-sm" x="412" y="225" fill="#81C784" transform="rotate(25 412 225)" />
            </g>

            {/* ===== HANGING IVY from arch top center ===== */}
            <g opacity={0.4}>
                <path d="M 200 55 Q 190 80 200 110 Q 210 130 195 155" fill="none" stroke="#66BB6A" strokeWidth={1.5} />
                <use href="#leaf-sm" x="195" y="75" fill="#A5D6A7" transform="rotate(-20 195 75)" />
                <use href="#leaf-sm" x="205" y="105" fill="#C8E6C9" transform="rotate(25 205 105)" />
                <use href="#leaf-sm" x="192" y="140" fill="#81C784" transform="rotate(-15 192 140)" />
            </g>
            <g opacity={0.4}>
                <path d="M 300 55 Q 310 85 300 115 Q 290 135 305 160" fill="none" stroke="#66BB6A" strokeWidth={1.5} />
                <use href="#leaf-sm" x="305" y="78" fill="#C8E6C9" transform="rotate(20 305 78)" />
                <use href="#leaf-sm" x="295" y="110" fill="#A5D6A7" transform="rotate(-25 295 110)" />
                <use href="#leaf-sm" x="308" y="145" fill="#81C784" transform="rotate(15 308 145)" />
            </g>

            {/* ===== SMALL HANGING TENDRILS between shelves ===== */}
            {/* Between shelf 1 and 2 - left */}
            <g opacity={0.3}>
                <path d="M 90 295 Q 85 310 92 325" fill="none" stroke="#81C784" strokeWidth={1.2} />
                <use href="#leaf-sm" x="87" y="310" fill="#A5D6A7" transform="rotate(-15 87 310)" />
            </g>
            {/* Between shelf 1 and 2 - right */}
            <g opacity={0.3}>
                <path d="M 410 295 Q 415 312 408 328" fill="none" stroke="#81C784" strokeWidth={1.2} />
                <use href="#leaf-sm" x="413" y="312" fill="#C8E6C9" transform="rotate(15 413 312)" />
            </g>
            {/* Between shelf 2 and 3 - left */}
            <g opacity={0.3}>
                <path d="M 88 445 Q 82 462 90 478" fill="none" stroke="#81C784" strokeWidth={1.2} />
                <use href="#leaf-sm" x="84" y="462" fill="#C8E6C9" transform="rotate(-20 84 462)" />
            </g>
            {/* Between shelf 2 and 3 - right */}
            <g opacity={0.3}>
                <path d="M 412 445 Q 418 460 410 478" fill="none" stroke="#81C784" strokeWidth={1.2} />
                <use href="#leaf-sm" x="416" y="460" fill="#A5D6A7" transform="rotate(20 416 460)" />
            </g>

            {/* ===== Three wooden shelves with pots ===== */}
            {shelfY.map((y, shelfIdx) => (
                <g key={shelfIdx}>
                    {/* Shelf plank */}
                    <rect
                        x="75"
                        y={y + 80}
                        width="350"
                        height="12"
                        rx="3"
                        fill="#8D6E63"
                        stroke="#6D4C41"
                        strokeWidth={1}
                    />
                    {/* Shelf depth shading */}
                    <rect
                        x="75"
                        y={y + 88}
                        width="350"
                        height="5"
                        rx="1"
                        fill="#6D4C41"
                        opacity={0.5}
                    />
                    {/* Shelf bracket left */}
                    <rect x="85" y={y + 80} width="6" height="18" rx="1" fill="#6D4C41" />
                    {/* Shelf bracket right */}
                    <rect x="410" y={y + 80} width="6" height="18" rx="1" fill="#6D4C41" />

                    {/* Shelf label */}
                    <text
                        x="250"
                        y={y + 106}
                        textAnchor="middle"
                        fill="#8D6E63"
                        fontSize="10"
                        fontFamily="sans-serif"
                        fontWeight="bold"
                        opacity={0.6}
                        letterSpacing="2"
                    >
                        {shelfLabels[shelfIdx].toUpperCase()}
                    </text>

                    {/* 3 pots per shelf */}
                    {potXOffsets.map((px, potIdx) => {
                        const milestoneIdx = shelfIdx * 3 + potIdx;
                        const milestone = milestones[milestoneIdx];
                        if (!milestone) return null;
                        return (
                            <g key={potIdx} transform={`translate(${px}, ${y})`}>
                                <FlowerPot milestone={milestone} index={milestoneIdx} />
                            </g>
                        );
                    })}
                </g>
            ))}

            {/* ===== GROUND AREA - lush bottom ===== */}
            {/* Soil/ground */}
            <ellipse cx="250" cy="652" rx="190" ry="10" fill="#8D6E63" opacity={0.25} />

            {/* Ground plants - small bushes left */}
            <g opacity={0.5}>
                <ellipse cx="95" cy="645" rx="14" ry="9" fill="#81C784" />
                <ellipse cx="85" cy="642" rx="10" ry="7" fill="#A5D6A7" />
                <ellipse cx="105" cy="643" rx="11" ry="7" fill="#C8E6C9" />
            </g>
            {/* Ground plants - small bushes right */}
            <g opacity={0.5}>
                <ellipse cx="405" cy="645" rx="14" ry="9" fill="#81C784" />
                <ellipse cx="415" cy="642" rx="10" ry="7" fill="#A5D6A7" />
                <ellipse cx="395" cy="643" rx="11" ry="7" fill="#C8E6C9" />
            </g>
            {/* Small ground fern center-left */}
            <g opacity={0.4} transform="translate(160, 638)">
                <path d="M 0 10 Q -8 0 -5 -8" fill="none" stroke="#66BB6A" strokeWidth={1.5} />
                <path d="M 0 10 Q 2 -2 8 -6" fill="none" stroke="#66BB6A" strokeWidth={1.5} />
                <path d="M 0 10 Q -3 2 -12 2" fill="none" stroke="#81C784" strokeWidth={1.2} />
                <use href="#leaf-sm" x="-6" y="-5" fill="#A5D6A7" transform="rotate(-40 -6 -5)" />
                <use href="#leaf-sm" x="7" y="-3" fill="#C8E6C9" transform="rotate(30 7 -3)" />
                <use href="#leaf-sm" x="-10" y="3" fill="#81C784" transform="rotate(-60 -10 3)" />
            </g>
            {/* Small ground fern center-right */}
            <g opacity={0.4} transform="translate(340, 638)">
                <path d="M 0 10 Q 8 0 5 -8" fill="none" stroke="#66BB6A" strokeWidth={1.5} />
                <path d="M 0 10 Q -2 -2 -8 -6" fill="none" stroke="#66BB6A" strokeWidth={1.5} />
                <path d="M 0 10 Q 3 2 12 2" fill="none" stroke="#81C784" strokeWidth={1.2} />
                <use href="#leaf-sm" x="6" y="-5" fill="#A5D6A7" transform="rotate(40 6 -5)" />
                <use href="#leaf-sm" x="-7" y="-3" fill="#C8E6C9" transform="rotate(-30 -7 -3)" />
                <use href="#leaf-sm" x="10" y="3" fill="#81C784" transform="rotate(60 10 3)" />
            </g>

            {/* ===== DECORATIVE ARCH TOP - small flower buds ===== */}
            <g opacity={0.45}>
                <circle cx="155" cy="62" r="3.5" fill="#F8BBD0" />
                <circle cx="155" cy="62" r="1.5" fill="#F06292" />
                <circle cx="345" cy="62" r="3.5" fill="#F8BBD0" />
                <circle cx="345" cy="62" r="1.5" fill="#F06292" />
                <circle cx="250" cy="44" r="3.5" fill="#FFF9C4" />
                <circle cx="250" cy="44" r="1.5" fill="#FFD54F" />
            </g>

            {/* ===== SMALL WATERING CAN decoration bottom-right ===== */}
            <g opacity={0.3} transform="translate(350, 598)">
                <rect x="0" y="8" width="18" height="14" rx="3" fill="#90A4AE" stroke="#607D8B" strokeWidth={1} />
                <rect x="6" y="4" width="6" height="6" rx="1" fill="#90A4AE" stroke="#607D8B" strokeWidth={0.8} />
                <line x1="18" y1="12" x2="28" y2="8" stroke="#607D8B" strokeWidth={1.5} />
                <circle cx="28" cy="8" r="2" fill="none" stroke="#607D8B" strokeWidth={1} />
            </g>
        </svg>
    );
};
