import { UserState, INITIAL_STATE } from '@/types';

const STORAGE_KEY = 'english_platform_progress';

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
            const today = new Date().toISOString().split('T')[0];
            const lastStudy = state.stats.last_study_date;

            let newStreak = state.stats.streak_days;

            if (lastStudy) {
                const lastDate = new Date(lastStudy);
                const currentDate = new Date(today);
                const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    // Consecutive day
                    newStreak++;
                } else if (diffDays > 1) {
                    // Streak broken
                    newStreak = 1;
                }
                // if diffDays == 0 (same day), do nothing
            } else {
                newStreak = 1;
            }

            return {
                ...state,
                stats: {
                    ...state.stats,
                    streak_days: newStreak,
                    longest_streak: Math.max(state.stats.longest_streak, newStreak),
                    last_study_date: today
                }
            };
        });
    }
};
