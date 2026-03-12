'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { WindowRetro } from '@/components/ui/WindowRetro';
import { storage } from '@/lib/storage';
import { UserState } from '@/types';
import { PlantSproutIcon } from '@/components/ui/PlantSproutIcon';

export default function PracticePage() {
    const [userState, setUserState] = useState<UserState | null>(null);

    useEffect(() => {
        setUserState(storage.get());
    }, []);

    if (!userState) return <div className="p-8 text-center font-display">Loading floral garden...</div>;

    const seeds = Object.values(userState.seedCollection || {});

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-brown-soft)] hover:text-[var(--color-pink-accent)] font-display text-xs uppercase shrink-0">
                <ArrowLeft size={16} /> Back to Garden
            </Link>

            <WindowRetro title="Seed Collection" flowerType="lavender" className="min-h-[60vh]">
                <div className="mb-8 text-center flex flex-col items-center">
                    <PlantSproutIcon size={48} className="mb-4 drop-shadow-[2px_2px_0px_var(--color-pink-soft)]" />
                    <h1 className="font-display text-2xl text-[var(--color-brown-soft)] mb-2 uppercase">
                        Seed Collection
                    </h1>
                    <p className="font-body text-[var(--color-green-medium)] text-sm">
                        These are the words that need a little more water to bloom. Practice them to improve!
                    </p>
                </div>

                {seeds.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center">
                        <p className="font-body text-[var(--color-brown-soft)] text-lg mb-2">Your collection is empty!</p>
                        <p className="font-body text-[var(--color-green-medium)] text-sm">Read more sessions to discover new seeds.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {seeds.map((seed, idx) => (
                            <Link key={idx} href={`/practice/${seed.word}`}>
                                <div className="bg-[var(--color-bg-secondary)] border-2 border-[var(--color-pink-medium)] rounded-xl p-4 hover:bg-[var(--color-pink-soft)] hover:-translate-y-1 transition-all cursor-pointer shadow-[4px_4px_0px_var(--color-pink-soft)] group flex flex-col items-center justify-between h-full">
                                    <div className="text-center mb-4">
                                        <span className="font-bold text-lg text-[var(--color-brown-soft)] group-hover:text-[var(--color-pink-accent)] transition-colors">
                                            {seed.word}
                                        </span>
                                        <div className="text-[10px] font-display uppercase mt-2 text-red-500 opacity-80">
                                            {seed.accuracyScore.toFixed(0)}% Score
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[var(--color-brown-soft)] opacity-60 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle size={16} />
                                        <span className="text-[10px] uppercase font-display">Practice</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </WindowRetro>
        </div>
    );
}
