'use client';

import React, { useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { WindowRetro } from '../ui/WindowRetro';
import { ProgressBarFloral } from '../ui/ProgressBarFloral';
import { MessageBoxRetro } from '../ui/MessageBoxRetro';

export default function PDFUploader() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

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

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setProgress(10); // Start progress

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.replace('.pdf', ''));

        try {
            // Simulate progress for UX
            const progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + 5, 90));
            }, 500);

            const response = await fetch('/api/upload-pdf', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }
            setProgress(100);
            setMessage({ text: 'Book uploaded successfully! Good things are coming.', type: 'success' });

            // Reset after success
            setTimeout(() => {
                setLoading(false);
                setProgress(0);
                setFile(null);
                // Redirect or refresh logic here
            }, 2000);

        } catch (error) {
            setLoading(false);
            const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
            setMessage({ text: errorMessage, type: 'error' });
            console.error(error);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <WindowRetro title="Upload New Book" flowerType="tulip">
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

                {loading && (
                    <ProgressBarFloral progress={progress} label="processing book..." />
                )}

                {message && (
                    <MessageBoxRetro
                        message={message.text}
                        icon={message.type === 'success' ? '🌸' : '🥀'}
                        onClose={() => setMessage(null)}
                    />
                )}

                {file && !loading && !message && (
                    <button
                        onClick={handleUpload}
                        className="w-full mt-6 button-retro bg-[var(--color-pink-soft)] border-[3px] border-[var(--color-pink-medium)] rounded-xl py-4 font-display text-[12px] text-[var(--color-brown-soft)] uppercase tracking-wider hover:bg-[var(--color-pink-medium)] text-center block"
                    >
                        Start Reading
                    </button>
                )}
            </WindowRetro>
        </div>
    );
}
