'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, BookMarked, Flame, Mic, Plus } from 'lucide-react';
import { WindowRetro } from '@/components/ui/WindowRetro';
import { storage } from '@/lib/storage';
import { UserState } from '@/types';
import { PlantSproutIcon } from '@/components/ui/PlantSproutIcon';
import { SakuraIcon } from '@/components/ui/SakuraIcon';
import { BookBasketIcon } from '@/components/ui/BookBasketIcon';
import { SeedReminder } from '@/components/ui/SeedReminder';
import { FolderGardenIcon } from '@/components/ui/FolderGardenIcon';

export default function Dashboard() {
  const [userState, setUserState] = useState<UserState | null>(null);

  useEffect(() => {
    // Load state from local storage
    const state = storage.get();
    setUserState(state);

  }, []);

  if (!userState) return <div className="p-8 text-center font-display">Loading floral garden...</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Seed Collection Reminder */}
      <SeedReminder seedCount={Object.keys(userState.seedCollection || {}).length} />
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="flex items-center gap-3 font-display text-2xl text-[var(--color-brown-soft)] mb-2">
            Hello, <span className="text-[var(--color-pink-accent)]">{userState.preferences.name || 'Student'}</span>!
            <SakuraIcon size={40} className="drop-shadow-[2px_2px_0px_var(--color-pink-soft)] animate-[pulse_4s_ease-in-out_infinite]" />
          </h1>
          <p className="font-body text-[var(--color-green-medium)]">Ready to grow your English garden?</p>
        </div>
        <Link href="/settings">
          <div className="w-10 h-10 rounded-full bg-[var(--color-pink-soft)] border-2 border-[var(--color-pink-medium)] flex items-center justify-center cursor-pointer hover:rotate-12 transition-transform">
            ⚙️
          </div>
        </Link>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<BookMarked size={24} />}
          label="Books Read"
          value={userState.stats.total_books_read || 0}
          color="var(--color-tulip-yellow)"
        />
        <StatCard
          icon={<Flame size={24} />}
          label="Day Streak"
          value={userState.stats.streak_days}
          color="var(--color-tulip-pink)"
        />
        <StatCard
          icon={<BookOpen size={24} />}
          label="Sessions Read"
          value={Object.keys(userState.sessionsCompleted).length}
          color="var(--color-tulip-blue)"
        />
        <StatCard
          icon={<Mic size={24} />}
          label="Avg Score"
          value={`${(userState.stats.avg_pronunciation_score ?? 0).toFixed(0)}%`}
          color="var(--color-lavender-medium)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content - Current Book */}
        <div className="md:col-span-2">
          <WindowRetro title="Current Reading" flowerType="lavender" className="h-full">
            {userState.currentBook ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h2 className="font-display text-xl text-[var(--color-brown-soft)] mb-2">{userState.currentBook.title || 'Unknown Title'}</h2>
                  <p className="font-body text-sm mb-4">Session {userState.currentBook.current_session}</p>

                  <div className="w-full bg-[var(--color-bg-secondary)] rounded-full h-4 border-2 border-[var(--color-pink-medium)] overflow-hidden mb-6">
                    <div
                      className="bg-[var(--color-pink-accent)] h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((userState.currentBook.current_session / (userState.currentBook.total_sessions || 1)) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href={`/reader/${userState.currentBook.book_id}/${userState.currentBook.current_session}`} className="flex-1">
                    <button className="w-full button-retro bg-[var(--color-pink-soft)] border-[3px] border-[var(--color-pink-medium)] rounded-xl py-4 font-display text-[12px] uppercase hover:bg-[var(--color-pink-medium)] text-[var(--color-brown-soft)] shadow-[2px_2px_0px_var(--color-pink-medium)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                      Continue Reading
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 flex flex-col items-center">
                <p className="font-body text-[var(--color-brown-soft)] mb-6">No book currently open.</p>
                <Link href="/upload">
                  <button className="button-retro bg-[var(--color-green-soft)] border-[3px] border-[var(--color-green-medium)] rounded-xl px-8 py-4 font-display text-[12px] uppercase text-[var(--color-brown-soft)] shadow-[2px_2px_0px_var(--color-green-medium)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2">
                    <Plus size={16} /> Upload New Book
                  </button>
                </Link>
              </div>
            )}
          </WindowRetro>
        </div>

        {/* Sidebar - Quick Actions */}
        <div className="md:col-span-1 space-y-6">
          {/* Daily Message */}
          <WindowRetro title="" showFlowers={false} className="mb-6">
            <div className="flex items-center gap-4 p-4">
              <BookBasketIcon size={52} className="shrink-0 drop-shadow-[2px_2px_0px_var(--color-pink-soft)]" />
              <p className="font-display text-[10px] text-[var(--color-brown-soft)] lowercase leading-loose opacity-60">
                "learning is a garden that grows with patience."
              </p>
            </div>
          </WindowRetro>

          {/* Seed Collection Link */}
          <WindowRetro title="Seed Collection" showFlowers={false} className="min-h-[200px]">
            <div className="flex flex-col items-center justify-center p-4 text-center h-full">
              <PlantSproutIcon size={40} className="mb-4 drop-shadow-[2px_2px_0px_var(--color-pink-soft)]" />
              <h3 className="font-display text-[12px] uppercase text-[var(--color-brown-soft)] mb-2">Needs Practice</h3>
              <p className="font-body text-[10px] text-[var(--color-green-medium)] mb-8 opacity-80">
                {Object.keys(userState.seedCollection || {}).length} words waiting to bloom
              </p>
              <Link href="/practice" className="w-full mt-auto">
                <button className="w-full button-retro bg-[var(--color-green-soft)] border-[3px] border-[var(--color-green-medium)] py-3 rounded-xl text-[10px] font-display uppercase text-[var(--color-brown-soft)] hover:bg-[var(--color-green-medium)] shadow-[2px_2px_0px_var(--color-green-medium)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                  View Seeds
                </button>
              </Link>
            </div>
          </WindowRetro>
        </div>
      </div>

      {/* Garden Folder */}
      <div className="fixed bottom-14 right-14 z-40 drop-shadow-[3px_3px_0px_var(--color-pink-medium)]">
        <FolderGardenIcon />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div className="stat-card" style={{ borderColor: color }}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-2 text-[var(--color-brown-soft)] opacity-80">{icon}</div>
        <span className="stat-value" style={{ color: color }}>{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}
