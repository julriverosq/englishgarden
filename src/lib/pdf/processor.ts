interface SessionConfig {
    wordsPerSession: number; // 200, 250, 300
    maxSessionsPerDay: number; // 1, 2, 3
}

interface ProcessedSession {
    sessionNumber: number;
    contentText: string;
    contentPhonetic: Array<{ line: string; phonetic: string }> | null;
    wordCount: number;
    estimatedReadingTime: number; // seconds
    sourcePages: string;
    difficultyScore: number;
}

// Receives pre-extracted text from the frontend (no PDF processing on server)
export function processTextIntoSessions(
    fullText: string,
    totalPages: number,
    config: SessionConfig
): {
    metadata: {
        totalPages: number;
        totalWords: number;
        totalSessions: number;
        estimatedDays: number;
    };
    sessions: ProcessedSession[];
} {
    const totalWords = fullText.split(/\s+/).filter(w => w.length > 0).length;

    // Split into sessions
    const sessionTexts = splitIntoSessions(fullText, config.wordsPerSession);
    const sessions: ProcessedSession[] = [];

    sessionTexts.forEach((text, index) => {
        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
        sessions.push({
            sessionNumber: index + 1,
            contentText: text,
            contentPhonetic: null, // LAZY LOADING: No phonetics generated here
            wordCount: wordCount,
            estimatedReadingTime: Math.ceil(wordCount / 2.5),
            sourcePages: 'Book',
            difficultyScore: calculateDifficulty(text)
        });
    });

    const totalSessions = sessions.length;
    const estimatedDays = Math.ceil(totalSessions / config.maxSessionsPerDay);

    return {
        metadata: {
            totalPages,
            totalWords,
            totalSessions,
            estimatedDays
        },
        sessions
    };
}

function splitIntoSessions(text: string, wordsPerSession: number): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    if (sentences.length === 0 && text.trim().length > 0) {
        return [text];
    }

    const sessions: string[] = [];
    let currentSession: string[] = [];
    let currentWordCount = 0;

    for (const sentence of sentences) {
        const normalizedSentence = sentence.trim();
        if (!normalizedSentence) continue;

        const sentenceWords = normalizedSentence.split(/\s+/).length;

        if (currentWordCount + sentenceWords > wordsPerSession && currentSession.length > 0) {
            sessions.push(currentSession.join(' '));
            currentSession = [normalizedSentence];
            currentWordCount = sentenceWords;
        } else {
            currentSession.push(normalizedSentence);
            currentWordCount += sentenceWords;
        }
    }

    if (currentSession.length > 0) {
        sessions.push(currentSession.join(' '));
    }

    return sessions;
}

function calculateDifficulty(text: string): number {
    const words = text.split(/\s+/);
    if (words.length === 0) return 0;

    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    const longWords = words.filter(w => w.length > 8).length;
    const longWordRatio = longWords / words.length;

    return Math.min(1.0, (avgWordLength / 10) * 0.5 + longWordRatio * 0.5);
}
