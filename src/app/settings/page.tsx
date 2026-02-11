'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Download, Upload } from 'lucide-react';
import { WindowRetro } from '@/components/ui/WindowRetro';
import { MessageBoxRetro } from '@/components/ui/MessageBoxRetro';
import { storage } from '@/lib/storage';
import { UserState, INITIAL_STATE } from '@/types';

export default function SettingsPage() {
    const [state, setState] = useState<UserState | null>(null);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

    useEffect(() => {
        setState(storage.get());
    }, []);

    const handleSave = () => {
        if (!state) return;
        storage.set(state);
        setMessage({ text: 'Preferences saved successfully!', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleExport = () => {
        if (!state) return;
        const dataStr = JSON.stringify(state, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `english-garden-progress-${new Date().toISOString().slice(0, 10)}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        setMessage({ text: 'Progress exported! Keep it safe.', type: 'info' });
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                // Basic validation could go here
                storage.set(json);
                setState(json);
                setMessage({ text: 'Garden restored successfully!', type: 'success' });
            } catch (err) {
                console.error(err);
                setMessage({ text: 'Failed to import. Invalid file.', type: 'info' }); // type info for error visual in this simple component
            }
        };
        reader.readAsText(file);
    };

    if (!state) return null;

    return (
        <div className="min-h-screen p-8 max-w-2xl mx-auto flex flex-col items-center">
            <Link href="/" className="self-start mb-8 flex items-center gap-2 text-[var(--color-brown-soft)] hover:text-[var(--color-pink-accent)] font-display text-xs uppercase">
                <ArrowLeft size={16} /> Back to Garden
            </Link>

            <WindowRetro title="Settings" flowerType="lavender" className="w-full">
                <div className="space-y-6">
                    {/* Profile Section */}
                    <section>
                        <h3 className="font-display text-sm text-[var(--color-pink-accent)] mb-4 border-b border-[var(--color-pink-medium)] pb-2">Profile</h3>
                        <div className="grid gap-4">
                            <div>
                                <label className="block text-xs font-bold text-[var(--color-brown-soft)] mb-1">Name</label>
                                <input
                                    type="text"
                                    value={state.preferences.name}
                                    onChange={e => setState({ ...state, preferences: { ...state.preferences, name: e.target.value } })}
                                    className="w-full bg-[var(--color-bg-primary)] border-2 border-[var(--color-pink-medium)] rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--color-brown-soft)] mb-1">Level</label>
                                <select
                                    value={state.preferences.user_level}
                                    onChange={e => setState({ ...state, preferences: { ...state.preferences, user_level: e.target.value as any } })}
                                    className="w-full bg-[var(--color-bg-primary)] border-2 border-[var(--color-pink-medium)] rounded px-3 py-2 text-sm"
                                >
                                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--color-brown-soft)] mb-1">Goal</label>
                                <input
                                    type="text"
                                    value={state.preferences.learning_goal}
                                    onChange={e => setState({ ...state, preferences: { ...state.preferences, learning_goal: e.target.value } })}
                                    className="w-full bg-[var(--color-bg-primary)] border-2 border-[var(--color-pink-medium)] rounded px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Preferences Section */}
                    <section>
                        <h3 className="font-display text-sm text-[var(--color-pink-accent)] mb-4 border-b border-[var(--color-pink-medium)] pb-2">Reading</h3>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="phonetic"
                                checked={state.preferences.show_phonetic_transcription}
                                onChange={e => setState({ ...state, preferences: { ...state.preferences, show_phonetic_transcription: e.target.checked } })}
                                className="w-4 h-4 accent-[var(--color-pink-accent)]"
                            />
                            <label htmlFor="phonetic" className="text-sm font-body text-[var(--color-brown-soft)]">Show phonetic transcription by default</label>
                        </div>
                    </section>

                    {/* Action Buttons */}
                    <div className="pt-4 flex justify-end gap-4">
                        <button onClick={handleSave} className="button-retro bg-[var(--color-green-soft)] border-[3px] border-[var(--color-green-medium)] flex items-center gap-2">
                            <Save size={16} /> Save Changes
                        </button>
                    </div>

                    {/* Data Management */}
                    <section className="mt-8 pt-8 border-t border-[var(--color-pink-medium)] bg-[var(--color-bg-secondary)] -mx-6 px-6 pb-2">
                        <h3 className="font-display text-sm text-[var(--color-brown-soft)] mb-4">Data Management</h3>
                        <div className="flex gap-4">
                            <button onClick={handleExport} className="flex-1 bg-[var(--color-cream)] border-2 border-[var(--color-brown-soft)]/20 rounded-lg p-3 text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-bg-primary)] opacity-70 hover:opacity-100">
                                <Download size={14} /> Export Progress
                            </button>
                            <div className="flex-1 relative">
                                <input type="file" accept=".json" onChange={handleImport} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <button className="w-full bg-[var(--color-cream)] border-2 border-[var(--color-brown-soft)]/20 rounded-lg p-3 text-xs font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-bg-primary)] opacity-70 hover:opacity-100 pointer-events-none">
                                    <Upload size={14} /> Import Progress
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </WindowRetro>

            {message && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
                    <MessageBoxRetro message={message.text} onClose={() => setMessage(null)} />
                </div>
            )}
        </div>
    );
}
