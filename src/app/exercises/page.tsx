'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { WindowRetro } from '@/components/ui/WindowRetro';
import { ProgressBarFloral } from '@/components/ui/ProgressBarFloral';
import { MessageBoxRetro } from '@/components/ui/MessageBoxRetro';
import { storage } from '@/lib/storage';
import { UserState } from '@/types';

export default function ExercisePage() {
    const [loading, setLoading] = useState(true);
    const [exercises, setExercises] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [results, setResults] = useState<Record<number, boolean>>({});
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [userState, setUserState] = useState<UserState | null>(null);

    useEffect(() => {
        const loadData = async () => {
            const state = storage.get();
            setUserState(state);
            await generateExercises(state);
        };
        loadData();
    }, []);

    const generateExercises = async (state: UserState) => {
        setLoading(true);
        setExercises([]);
        setCurrentIndex(0);
        setAnswers({});
        setResults({});
        setShowResult(false);
        setScore(0);

        try {
            const recentWords = Object.keys(state.vocabulary).slice(-20);
            const response = await fetch('/api/generate-exercises', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_level: state.preferences.user_level,
                    words_list: recentWords
                }),
            });

            if (!response.ok) throw new Error("Failed to generate");

            const data = await response.json();
            setExercises(data.exercises || []);
        } catch (e) {
            console.error(e);
            // Fallback exercises
            setExercises([
                { type: 'multiple_choice', question: 'Select the correct synonym for "Happy"', options: ['Sad', 'Joyful', 'Angry'], correct_answer: 'Joyful' },
                { type: 'sentence_completion', question: 'I ___ to the store yesterday.', correct_answer: 'went' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (answer: string) => {
        setAnswers(prev => ({ ...prev, [currentIndex]: answer }));
    };

    const checkAnswer = () => {
        const currentEx = exercises[currentIndex];
        const isCorrect = answers[currentIndex]?.toLowerCase().trim() === currentEx.correct_answer.toLowerCase().trim();

        setResults(prev => ({ ...prev, [currentIndex]: isCorrect }));
        if (isCorrect) setScore(prev => prev + 10);

        // Save progress? (Optional for MVP)
    };

    const nextExercise = () => {
        if (currentIndex < exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setShowResult(true);
            // Save stats
            if (score > 0) storage.addPoints(score);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)]">
            <Sparkles className="animate-spin text-[var(--color-pink-accent)] mb-4" size={48} />
            <p className="font-display text-[var(--color-brown-soft)]">Cultivating exercises...</p>
        </div>
    );

    if (showResult) return (
        <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-[var(--color-bg-primary)]">
            <WindowRetro title="Session Complete" flowerType="tulip">
                <div className="text-center p-8">
                    <h2 className="font-display text-2xl text-[var(--color-brown-soft)] mb-4">You harvested</h2>
                    <span className="text-4xl text-[var(--color-pink-accent)] font-bold block mb-2">{score}</span>
                    <span className="text-sm font-body text-[var(--color-green-medium)] uppercase tracking-wider mb-8 block">Points</span>

                    <div className="flex gap-4 justify-center">
                        <Link href="/">
                            <button className="button-retro bg-[var(--color-cream)] border-[3px] border-[var(--color-pink-medium)]">Return Home</button>
                        </Link>
                        <button
                            onClick={() => generateExercises(userState!)}
                            className="button-retro bg-[var(--color-green-soft)] border-[3px] border-[var(--color-green-medium)]"
                        >
                            Grow More
                        </button>
                    </div>
                </div>
            </WindowRetro>
        </div>
    );

    const currentEx = exercises[currentIndex];
    const isChecked = results[currentIndex] !== undefined;

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto bg-[var(--color-bg-primary)]">
            <div className="flex justify-between items-center mb-8">
                <Link href="/" className="flex items-center gap-2 text-[var(--color-brown-soft)] font-display text-xs">
                    <ArrowLeft size={16} /> Exit
                </Link>
                <span className="font-display text-xs text-[var(--color-pink-accent)]">
                    Exercise {currentIndex + 1} / {exercises.length}
                </span>
            </div>

            <ProgressBarFloral progress={((currentIndex) / exercises.length) * 100} label="Progress" />

            <WindowRetro title="Practice Garden" flowerType="daisy">
                <div className="min-h-[300px] flex flex-col justify-between">
                    <div>
                        <span className="inline-block bg-[var(--color-lavender-light)] text-[var(--color-lavender-medium)] text-[10px] font-bold px-2 py-1 rounded mb-4 uppercase">
                            {currentEx.type.replace('_', ' ')}
                        </span>
                        <h3 className="font-body text-xl text-[var(--color-brown-soft)] mb-8">
                            {currentEx.question}
                        </h3>

                        {currentEx.type === 'multiple_choice' ? (
                            <div className="grid gap-3">
                                {currentEx.options.map((opt: string) => (
                                    <button
                                        key={opt}
                                        onClick={() => !isChecked && handleAnswer(opt)}
                                        disabled={isChecked}
                                        className={`
                             p-4 rounded-xl border-2 text-left font-body transition-all
                             ${answers[currentIndex] === opt
                                                ? 'bg-[var(--color-pink-soft)] border-[var(--color-pink-accent)]'
                                                : 'bg-[var(--color-bg-primary)] border-[var(--color-bg-secondary)] hover:border-[var(--color-pink-soft)]'
                                            }
                             ${isChecked && opt === currentEx.correct_answer ? '!bg-[var(--color-green-soft)] !border-[var(--color-green-medium)]' : ''}
                             ${isChecked && answers[currentIndex] === opt && opt !== currentEx.correct_answer ? '!bg-red-100 !border-red-300' : ''}
                           `}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={answers[currentIndex] || ''}
                                onChange={e => handleAnswer(e.target.value)}
                                disabled={isChecked}
                                placeholder="Type your answer..."
                                className="w-full bg-[var(--color-bg-primary)] border-b-2 border-[var(--color-pink-medium)] px-2 py-4 font-body text-lg focus:outline-none focus:border-[var(--color-pink-accent)]"
                            />
                        )}
                    </div>

                    <div className="mt-8 flex justify-end">
                        {!isChecked ? (
                            <button
                                onClick={checkAnswer}
                                disabled={!answers[currentIndex]}
                                className="button-retro bg-[var(--color-pink-soft)] disabled:opacity-50"
                            >
                                Check
                            </button>
                        ) : (
                            <button
                                onClick={nextExercise}
                                className="button-retro bg-[var(--color-green-soft)] flex items-center gap-2"
                            >
                                Next <ArrowLeft size={16} className="rotate-180" />
                            </button>
                        )}
                    </div>

                    {isChecked && (
                        <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${results[currentIndex] ? 'bg-[var(--color-green-soft)]/20 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {results[currentIndex] ? <CheckCircle size={20} /> : <XCircle size={20} />}
                            <span className="font-body text-sm">
                                {results[currentIndex] ? 'Correct! Well done.' : `Incorrect. The answer is: ${currentEx.correct_answer}`}
                            </span>
                        </div>
                    )}
                </div>
            </WindowRetro>
        </div>
    );
}
