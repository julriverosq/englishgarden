import { UserState, INITIAL_STATE, GardenMilestone } from '@/types';

const STORAGE_KEY = 'english_platform_progress';
const USER_ID_KEY = 'english_platform_user_id';

// Generate or retrieve a unique browser-based user ID
export function getUserId(): string {
    if (typeof window === 'undefined') return '';
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
}

export const storage = {
    get: (): UserState => {
        if (typeof window === 'undefined') return INITIAL_STATE;
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return INITIAL_STATE;
            const parsed = JSON.parse(data);
            // Merge with INITIAL_STATE to fill missing fields from schema changes
            return {
                ...INITIAL_STATE,
                ...parsed,
                stats: { ...INITIAL_STATE.stats, ...parsed.stats },
                preferences: { ...INITIAL_STATE.preferences, ...parsed.preferences },
                gardenProgress: { ...INITIAL_STATE.gardenProgress, ...parsed.gardenProgress },
            };
        } catch (error) {
            console.error('Error reading from localStorage', error);
            return INITIAL_STATE;
        }
    },

    set: (state: UserState) => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error('Error writing to localStorage', error);
        }
    },

    update: (updater: (state: UserState) => UserState) => {
        const current = storage.get();
        const newState = updater(current);
        storage.set(newState);
        return newState;
    },

    // Specific helpers
    addPoints: (points: number) => {
        storage.update(state => ({
            ...state,
            stats: {
                ...state.stats,
                total_points: state.stats.total_points + points
            }
        }));
    },

    updateStreak: () => {
        storage.update(state => {
            const now = new Date();
            const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            const lastStudy = state.stats.last_study_date;

            let newStreak = state.stats.streak_days || 0;

            if (lastStudy) {
                // Parse strictly as local midnight to avoid UTC crossover issues
                const [lastYear, lastMonth, lastDay] = lastStudy.split('-').map(Number);
                const [currYear, currMonth, currDay] = today.split('-').map(Number);

                const lastDate = new Date(lastYear, lastMonth - 1, lastDay);
                const currentDate = new Date(currYear, currMonth - 1, currDay);

                const diffTime = currentDate.getTime() - lastDate.getTime();
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    newStreak++;
                } else if (diffDays > 1) {
                    newStreak = 1;
                }
                // if diffDays === 0, newStreak remains the same
            } else {
                newStreak = 1;
            }

            // Ensure streak is at least 1 since they just studied
            if (newStreak === 0) newStreak = 1;

            return {
                ...state,
                stats: {
                    ...state.stats,
                    streak_days: newStreak,
                    longest_streak: Math.max(state.stats.longest_streak || 0, newStreak),
                    last_study_date: today
                }
            };
        });
        storage.syncActivity();
    },

    incrementSeedsBloomed: () => {
        storage.update(state => ({
            ...state,
            gardenProgress: {
                ...state.gardenProgress,
                totalSeedsBloomed: state.gardenProgress.totalSeedsBloomed + 1,
            },
        }));
    },

    incrementSeedsCollected: (count: number = 1) => {
        storage.update(state => ({
            ...state,
            gardenProgress: {
                ...state.gardenProgress,
                totalSeedsEverCollected: state.gardenProgress.totalSeedsEverCollected + count,
            },
        }));
    },

    migrateGardenProgress: () => {
        const state = storage.get();
        if (state.gardenProgress.totalSeedsBloomed > 0 || state.gardenProgress.totalSeedsEverCollected > 0) return;

        let totalBloomed = 0;
        if (typeof window !== 'undefined') {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('seeds_bloomed_')) {
                    totalBloomed += parseInt(localStorage.getItem(key) || '0');
                }
            }
        }
        const totalCollected = Object.keys(state.seedCollection || {}).length + totalBloomed;

        if (totalBloomed > 0 || totalCollected > 0) {
            storage.update(s => ({
                ...s,
                gardenProgress: {
                    totalSeedsBloomed: totalBloomed,
                    totalSeedsEverCollected: totalCollected,
                },
            }));
        }
    },

    syncActivity: () => {
        const state = storage.get();
        const email = state.preferences.reminder_email;
        if (!email) return;

        fetch('/api/reminder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: getUserId(),
                email,
                userName: state.preferences.name,
                bookTitle: state.currentBook?.title || '',
            }),
        }).catch(() => {});
    },
};

export function computeGardenMilestones(state: UserState): GardenMilestone[] {
    const totalSessions = state.currentBook?.total_sessions || 1;
    const completedSessions = Object.keys(state.sessionsCompleted).length;
    const readingRatio = Math.min(completedSessions / totalSessions, 1);

    const totalSeeds = state.gardenProgress.totalSeedsEverCollected || 1;
    const bloomed = state.gardenProgress.totalSeedsBloomed;
    const bloomRatio = Math.min(bloomed / totalSeeds, 1);

    const streak = state.stats.streak_days || 0;
    const avgPron = state.stats.avg_pronunciation_score || 0;

    const allRead = readingRatio >= 1;
    const allBloomed = bloomRatio >= 1 && totalSeeds > 1;

    return [
        // Top shelf - Reading (green)
        {
            id: 'read-25',
            category: 'reading',
            label: '25% Sessions Read',
            flowerName: 'Daisy',
            isUnlocked: readingRatio >= 0.25,
            progress: Math.min(readingRatio / 0.25, 1),
        },
        {
            id: 'read-50',
            category: 'reading',
            label: '50% Sessions Read',
            flowerName: 'Tulip',
            isUnlocked: readingRatio >= 0.5,
            progress: Math.min(readingRatio / 0.5, 1),
        },
        {
            id: 'read-100',
            category: 'reading',
            label: '100% Sessions Read',
            flowerName: 'Sunflower',
            isUnlocked: readingRatio >= 1,
            progress: readingRatio,
        },
        // Middle shelf - Practice (pink)
        {
            id: 'bloom-25',
            category: 'practice',
            label: '25% Seeds Bloomed',
            flowerName: 'Rose',
            isUnlocked: bloomRatio >= 0.25,
            progress: Math.min(bloomRatio / 0.25, 1),
        },
        {
            id: 'bloom-50',
            category: 'practice',
            label: '50% Seeds Bloomed',
            flowerName: 'Peony',
            isUnlocked: bloomRatio >= 0.5,
            progress: Math.min(bloomRatio / 0.5, 1),
        },
        {
            id: 'bloom-100',
            category: 'practice',
            label: '100% Seeds Bloomed',
            flowerName: 'Cherry Blossom',
            isUnlocked: bloomRatio >= 1 && totalSeeds > 1,
            progress: bloomRatio,
        },
        // Bottom shelf - Mastery (gold)
        {
            id: 'streak-7',
            category: 'mastery',
            label: '7-Day Streak',
            flowerName: 'Marigold',
            isUnlocked: streak >= 7,
            progress: Math.min(streak / 7, 1),
        },
        {
            id: 'pron-70',
            category: 'mastery',
            label: 'Avg Pronunciation > 70%',
            flowerName: 'Orchid',
            isUnlocked: avgPron >= 70,
            progress: Math.min(avgPron / 70, 1),
        },
        {
            id: 'garden-complete',
            category: 'mastery',
            label: 'Garden Complete',
            flowerName: 'Golden Lotus',
            isUnlocked: allRead && allBloomed,
            progress: allRead && allBloomed ? 1 : ((readingRatio + bloomRatio) / 2),
        },
    ];
}
