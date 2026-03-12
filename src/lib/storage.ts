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
    }
};
