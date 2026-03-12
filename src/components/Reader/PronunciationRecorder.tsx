'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { ProgressBarFloral } from '../ui/ProgressBarFloral';
import { storage } from '@/lib/storage';
import { WordPronunciationResult } from '@/types';

interface PronunciationRecorderProps {
    referenceText: string;
    wordPhonetics: Record<string, string>;
    onResult: (score: number) => void;
    onWordResults: (results: WordPronunciationResult[]) => void;
    onOpenBreakdown?: () => void;
}

export const PronunciationRecorder: React.FC<PronunciationRecorderProps> = ({
    referenceText,
    wordPhonetics,
    onResult,
    onWordResults,
    onOpenBreakdown,
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [scores, setScores] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [wordResults, setWordResults] = useState<WordPronunciationResult[]>([]);
    const [recognizer, setRecognizer] = useState<SpeechSDK.SpeechRecognizer | null>(null);

    useEffect(() => {
        return () => {
            if (recognizer) {
                recognizer.close();
            }
        };
    }, [recognizer]);

    // Propagate word results to parent outside of render cycle
    useEffect(() => {
        if (wordResults.length > 0) {
            onWordResults(wordResults);
        }
    }, [wordResults]);

    const startRecording = async () => {
        try {
            const tokenRes = await fetch('/api/speech-token');
            const { token, region } = await tokenRes.json();

            if (!token || !region) {
                setFeedback('Could not connect to speech service.');
                return;
            }

            const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region);
            speechConfig.speechRecognitionLanguage = 'en-US';

            const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

            const pronunciationAssessmentConfig = new SpeechSDK.PronunciationAssessmentConfig(
                referenceText,
                SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
                SpeechSDK.PronunciationAssessmentGranularity.Phoneme,
                true
            );

            const newRecognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
            pronunciationAssessmentConfig.applyTo(newRecognizer);

            newRecognizer.recognized = (s, e) => {
                if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                    const pronunciationResult = SpeechSDK.PronunciationAssessmentResult.fromResult(e.result);
                    const finalScore = pronunciationResult.pronunciationScore;
                    setScores(prev => {
                        const newScores = [...prev, finalScore];
                        const avgScore = newScores.reduce((a,b) => a+b, 0) / newScores.length;
                        onResult(avgScore);
                        if (avgScore >= 90) setFeedback("Excellent pronunciation!");
                        else if (avgScore >= 75) setFeedback("Good job! Keep practicing.");
                        else setFeedback("Try again, focus on the highlighted words.");
                        return newScores;
                    });

                    // Extract word-level results from the detailed JSON
                    try {
                        const jsonStr = e.result.properties.getProperty(
                            SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult
                        );
                        const parsed = JSON.parse(jsonStr);
                        const words = parsed?.NBest?.[0]?.Words;

                        if (Array.isArray(words)) {
                            const results: WordPronunciationResult[] = words.map((w: any) => {
                                const phonemes = Array.isArray(w.Phonemes) ? w.Phonemes.map((p: any) => ({
                                    phoneme: p.Phoneme,
                                    accuracyScore: p.PronunciationAssessment?.AccuracyScore ?? 0,
                                    errorType: p.PronunciationAssessment?.ErrorType ?? 'None',
                                })) : [];

                                return {
                                    word: w.Word.toLowerCase(),
                                    accuracyScore: w.PronunciationAssessment?.AccuracyScore ?? 0,
                                    errorType: w.PronunciationAssessment?.ErrorType ?? 'None',
                                    phonemes
                                };
                            });
                            setWordResults(prev => [...prev, ...results]);

                            // Auto-save difficult words to Seed Collection
                            storage.update(state => {
                                const newSeeds = { ...state.seedCollection };
                                let changed = false;
                                
                                results.forEach(r => {
                                    // Skip insertions, only care about words actually mispronounced or omitted
                                    if (r.errorType === 'Insertion') return;

                                    if (r.accuracyScore < 80) {
                                        // Update or add to seed collection
                                        const existing = newSeeds[r.word];
                                        if (!existing || existing.accuracyScore > r.accuracyScore) {
                                            newSeeds[r.word] = r;
                                            changed = true;
                                        }
                                    }
                                });

                                if (!changed) return state;
                                return { ...state, seedCollection: newSeeds };
                            });
                        }
                    } catch (parseErr) {
                        console.error('Failed to parse word-level results:', parseErr);
                    }
                } else if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
                    setFeedback("Could not hear you clearly.");
                }
            };

            newRecognizer.canceled = (s, e) => {
                console.error(`Canceled: ${e.reason}`);
                if (e.reason === SpeechSDK.CancellationReason.Error) {
                    console.error(`Error: ${e.errorDetails}`);
                    setFeedback("Error accessing microphone or service.");
                }
                setIsRecording(false);
                setProcessing(false);
            };

            newRecognizer.sessionStopped = () => {
                setIsRecording(false);
                setProcessing(false);
                newRecognizer.stopContinuousRecognitionAsync();
            };

            setRecognizer(newRecognizer);

            newRecognizer.startContinuousRecognitionAsync(() => {
                setIsRecording(true);
                setProcessing(false);
                setFeedback(null);
                setScores([]);
                setWordResults([]);
            });

        } catch (error) {
            console.error(error);
            setFeedback("Failed to start recording.");
        }
    };

    const stopRecording = () => {
        if (recognizer) {
            setProcessing(true);
            recognizer.stopContinuousRecognitionAsync(() => {
                setIsRecording(false);
            });
        }
    };

    const getScoreColor = (accuracy: number) => {
        if (accuracy >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (accuracy >= 50) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getErrorLabel = (errorType: string) => {
        switch (errorType) {
            case 'Mispronunciation': return 'Mispronounced';
            case 'Omission': return 'Skipped';
            case 'Insertion': return 'Extra word';
            default: return null;
        }
    };

    return (
        <div className="flex flex-row items-center gap-6 my-4 p-4 border-2 border-[var(--color-lavender-medium)] border-dashed rounded-xl bg-[var(--color-bg-secondary)] min-h-[100px]">
            <div className="flex items-center gap-4 shrink-0">
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        className="w-16 h-16 rounded-full bg-[var(--color-pink-soft)] border-4 border-[var(--color-pink-medium)] flex items-center justify-center text-[var(--color-pink-accent)] hover:scale-105 transition-all shadow-md"
                    >
                        <Mic size={32} />
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="w-16 h-16 rounded-full bg-[var(--color-tulip-pink)] border-4 border-[var(--color-pink-accent)] flex items-center justify-center text-white hover:scale-105 transition-all shadow-md animate-pulse"
                    >
                        <Square size={24} fill="currentColor" />
                    </button>
                )}

                <div className="flex flex-col">
                    <span className="font-display text-[12px] text-[var(--color-brown-soft)] uppercase">
                        {isRecording ? "Listening..." : "Read Aloud"}
                    </span>
                    <span className="text-xs text-[var(--color-brown-soft)] opacity-70">
                        Click mic to start
                    </span>
                </div>
            </div>

            <div className="w-px h-16 bg-[var(--color-pink-medium)] shrink-0 hidden sm:block"></div>

            <div className="flex-1 flex flex-col justify-center min-w-0">

            {processing && <Loader2 className="animate-spin text-[var(--color-lavender-medium)]" />}

            {(isRecording || scores.length > 0) && (
                <div className="w-full">
                    <ProgressBarFloral 
                        progress={scores.length > 0 ? (scores.reduce((a,b) => a+b, 0) / scores.length) : 0} 
                        label={`Avg Score: ${scores.length > 0 ? (scores.reduce((a,b) => a+b, 0) / scores.length).toFixed(0) : '0'}%`} 
                        feedback={feedback}
                    />
                </div>
            )}

            {/* Word-by-word breakdown button */}
            {scores.length > 0 && wordResults.length > 0 && onOpenBreakdown && (
                <button 
                    onClick={onOpenBreakdown}
                    className="shrink-0 button-retro px-4 py-2 bg-[var(--color-cream)] border-2 border-[var(--color-pink-medium)] text-[10px] font-display uppercase text-[var(--color-brown-soft)] rounded-lg hover:bg-[var(--color-pink-light)] transition-colors self-center"
                >
                    View Word Breakdown
                </button>
            )}
            </div>
        </div>
    );
};
