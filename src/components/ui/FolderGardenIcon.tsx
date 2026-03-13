'use client';

import Link from 'next/link';

export const FolderGardenIcon = ({ className = '' }: { className?: string }) => {
    return (
        <Link href="/garden" title="My Garden" className={className} style={{ textDecoration: 'none' }}>
            <style>{`
                @keyframes folderSway {
                    0%, 100% { transform: rotate(-2deg); }
                    50% { transform: rotate(2deg); }
                }
                .folder-wrap {
                    animation: folderSway 4s ease-in-out infinite;
                    transform-origin: top center;
                    position: relative;
                    width: 160px;
                    height: 160px;
                }
                .folder-flowers {
                    position: absolute;
                    top: 0; left: 0;
                    width: 160px; height: 160px;
                    z-index: 2;
                    opacity: 0;
                    transition: opacity 0.3s ease 0.15s;
                }
                .folder-front {
                    position: absolute;
                    top: 0; left: 0;
                    width: 160px; height: 160px;
                    z-index: 3;
                    transform-origin: 50% 100%;
                    transform: perspective(600px) rotateX(0deg);
                    transition: transform 0.55s cubic-bezier(.4,0,.2,1), opacity 0.45s ease;
                }
                .folder-root:hover .folder-front {
                    transform: perspective(600px) rotateX(68deg);
                    opacity: 0.15;
                }
                .folder-root:hover .folder-flowers {
                    opacity: 1;
                }
                .folder-root:hover .folder-label {
                    color: #4a6830;
                }
            `}</style>

            <div
                className="folder-root"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative', width: '160px', cursor: 'pointer' }}
            >
                {/* Hilos */}
                <svg
                    style={{ position: 'absolute', top: '-16px', left: 0, zIndex: 5, pointerEvents: 'none' }}
                    width="160" height="20" viewBox="0 0 160 20"
                >
                    <path d="M52 0 Q51 7 50 18" stroke="#B0A090" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity=".6" />
                    <path d="M108 0 Q109 7 110 18" stroke="#B0A090" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity=".6" />
                    <circle cx="52" cy="2" r="3" fill="#C0B0A0" opacity=".7" />
                    <circle cx="108" cy="2" r="3" fill="#C0B0A0" opacity=".7" />
                </svg>

                <div className="folder-wrap">

                    {/* PARTE TRASERA */}
                    <svg style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} width="160" height="160" viewBox="0 0 160 160">
                        <defs>
                            <linearGradient id="fg-back" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#c8d878" />
                                <stop offset="100%" stopColor="#b0c060" />
                            </linearGradient>
                        </defs>
                        <polygon points="18,42 142,28 148,118 24,132" fill="url(#fg-back)" stroke="#8a9e52" strokeWidth="1.8" strokeLinejoin="round" />
                        <path d="M38,32 L72,27 L76,38 L42,43 Z" fill="#bcd070" stroke="#8a9e52" strokeWidth="1.4" />
                    </svg>

                    {/* FLORES ADENTRO */}
                    <svg className="folder-flowers" width="160" height="160" viewBox="0 0 160 160">
                        <polygon points="28,52 136,38 140,112 30,124" fill="#f6f8e4" opacity=".98" />
                        {/* Tallos */}
                        <path d="M55 118 Q53 96 57 70" stroke="#4a7040" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                        <path d="M82 120 Q82 96 79 57" stroke="#4a7040" strokeWidth="2.3" strokeLinecap="round" fill="none" />
                        <path d="M110 118 Q113 96 107 72" stroke="#4a7040" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                        <path d="M68 118 Q70 102 69 80" stroke="#5a8050" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        {/* Hojas */}
                        <ellipse cx="48" cy="92" rx="16" ry="5.5" fill="#6a9860" opacity=".8" transform="rotate(-38 48 92)" />
                        <ellipse cx="40" cy="82" rx="13" ry="4.5" fill="#88c070" opacity=".65" transform="rotate(-55 40 82)" />
                        <ellipse cx="116" cy="90" rx="15" ry="5" fill="#6a9860" opacity=".8" transform="rotate(26 116 90)" />
                        <ellipse cx="122" cy="100" rx="12" ry="4" fill="#88c070" opacity=".65" transform="rotate(46 122 100)" />
                        <ellipse cx="82" cy="97" rx="11" ry="4" fill="#88c070" opacity=".58" transform="rotate(8 82 97)" />
                        {/* Capullo */}
                        <g transform="translate(68,74)">
                            <ellipse cx="0" cy="0" rx="5.5" ry="8" fill="#ddeab8" stroke="#b8cc88" strokeWidth=".8" />
                            <ellipse cx="-2" cy="2" rx="4" ry="6.5" fill="#c8d898" opacity=".7" />
                            <ellipse cx="0" cy="-4" rx="3" ry="5" fill="#f0f8d8" opacity=".85" />
                        </g>
                        {/* Margarita 1 izquierda */}
                        <g transform="translate(57,63)">
                            <ellipse cx="0" cy="-13" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" />
                            <ellipse cx="6.5" cy="-11.3" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(30 6.5 -11.3)" />
                            <ellipse cx="11.3" cy="-6.5" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(60 11.3 -6.5)" />
                            <ellipse cx="13" cy="0" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(90 13 0)" />
                            <ellipse cx="11.3" cy="6.5" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(120 11.3 6.5)" />
                            <ellipse cx="6.5" cy="11.3" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(150 6.5 11.3)" />
                            <ellipse cx="0" cy="13" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(180 0 13)" />
                            <ellipse cx="-6.5" cy="11.3" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(210 -6.5 11.3)" />
                            <ellipse cx="-11.3" cy="6.5" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(240 -11.3 6.5)" />
                            <ellipse cx="-13" cy="0" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(270 -13 0)" />
                            <ellipse cx="-11.3" cy="-6.5" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(300 -11.3 -6.5)" />
                            <ellipse cx="-6.5" cy="-11.3" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(330 -6.5 -11.3)" />
                            <circle cx="0" cy="0" r="7" fill="#f4c820" />
                            <circle cx="0" cy="0" r="5" fill="#d4a010" />
                            <circle cx="-2" cy="-2" r="1.2" fill="#a07808" opacity=".6" />
                            <circle cx="2" cy="-1.3" r="1.2" fill="#a07808" opacity=".6" />
                            <circle cx="0" cy="2.5" r="1.1" fill="#f5d840" opacity=".55" />
                        </g>
                        {/* Margarita 2 centro grande */}
                        <g transform="translate(82,50)">
                            <ellipse cx="0" cy="-15" rx="4.8" ry="8" fill="#fffef5" stroke="#e8dcc0" strokeWidth=".6" />
                            <ellipse cx="7.5" cy="-13" rx="4.8" ry="8" fill="#fffef5" stroke="#e8dcc0" strokeWidth=".6" transform="rotate(30 7.5 -13)" />
                            <ellipse cx="13" cy="-7.5" rx="4.8" ry="8" fill="#fffef5" stroke="#e8dcc0" strokeWidth=".6" transform="rotate(60 13 -7.5)" />
                            <ellipse cx="15" cy="0" rx="4.8" ry="8" fill="#fffef5" stroke="#e8dcc0" strokeWidth=".6" transform="rotate(90 15 0)" />
                            <ellipse cx="13" cy="7.5" rx="4.8" ry="8" fill="#fffef5" stroke="#e8dcc0" strokeWidth=".6" transform="rotate(120 13 7.5)" />
                            <ellipse cx="7.5" cy="13" rx="4.8" ry="8" fill="#fffef5" stroke="#e8dcc0" strokeWidth=".6" transform="rotate(150 7.5 13)" />
                            <ellipse cx="0" cy="15" rx="4.8" ry="8" fill="#fffef5" stroke="#e8dcc0" strokeWidth=".6" transform="rotate(180 0 15)" />
                            <ellipse cx="-7.5" cy="13" rx="4.8" ry="8" fill="#fffef5" stroke="#e8dcc0" strokeWidth=".6" transform="rotate(210 -7.5 13)" />
                            <ellipse cx="-13" cy="7.5" rx="4.8" ry="8" fill="#fffef5" stroke="#e8dcc0" strokeWidth=".6" transform="rotate(240 -13 7.5)" />
                            <ellipse cx="-15" cy="0" rx="4.8" ry="8" fill="#fffef5" stroke="#e8dcc0" strokeWidth=".6" transform="rotate(270 -15 0)" />
                            <ellipse cx="-13" cy="-7.5" rx="4.8" ry="8" fill="#fffef5" stroke="#e8dcc0" strokeWidth=".6" transform="rotate(300 -13 -7.5)" />
                            <ellipse cx="-7.5" cy="-13" rx="4.8" ry="8" fill="#fffef5" stroke="#e8dcc0" strokeWidth=".6" transform="rotate(330 -7.5 -13)" />
                            <circle cx="0" cy="0" r="8.5" fill="#f8cc18" />
                            <circle cx="0" cy="0" r="6.2" fill="#dab008" />
                            <circle cx="-2.5" cy="-2.5" r="1.4" fill="#a07808" opacity=".6" />
                            <circle cx="2.5" cy="-1.5" r="1.4" fill="#a07808" opacity=".6" />
                            <circle cx="0" cy="3" r="1.3" fill="#f8e040" opacity=".55" />
                            <circle cx="-2.8" cy="2" r="1.2" fill="#a07808" opacity=".5" />
                        </g>
                        {/* Margarita 3 derecha */}
                        <g transform="translate(108,66)">
                            <ellipse cx="0" cy="-13" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(15 0 -13)" />
                            <ellipse cx="6.5" cy="-11.3" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(45 6.5 -11.3)" />
                            <ellipse cx="11.3" cy="-6.5" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(75 11.3 -6.5)" />
                            <ellipse cx="13" cy="0" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(105 13 0)" />
                            <ellipse cx="11.3" cy="6.5" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(135 11.3 6.5)" />
                            <ellipse cx="6.5" cy="11.3" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(165 6.5 11.3)" />
                            <ellipse cx="0" cy="13" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(195 0 13)" />
                            <ellipse cx="-6.5" cy="11.3" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(225 -6.5 11.3)" />
                            <ellipse cx="-11.3" cy="6.5" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(255 -11.3 6.5)" />
                            <ellipse cx="-13" cy="0" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(285 -13 0)" />
                            <ellipse cx="-11.3" cy="-6.5" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(315 -11.3 -6.5)" />
                            <ellipse cx="-6.5" cy="-11.3" rx="4.2" ry="7" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".6" transform="rotate(345 -6.5 -11.3)" />
                            <circle cx="0" cy="0" r="6.5" fill="#f0c018" />
                            <circle cx="0" cy="0" r="4.6" fill="#cc9808" />
                            <circle cx="-1.8" cy="-1.8" r="1.1" fill="#a07808" opacity=".6" />
                            <circle cx="1.8" cy="-1.2" r="1.1" fill="#a07808" opacity=".6" />
                            <circle cx="0" cy="2.2" r="1" fill="#f5e040" opacity=".5" />
                        </g>
                    </svg>

                    {/* TAPA FRONTAL — bisagra en borde inferior */}
                    <svg className="folder-front" width="160" height="160" viewBox="0 0 160 160">
                        <defs>
                            <linearGradient id="fg-front" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#eef6bc" />
                                <stop offset="55%" stopColor="#ddeaa0" />
                                <stop offset="100%" stopColor="#c5d672" />
                            </linearGradient>
                        </defs>
                        <polygon points="18,42 142,28 148,118 24,132" fill="url(#fg-front)" stroke="#9aaa62" strokeWidth="1.8" strokeLinejoin="round" />
                        <polygon points="18,42 142,28 142,46 18,60" fill="#ffffff" opacity=".28" />
                        <line x1="30" y1="72" x2="140" y2="59" stroke="#b8cc70" strokeWidth="1" opacity=".35" />
                        <line x1="30" y1="85" x2="138" y2="72" stroke="#b8cc70" strokeWidth="1" opacity=".22" />
                        <line x1="30" y1="98" x2="136" y2="85" stroke="#b8cc70" strokeWidth=".8" opacity=".15" />
                        {/* Margarita decorativa en tapa */}
                        <g opacity=".45" transform="translate(110,90)">
                            <ellipse cx="0" cy="-9" rx="3.5" ry="6" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".5" />
                            <ellipse cx="7.8" cy="-4.5" rx="3.5" ry="6" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".5" transform="rotate(60 7.8 -4.5)" />
                            <ellipse cx="7.8" cy="4.5" rx="3.5" ry="6" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".5" transform="rotate(120 7.8 4.5)" />
                            <ellipse cx="0" cy="9" rx="3.5" ry="6" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".5" transform="rotate(180 0 9)" />
                            <ellipse cx="-7.8" cy="4.5" rx="3.5" ry="6" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".5" transform="rotate(240 -7.8 4.5)" />
                            <ellipse cx="-7.8" cy="-4.5" rx="3.5" ry="6" fill="#fdfaf0" stroke="#ddd0b0" strokeWidth=".5" transform="rotate(300 -7.8 -4.5)" />
                            <circle cx="0" cy="0" r="5.5" fill="#f0c020" />
                            <circle cx="0" cy="0" r="3.8" fill="#d4a010" />
                        </g>
                        <path d="M142,28 L140,37 L148,33 Z" fill="#a8be58" opacity=".6" />
                    </svg>

                </div>

                <span
                    className="folder-label"
                    style={{ fontFamily: 'Georgia, serif', fontSize: '11px', color: '#7a8858', letterSpacing: '0.1em', transition: 'color 0.3s', position: 'relative', zIndex: 6 }}
                >
                    my garden
                </span>

            </div>
        </Link>
    );
};
