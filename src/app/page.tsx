'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Trophy, Flame, Mic, Plus } from 'lucide-react';
import { WindowRetro } from '@/components/ui/WindowRetro';
import { storage } from '@/lib/storage';
import { UserState } from '@/types';

export default function Dashboard() {
  const [userState, setUserState] = useState<UserState | null>(null);

  useEffect(() => {
    // Load state from local storage
    const state = storage.get();
    setUserState(state);

    // Check streak
    storage.updateStreak();
  }, []);

  if (!userState) return <div className="p-8 text-center font-display">Loading floral garden...</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-display text-2xl text-[var(--color-brown-soft)] mb-2">
            Hello, <span className="text-[var(--color-pink-accent)]">{userState.preferences.name || 'Student'}</span>! 🌸
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
          icon={<Trophy size={24} />}
          label="Total Points"
          value={userState.stats.total_points}
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
          label="Chapters Read"
          value={Object.keys(userState.chaptersCompleted).length}
          color="var(--color-tulip-blue)"
        />
        <StatCard
          icon={<Mic size={24} />}
          label="Avg Score"
          value={`${userState.stats.avg_pronunciation_score.toFixed(0)}%`}
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
                  <p className="font-body text-sm mb-4">Chapter {userState.currentBook.current_chapter}</p>

                  <div className="w-full bg-[var(--color-bg-secondary)] rounded-full h-4 border-2 border-[var(--color-pink-medium)] overflow-hidden mb-6">
                    <div className="bg-[var(--color-pink-accent)] h-full w-[45%]" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href={`/reader/${userState.currentBook.book_id}/${userState.currentBook.current_chapter}`} className="flex-1">
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
          <div className="bg-[var(--color-cream)] border-[3px] border-[var(--color-pink-medium)] rounded-xl p-6 shadow-[4px_4px_0px_var(--color-pink-soft)]">
            <span className="text-2xl mb-2 block">🌱</span>
            <p className="font-body text-sm text-[var(--color-brown-soft)] italic">
              "Learning is a garden that grows with patience."
            </p>
          </div>

          {/* Recently Learned Words */}
          <WindowRetro title="Fresh Vocab" showFlowers={false} className="min-h-[200px]">
            <div className="space-y-2">
              {Object.keys(userState.vocabulary).slice(0, 5).map(word => (
                <div key={word} className="flex justify-between items-center bg-[var(--color-bg-primary)] p-2 rounded border border-[var(--color-pink-soft)]">
                  <span className="font-body text-sm">{word}</span>
                  <span className="text-xs">
                    {'★'.repeat(Math.round(userState.vocabulary[word].mastery_level / 20))}
                  </span>
                </div>
              ))}
              {Object.keys(userState.vocabulary).length === 0 && (
                <p className="text-xs text-center opacity-60">Start reading to collect words!</p>
              )}
            </div>
          </WindowRetro>
        </div>
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
