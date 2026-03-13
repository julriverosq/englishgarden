export type WordPhonetics = Record<string, string>;

export interface GardenProgress {
    totalSeedsEverCollected: number;
    totalSeedsBloomed: number;
}

export interface GardenMilestone {
    id: string;
    category: 'reading' | 'practice' | 'mastery';
    label: string;
    flowerName: string;
    isUnlocked: boolean;
    progress: number; // 0-1
}

export interface PhonemeResult {
    phoneme: string;
    accuracyScore: number;
    errorType: 'None' | 'Mispronunciation' | 'Omission' | 'Insertion';
}

export interface WordPronunciationResult {
    word: string;
    accuracyScore: number;
    errorType: 'None' | 'Mispronunciation' | 'Omission' | 'Insertion';
    phonemes?: PhonemeResult[];
}

export interface UserPreferences {
    name: string;
    native_language: string;
    user_level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    learning_goal: string;
    show_phonetic_transcription: boolean;
    reminder_email: string;
}

export interface ReadingSession {
    id: string;
    book_id: string;
    session_number: number;
    content_text: string;
    content_phonetic: { line: string; phonetic: string }[] | null;
    word_count: number;
    estimated_reading_time: number;
    difficulty_score: number;
    source_pages: string;
}

export interface SessionProgress {
    completed_at: string;
    pronunciation_score: number;
    reading_time_seconds: number;
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

export interface CurrentBook {
    book_id: string;
    title?: string;
    current_session: number;
    total_sessions: number;
    last_read_date: string;
    started_at: string;
    // Config
    words_per_session: number;
    sessions_per_day: number;
}

export interface UserStats {
    total_points: number;
    streak_days: number;
    longest_streak: number;
    total_reading_minutes: number;
    avg_pronunciation_score: number;
    last_study_date?: string;
    total_sessions_completed: number;
    total_books_read?: number;
}

export interface UserState {
    preferences: UserPreferences;
    currentBook: CurrentBook | null;
    stats: UserStats;
    sessionsCompleted: Record<string, SessionProgress>; // key: session_id
    vocabulary: Record<string, VocabularyWord>; // key: word (lowercase)
    seedCollection: Record<string, WordPronunciationResult>; // key: word (lowercase)
    exercisesCompleted: Record<string, ExerciseResult>; // key: exercise_id
    conversations: Conversation[];
    studySessions: StudySession[];
    gardenProgress: GardenProgress;
}

export const INITIAL_STATE: UserState = {
    preferences: {
        name: '',
        native_language: 'Spanish',
        user_level: 'B1',
        learning_goal: 'Fluency',
        show_phonetic_transcription: true,
        reminder_email: '',
    },
    currentBook: null,
    stats: {
        total_points: 0,
        streak_days: 0,
        longest_streak: 0,
        total_reading_minutes: 0,
        avg_pronunciation_score: 0,
        total_sessions_completed: 0,
        total_books_read: 0,
    },
    sessionsCompleted: {},
    vocabulary: {},
    seedCollection: {},
    exercisesCompleted: {},
    conversations: [],
    studySessions: [],
    gardenProgress: {
        totalSeedsEverCollected: 0,
        totalSeedsBloomed: 0,
    },
};
