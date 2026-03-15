'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { WindowRetro } from '../ui/WindowRetro';
import { ProgressBarFloral } from '../ui/ProgressBarFloral';
import { MessageBoxRetro } from '../ui/MessageBoxRetro';
import { BookUploadConfig } from '../book/BookUploadConfig';
import { storage, getUserId } from '@/lib/storage';
import { extractTextFromPDF } from '@/lib/pdf-processor';

interface UploadData {
    extractedText: string;
    totalWords: number;
    numPages: number;
    bookInfo: {
        title: string;
        author: string;
    };
}

export default function PDFUploader() {
    const router = useRouter();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [step, setStep] = useState<'upload' | 'config' | 'processing'>('upload');
    const [uploadData, setUploadData] = useState<UploadData | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile);
                setMessage(null);
            } else {
                setMessage({ text: 'Please upload a PDF file only!', type: 'error' });
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    };

    // Step 1: Extract text in the browser (no API call needed)
    const handleFileUpload = async () => {
        if (!file) return;

        setLoading(true);
        setProgress(10);

        try {
            const progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + 5, 90));
            }, 300);

            const buffer = await file.arrayBuffer();
            const { text, numPages } = await extractTextFromPDF(buffer);

            clearInterval(progressInterval);

            const totalWords = text.split(/\s+/).filter(w => w.length > 0).length;

            setUploadData({
                extractedText: text,
                totalWords,
                numPages,
                bookInfo: {
                    title: file.name.replace('.pdf', ''),
                    author: 'Unknown'
                },
            });
            setLoading(false);
            setStep('config');
            setProgress(0);

        } catch (error) {
            setLoading(false);
            const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
            setMessage({ text: errorMessage, type: 'error' });
            console.error(error);
        }
    };

    // Step 2: Send extracted text + config to backend
    const handleConfigConfirm = async (config: { wordsPerSession: number; maxSessionsPerDay: number }) => {
        if (!uploadData || !file) return;

        setStep('processing');
        setLoading(true);
        setProgress(10);

        try {
            const progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + 2, 95));
            }, 500);

            const response = await fetch('/api/process-book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: getUserId(),
                    extractedText: uploadData.extractedText,
                    numPages: uploadData.numPages,
                    config,
                    bookInfo: uploadData.bookInfo
                }),
            });

            clearInterval(progressInterval);

            const contentType = response.headers.get('content-type') || '';
            if (!contentType.includes('application/json')) {
                throw new Error('Server error: the API returned an unexpected response. Please try again.');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Processing failed');
            }

            setProgress(100);
            setMessage({ text: 'Book processed successfully! Good things are coming.', type: 'success' });

            // Initialize local storage for new book
            storage.update(s => ({
                ...s,
                currentBook: {
                    book_id: data.bookId,
                    title: uploadData.bookInfo.title,
                    current_session: 1,
                    total_sessions: data.totalSessions,
                    last_read_date: new Date().toISOString(),
                    started_at: new Date().toISOString(),
                    words_per_session: config.wordsPerSession,
                    sessions_per_day: config.maxSessionsPerDay
                }
            }));

            setTimeout(() => {
                router.push(`/reader/${data.bookId}/1`);
            }, 1000);

        } catch (error) {
            setLoading(false);
            setStep('config');
            const errorMessage = error instanceof Error ? error.message : 'Processing failed';
            setMessage({ text: errorMessage, type: 'error' });
            console.error(error);
        }
    };

    if (step === 'config' && uploadData) {
        return (
            <BookUploadConfig
                totalWords={uploadData.totalWords}
                onConfirm={handleConfigConfirm}
                onCancel={() => setStep('upload')}
            />
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <WindowRetro title="Upload New Book" flowerType="tulip">
                {step === 'processing' ? (
                    <div className="text-center p-8 space-y-4">
                        <Loader2 className="animate-spin mx-auto text-[var(--color-pink-accent)]" size={48} />
                        <p className="font-display text-[var(--color-brown-soft)]">Creating your reading plan...</p>
                        <ProgressBarFloral progress={progress} label="processing..." />
                    </div>
                ) : (
                    <>
                        <div
                            className={`
                                border-4 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                                ${isDragging
                                    ? 'border-[var(--color-pink-medium)] bg-[var(--color-bg-secondary)] scale-[1.02]'
                                    : 'border-[var(--color-green-medium)] bg-[var(--color-cream)] hover:border-[var(--color-green-soft)]'
                                }
                            `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-input')?.click()}
                        >
                            <input
                                type="file"
                                id="file-input"
                                className="hidden"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />

                            <div className="flex flex-col items-center gap-4">
                                <div className={`p-4 rounded-full bg-[var(--color-bg-primary)] ${isDragging ? 'animate-bounce' : ''}`}>
                                    {file ? <FileText size={48} className="text-[var(--color-pink-accent)]" /> : <Upload size={48} className="text-[var(--color-green-medium)]" />}
                                </div>

                                <div className="font-body text-[var(--color-brown-soft)]">
                                    {file ? (
                                        <span className="font-bold text-[var(--color-pink-accent)]">{file.name}</span>
                                    ) : (
                                        <>
                                            <p className="mb-2">Drag & drop your PDF here</p>
                                            <span className="text-sm opacity-60">or click to browse</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {loading && step === 'upload' && (
                            <div className="mt-4">
                                <ProgressBarFloral progress={progress} label="analyzing book..." />
                            </div>
                        )}

                        {message && (
                            <div className="mt-4">
                                <MessageBoxRetro
                                    message={message.text}
                                    icon={message.type === 'success' ? '🌸' : '🥀'}
                                    onClose={() => setMessage(null)}
                                />
                            </div>
                        )}

                        {file && !loading && !message && (
                            <button
                                onClick={handleFileUpload}
                                className="w-full mt-6 button-retro bg-[var(--color-pink-soft)] border-[3px] border-[var(--color-pink-medium)] rounded-xl py-4 font-display text-[12px] text-[var(--color-brown-soft)] uppercase tracking-wider hover:bg-[var(--color-pink-medium)] text-center block"
                            >
                                Analyze Book
                            </button>
                        )}
                    </>
                )}
            </WindowRetro>
        </div>
    );
}
