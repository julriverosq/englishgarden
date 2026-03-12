'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, RefreshCw, ChevronRight } from 'lucide-react';
import { WindowRetro } from '@/components/ui/WindowRetro';
import { PronunciationRecorder } from '@/components/Reader/PronunciationRecorder';
import { getWordPhonetics } from '@/lib/word-phonetics';
import { storage } from '@/lib/storage';
import { UserState, WordPronunciationResult } from '@/types';

export default function PracticeWordPage() {
    const params = useParams();
    const router = useRouter();
    const wordParam = decodeURIComponent(params.word as string);
    const [wordData, setWordData] = useState<WordPronunciationResult | null>(null);
    const [phonetic, setPhonetic] = useState<string>('');
    const [isPlaying, setIsPlaying] = useState(false);
    
    // We'll manage the user's new attempt here
    const [practiceScore, setPracticeScore] = useState<number | null>(null);
    const [practiceResults, setPracticeResults] = useState<WordPronunciationResult[]>([]);

    useEffect(() => {
        const state = storage.get();
        if (state.seedCollection && state.seedCollection[wordParam]) {
            setWordData(state.seedCollection[wordParam]);
        } else {
            // Fallback if accessed directly but not in seeds
            setWordData({
                word: wordParam,
                accuracyScore: 0,
                errorType: 'None',
                phonemes: []
            });
        }
        
        // Generate IPA transcription
        const dict = getWordPhonetics([wordParam]);
        if (dict[wordParam]) {
            setPhonetic(dict[wordParam]);
        }
    }, [wordParam]);

    const playNativeAudio = () => {
        if (!window.speechSynthesis) return;
        
        setIsPlaying(true);
        const utterance = new SpeechSynthesisUtterance(wordParam);
        utterance.lang = 'en-US';
        utterance.rate = 0.8; // slightly slower for practice
        
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        window.speechSynthesis.speak(utterance);
    };

    const handlePracticeComplete = (score: number) => {
        setPracticeScore(score);
        // If score is >= 80, the user "mastered" this seed and it blooms (removed from collection)
        if (score >= 80) {
            storage.update(state => {
                const newSeeds = { ...state.seedCollection };
                delete newSeeds[wordParam];
                return { ...state, seedCollection: newSeeds };
            });
        }
    };

    const activePhonemes = practiceResults.length > 0 && practiceResults[0].word === wordParam 
        ? practiceResults[0].phonemes 
        : wordData?.phonemes;

    const isMastered = practiceScore !== null && practiceScore >= 80;

    if (!wordData) return <div className="p-8 text-center font-display">Loading seed...</div>;

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center w-full">
                <Link href="/practice" className="inline-flex items-center gap-2 text-[var(--color-brown-soft)] hover:text-[var(--color-pink-accent)] font-display text-xs uppercase shrink-0">
                    <ArrowLeft size={16} /> Back to Summary
                </Link>
                <div className="font-display text-xs text-[var(--color-brown-soft)] uppercase opacity-60">
                    Drill-Down Mode
                </div>
            </div>

            <WindowRetro title={`Practicing: ${wordParam}`} flowerType="tulip" className="min-h-[80vh] flex flex-col">
                {/* Header (Word + Phonetic) */}
                <div className="text-center my-10">
                    <h1 className="text-6xl font-bold text-[var(--color-pink-accent)] mb-4 tracking-tight">
                        {wordParam}
                    </h1>
                    <p className="font-mono text-xl text-[var(--color-brown-soft)] opacity-80">
                        /{phonetic || wordParam}/
                    </p>
                </div>

                {/* Phoneme Breakdown */}
                {activePhonemes && activePhonemes.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-center font-display text-[10px] uppercase text-[var(--color-brown-soft)] tracking-widest opacity-60 mb-6">
                            Phoneme Breakdown
                        </h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {activePhonemes.map((p, idx) => {
                                let styleClass = "border-[var(--color-green-medium)] text-[var(--color-green-medium)]";
                                let label = "Perfect";
                                
                                if (p.accuracyScore < 60) {
                                    styleClass = "border-red-500 text-red-500";
                                    label = p.errorType === 'None' ? 'Poor' : p.errorType;
                                } else if (p.accuracyScore < 80) {
                                    styleClass = "border-orange-500 text-orange-500";
                                    label = "Needs work";
                                }

                                return (
                                    <div key={idx} className={`flex flex-col items-center justify-center border-2 rounded-xl p-3 min-w-[60px] ${styleClass} bg-[var(--color-bg-secondary)] shadow-sm`}>
                                        <span className="text-2xl font-bold mb-2">{p.phoneme}</span>
                                        <span className="font-display uppercase text-[8px]">{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Native Reference */}
                <div className="border-2 border-[var(--color-pink-soft)] rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-cream)] mx-auto w-full max-w-2xl">
                    <div className="font-display text-[10px] uppercase text-[var(--color-brown-soft)] tracking-wider opacity-60">
                        Native Reference
                    </div>
                    
                    {/* Fake wave visual */}
                    <div className={`flex gap-1 h-12 items-center justify-center ${isPlaying ? 'animate-pulse' : ''} opacity-60 text-[var(--color-green-medium)]`}>
                        {[12, 24, 16, 32, 20, 14, 28, 18, 10].map((h, i) => (
                            <div key={i} className={`w-1 bg-current rounded-full transition-all duration-300`} style={{ height: `${h}px` }} />
                        ))}
                    </div>

                    <button 
                        onClick={playNativeAudio}
                        disabled={isPlaying}
                        className="w-10 h-10 rounded-full bg-[var(--color-pink-soft)] flex items-center justify-center text-[var(--color-brown-soft)] hover:bg-[var(--color-pink-medium)] transition-colors disabled:opacity-50"
                    >
                        <Play size={16} className="ml-1" fill="currentColor" />
                    </button>
                </div>

                {/* Practice Recorder */}
                <div className="mt-auto pt-6 border-t border-[var(--color-pink-soft)]">
                    {!isMastered ? (
                        <>
                            <div className="text-center font-display text-[10px] uppercase text-[var(--color-brown-soft)] tracking-wider opacity-60 mb-2">
                                Your Turn
                            </div>
                            <PronunciationRecorder
                                referenceText={wordParam}
                                wordPhonetics={{ [wordParam]: phonetic }}
                                onResult={handlePracticeComplete}
                                onWordResults={setPracticeResults}
                            />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 bg-green-50 border-2 border-green-200 rounded-xl">
                            <h2 className="text-2xl font-bold text-green-600 mb-2">🌸 Seed Bloomed!</h2>
                            <p className="text-green-700 opacity-80 mb-6 font-body text-center px-4">
                                Excellent pronunciation! This word has been removed from your seed collection.
                            </p>
                            <Link href="/practice">
                                <button className="button-retro bg-[var(--color-green-soft)] border-2 border-[var(--color-green-medium)] px-6 py-3 rounded-lg text-sm font-display uppercase text-[var(--color-brown-soft)] hover:bg-[var(--color-green-medium)] shadow-[2px_2px_0px_var(--color-green-medium)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex border items-center gap-2">
                                    Continue <ChevronRight size={16} />
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </WindowRetro>
        </div>
    );
}
