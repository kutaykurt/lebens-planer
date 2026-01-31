'use client';

import { useState } from 'react';
import { Dialog, DialogFooter, Input, Button, Select, toast } from '@/components/ui';
import { useLifeOSStore, useUIStore } from '@/stores';
import { getToday } from '@/lib/utils';
import { TagSelector } from './TagSelector';
import { SkillType, RecurrencePattern } from '@/types';

const SKILL_OPTIONS = [
    { value: 'mental', label: '🧠 Geist', color: 'bg-blue-500' },
    { value: 'physical', label: '💪 Körper', color: 'bg-red-500' },
    { value: 'social', label: '🤝 Sozial', color: 'bg-green-500' },
    { value: 'craft', label: '🛠️ Handwerk', color: 'bg-amber-500' },
    { value: 'soul', label: '✨ Seele', color: 'bg-purple-500' },
];

export function GlobalQuickAddDialog() {
    const isOpen = useUIStore((s) => s.isQuickAddOpen);
    const close = useUIStore((s) => s.closeQuickAdd);

    const [title, setTitle] = useState('');
    const [skillId, setSkillId] = useState<SkillType | ''>('');
    const [recurrence, setRecurrence] = useState<RecurrencePattern>('none');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isInbox, setIsInbox] = useState(false);

    const addTask = useLifeOSStore((s) => s.addTask);
    const today = getToday();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addTask({
                title: title.trim(),
                notes: null,
                scheduledDate: isInbox ? null : today,
                goalId: null,
                skillId: skillId || undefined,
                recurrence: recurrence,
                tagIds: selectedTags,
            });
            toast.success(isInbox ? 'In Inbox gespeichert! 📥' : 'Für heute geplant! 📅');

            // Reset
            setTitle('');
            setSkillId('');
            setRecurrence('none');
            setSelectedTags([]);
            setIsInbox(false);

            close();
        }
    };

    return (
        <Dialog open={isOpen} onClose={close} title="Neue Aufgabe">
            <form onSubmit={handleSubmit}>
                <Input
                    label="Was möchtest du erledigen?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="z.B. E-Mails beantworten"
                    autoFocus
                    required
                />
                <Select
                    label="Skill"
                    value={skillId}
                    onChange={(e) => setSkillId(e.target.value as any)}
                    options={[
                        { value: '', label: 'Keiner' },
                        ...SKILL_OPTIONS.map(o => ({ value: o.value, label: o.label }))
                    ]}
                    className="mt-4"
                />
                <Select
                    label="Wiederholung"
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as any)}
                    options={[
                        { value: 'none', label: 'Einmalig' },
                        { value: 'daily', label: 'Täglich' },
                        { value: 'weekly', label: 'Wöchentlich' },
                        { value: 'monthly', label: 'Monatlich' },
                    ]}
                />

                <div className="mt-4">
                    <p className="text-xs font-bold text-[var(--foreground-muted)] mb-2">Tags</p>
                    <TagSelector
                        selectedTagIds={selectedTags}
                        onToggle={(id) => setSelectedTags(prev =>
                            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
                        )}
                    />
                </div>

                <div className="flex items-center gap-2 mt-6 mb-2">
                    <input
                        type="checkbox"
                        id="inbox-check"
                        checked={isInbox}
                        onChange={(e) => setIsInbox(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                    />
                    <label htmlFor="inbox-check" className="text-sm text-[var(--foreground)]">In Inbox speichern (statt Heute)</label>
                </div>

                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={close}>
                        Abbrechen
                    </Button>
                    <Button type="submit" disabled={!title.trim()}>
                        Hinzufügen
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
