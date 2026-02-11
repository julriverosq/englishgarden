'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PDFUploader from '@/components/Upload/PDFUploader';

export default function UploadPage() {
    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto flex flex-col items-center justify-center">
            <Link href="/" className="self-start mb-8 flex items-center gap-2 text-[var(--color-brown-soft)] hover:text-[var(--color-pink-accent)] font-display text-xs uppercase">
                <ArrowLeft size={16} /> Back to Garden
            </Link>

            <div className="w-full">
                <div className="text-center mb-8">
                    <h1 className="font-display text-2xl text-[var(--color-brown-soft)] mb-2">Plant a New Book</h1>
                    <p className="font-body text-[var(--color-green-medium)]">Allowed formats: PDF only</p>
                </div>

                <PDFUploader />
            </div>
        </div>
    );
}
