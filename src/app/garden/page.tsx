'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { storage, computeGardenMilestones } from '@/lib/storage';
import { UserState, GardenMilestone } from '@/types';
import { GreenhouseScene } from '@/components/ui/GreenhouseScene';

export default function GardenPage() {
    const [userState, setUserState] = useState<UserState | null>(null);
    const [milestones, setMilestones] = useState<GardenMilestone[]>([]);

    useEffect(() => {
        // Migrate legacy data if needed
        storage.migrateGardenProgress();

        const state = storage.get();
        setUserState(state);
        setMilestones(computeGardenMilestones(state));
    }, []);

    if (!userState) return <div className="p-8 text-center font-display">Loading garden...</div>;

    const bookTitle = userState.currentBook?.title || 'My Reading Journey';
    const userName = userState.preferences.name || 'Student';
    const totalSessions = userState.currentBook?.total_sessions || 0;
    const currentSession = userState.currentBook?.current_session || 0;
    const seedCount = Object.keys(userState.seedCollection || {}).length;
    const flowersUnlocked = milestones.filter(m => m.isUnlocked).length;

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: 'linear-gradient(180deg, #F5F0EB 0%, #E8ECDA 100%)' }}
        >
            {/* Header */}
            <div className="p-4 shrink-0">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[var(--color-brown-soft)] hover:text-[var(--color-pink-accent)] font-display text-xs uppercase"
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
            </div>

            {/* Title */}
            <div className="text-center px-4 pb-2">
                <h1 className="font-display text-sm text-[var(--color-pink-accent)] uppercase tracking-wider">
                    {bookTitle}
                </h1>
                <p className="font-display text-xs text-[var(--color-brown-soft)] opacity-60 uppercase mt-1">
                    {userName}&apos;s Garden
                </p>
            </div>

            {/* Greenhouse */}
            <div className="flex-1 flex items-center justify-center px-4 py-2">
                <div style={{ maxWidth: '500px', width: '100%' }}>
                    <GreenhouseScene milestones={milestones} />
                </div>
            </div>

            {/* Footer stats */}
            <div className="shrink-0 px-6 py-4 flex justify-between items-center max-w-lg mx-auto w-full">
                <span className="font-display text-[9px] text-[var(--color-brown-soft)] opacity-60 uppercase">
                    Session {currentSession}/{totalSessions}
                </span>
                <span className="font-display text-[9px] text-[var(--color-brown-soft)] opacity-60 uppercase">
                    {seedCount} seeds remaining
                </span>
                <span className="font-display text-[9px] text-[var(--color-pink-accent)] uppercase font-bold">
                    {flowersUnlocked}/9 flowers bloomed
                </span>
            </div>
        </div>
    );
}
