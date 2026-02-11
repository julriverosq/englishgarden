'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { ProgressBarFloral } from '../ui/ProgressBarFloral';
import { MessageBoxRetro } from '../ui/MessageBoxRetro';

interface PronunciationRecorderProps {
    referenceText: string;
    onResult: (score: number) => void;
}

export const PronunciationRecorder: React.FC<PronunciationRecorderProps> = ({ referenceText, onResult }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
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

            // Configure Pronunciation Assessment
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
                    // console.log("Accuracy score:", pronunciationResult.accuracyScore);
                    // console.log("Pronunciation score:", pronunciationResult.pronunciationScore);
                    // console.log("Completeness score:", pronunciationResult.completenessScore);
                    // console.log("Fluency score:", pronunciationResult.fluencyScore);

                    const finalScore = pronunciationResult.pronunciationScore;
                    setScore(finalScore);
                    onResult(finalScore);

                    if (finalScore >= 90) setFeedback("Excellent pronunciation! 🌟");
                    else if (finalScore >= 75) setFeedback("Good job! Keep practicing. 👍");
                    else setFeedback("Try again, focus on clarity. 👂");
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

            newRecognizer.sessionStopped = (s, e) => {
                setIsRecording(false);
                setProcessing(false);
                newRecognizer.stopContinuousRecognitionAsync();
            };

            setRecognizer(newRecognizer);

            // Start
            newRecognizer.startContinuousRecognitionAsync(() => {
                setIsRecording(true);
                setProcessing(false);
                setFeedback(null);
                setScore(null);
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
                // Processing usually happens in 'recognized' event which fires shortly after
            });
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
        </div>
    );
};
