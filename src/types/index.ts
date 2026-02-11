export interface UserPreferences {
    name: string;
    native_language: string;
    user_level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    learning_goal: string;
    show_phonetic_transcription: boolean;
}

export interface CurrentBook {
    book_id: string;
    title?: string;
    current_chapter: number;
    last_read_date: string;
    started_at: string;
}

export interface UserStats {
    total_points: number;
    streak_days: number;
    longest_streak: number;
    total_reading_minutes: number;
    avg_pronunciation_score: number;
    last_study_date?: string;
}

export interface ChapterProgress {
    completed_at: string;
    pronunciation_score: number;
    reading_time_minutes: number;
    audio_url?: string;
}

export interface VocabularyWord {
    mastery_level: number; // 0-100
    times_reviewed: number;
    times_correct: number;
    learned_date: string;
    is_mastered: boolean;
    // Metadata from DB can be fetched or stored here if needed
}

export interface ExerciseResult {
    completed_at: string;
    is_correct: boolean;
    user_answer: string;
    type: string;
}

export interface ConversationMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface Conversation {
    session_date: string;
    chapter_id?: string;
    messages: ConversationMessage[];
}

export interface StudySession {
    date: string;
    duration_minutes: number;
    chapters_read: number;
    exercises_completed: number;
    words_learned: number;
    points_earned: number;
}

export interface UserState {
    preferences: UserPreferences;
    currentBook: CurrentBook | null;
    stats: UserStats;
    chaptersCompleted: Record<string, ChapterProgress>; // key: chapter_id
    vocabulary: Record<string, VocabularyWord>; // key: word (lowercase)
    exercisesCompleted: Record<string, ExerciseResult>; // key: exercise_id
    conversations: Conversation[];
    studySessions: StudySession[];
}

export const INITIAL_STATE: UserState = {
    preferences: {
        name: '',
        native_language: 'Spanish',
        user_level: 'B1',
        learning_goal: 'Fluency',
        show_phonetic_transcription: true,
    },
    currentBook: null,
    stats: {
        total_points: 0,
        streak_days: 0,
        longest_streak: 0,
        total_reading_minutes: 0,
        avg_pronunciation_score: 0,
    },
    chaptersCompleted: {},
    vocabulary: {},
    exercisesCompleted: {},
    conversations: [],
    studySessions: [],
};
