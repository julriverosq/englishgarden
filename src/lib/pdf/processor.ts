import { extractTextFromPDF } from '../pdf-processor';

interface SessionConfig {
    wordsPerSession: number; // 200, 250, 300
    maxSessionsPerDay: number; // 1, 2, 3
}

interface ProcessedSession {
    sessionNumber: number;
    contentText: string;
    contentPhonetic: Array<{ line: string; phonetic: string }> | null; // Null for lazy loading
    wordCount: number;
    estimatedReadingTime: number; // seconds
    sourcePages: string; // "p. 1-2"
    difficultyScore: number;
}

export async function processPDFIntoSessions(
    pdfBuffer: Buffer,
    config: SessionConfig
): Promise<{
    metadata: {
        totalPages: number; // Calculated from PDF
        totalWords: number;
        totalSessions: number;
        estimatedDays: number;
    };
    sessions: ProcessedSession[];
}> {

    // 1. Extract Full Text
    // Note: extractTextFromPDF returns sections, we need to aggregate or handle them.
    // For now assuming we join everything or process section by section.
    // Let's modify extractTextFromPDF logic if needed, but here we can just join.
    // Copy the buffer to ensure it's a standard ArrayBuffer, not SharedArrayBuffer
    const uint8Array = new Uint8Array(pdfBuffer);
    const arrayBuffer = uint8Array.buffer.slice(uint8Array.byteOffset, uint8Array.byteOffset + uint8Array.byteLength);
    const sections = await extractTextFromPDF(arrayBuffer);

    // Combine all text for global word count, but we should probably keep track of pages if possible.
    // The existing extractTextFromPDF returns { text: string; numPages: number }[] (sections).
    // It doesn't give precise per-page text mapping easily without deeper changes.
    // We will approximate source pages based on character count / average chars per page or just use "Book" for now.

    const fullText = sections.map(s => s.text).join('\n\n');
    const totalWords = fullText.split(/\s+/).length;
    const totalPages = sections.reduce((acc, s) => acc + s.numPages, 0);

    // 2. Split into sessions
    const sessionTexts = splitIntoSessions(fullText, config.wordsPerSession);
    const sessions: ProcessedSession[] = [];

    sessionTexts.forEach((text, index) => {
        const wordCount = text.split(/\s+/).length;
        sessions.push({
            sessionNumber: index + 1,
            contentText: text,
            contentPhonetic: null, // LAZY LOADING: No phonetics generated here
            wordCount: wordCount,
            estimatedReadingTime: Math.ceil(wordCount / 2.5), // ~150 wpm (words per minute) -> words / (150/60) = words / 2.5
            sourcePages: 'Book', // Placeholder until we have better page mapping
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
    // Regex to split by sentences (ending in . ! ?)
    // This regex looks for sequences of non-terminators followed by terminators.
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    // Fallback if no sentences found (e.g. weird PDF extraction), treat whole text as one or split by newlines
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

        // If adding this sentence exceeds the limit AND we already have content
        if (currentWordCount + sentenceWords > wordsPerSession && currentSession.length > 0) {
            // Save current session
            sessions.push(currentSession.join(' '));

            // Start new session with this sentence
            currentSession = [normalizedSentence];
            currentWordCount = sentenceWords;
        } else {
            // Add sentence to current session
            currentSession.push(normalizedSentence);
            currentWordCount += sentenceWords;
        }
    }

    // Add remaining content
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

    // Score 0.0 (easy) to 1.0 (hard)
    // Heuristic: Average word length usually around 5. >6 is harder.
    // Long word ratio > 0.3 is hard.
    return Math.min(1.0, (avgWordLength / 10) * 0.5 + longWordRatio * 0.5);
}
