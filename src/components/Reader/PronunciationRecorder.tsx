'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { ProgressBarFloral } from '../ui/ProgressBarFloral';
import { WordPronunciationResult } from '@/types';

interface PronunciationRecorderProps {
    referenceText: string;
    wordPhonetics: Record<string, string>;
    onResult: (score: number) => void;
    onWordResults: (results: WordPronunciationResult[]) => void;
}

export const PronunciationRecorder: React.FC<PronunciationRecorderProps> = ({
    referenceText,
    wordPhonetics,
    onResult,
    onWordResults,
}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [score, setScore] = useState<number | null>(null);
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
                    setScore(finalScore);
                    onResult(finalScore);

                    if (finalScore >= 90) setFeedback("Excellent pronunciation!");
                    else if (finalScore >= 75) setFeedback("Good job! Keep practicing.");
                    else setFeedback("Try again, focus on the highlighted words.");

                    // Extract word-level results from the detailed JSON
                    try {
                        const jsonStr = e.result.properties.getProperty(
                            SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult
                        );
                        const parsed = JSON.parse(jsonStr);
                        const words = parsed?.NBest?.[0]?.Words;

                        if (Array.isArray(words)) {
                            const results: WordPronunciationResult[] = words.map((w: any) => ({
                                word: w.Word.toLowerCase(),
                                accuracyScore: w.PronunciationAssessment?.AccuracyScore ?? 0,
                                errorType: w.PronunciationAssessment?.ErrorType ?? 'None',
                            }));
                            setWordResults(results);
                            onWordResults(results);
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
                setScore(null);
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
        <div className="flex flex-col items-center gap-4 my-6 p-4 border-2 border-[var(--color-lavender-medium)] border-dashed rounded-xl bg-[var(--color-bg-secondary)]">
            <div className="flex items-center gap-4">
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

            {processing && <Loader2 className="animate-spin text-[var(--color-lavender-medium)]" />}

            {score !== null && (
                <div className="w-full">
                    <ProgressBarFloral progress={score} label={`Score: ${score.toFixed(0)}%`} />
                </div>
            )}

            {feedback && (
                <div className={`text-sm font-bold ${score && score > 75 ? 'text-green-600' : 'text-[var(--color-pink-accent)]'}`}>
                    {feedback}
                </div>
            )}

            {/* Word-by-word breakdown */}
            {wordResults.length > 0 && (
                <div className="w-full mt-2">
                    <p className="font-display text-[10px] uppercase text-[var(--color-brown-soft)] mb-2">
                        Word-by-word breakdown
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {wordResults.map((wr, idx) => {
                            const errorLabel = getErrorLabel(wr.errorType);
                            const phonetic = wordPhonetics[wr.word];

                            return (
                                <div
                                    key={idx}
                                    className={`inline-flex flex-col items-center px-2 py-1 rounded border text-xs ${getScoreColor(wr.accuracyScore)}`}
                                >
                                    <span className="font-bold">{wr.word}</span>
                                    {phonetic && (
                                        <span className="font-mono text-[9px] opacity-70">{phonetic}</span>
                                    )}
                                    <span className="text-[9px]">{wr.accuracyScore.toFixed(0)}%</span>
                                    {errorLabel && (
                                        <span className="text-[8px] font-display uppercase opacity-80">{errorLabel}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
