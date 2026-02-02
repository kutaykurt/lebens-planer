'use client';

import { useState } from 'react';
import { Dialog, DialogFooter, Input, Button, Select, toast } from '@/components/ui';
import { useLifeOSStore } from '@/stores';
import { getToday } from '@/lib/utils';
import { TagSelector } from './TagSelector';
import { SkillType, RecurrencePattern } from '@/types';
import { SKILL_OPTIONS } from '@/lib/constants';

interface AddTaskDialogProps {
    open: boolean;
    onClose: () => void;
    initialDate?: string | null;
}

export function AddTaskDialog({ open, onClose, initialDate }: AddTaskDialogProps) {
    const [title, setTitle] = useState('');
    const [skillId, setSkillId] = useState<SkillType | ''>('');
    const [recurrence, setRecurrence] = useState<RecurrencePattern>('none');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

    const addTask = useLifeOSStore((s) => s.addTask);
    const today = getToday();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addTask({
                title: title.trim(),
                notes: null,
                scheduledDate: initialDate !== undefined ? initialDate : today,
                goalId: null,
                skillId: skillId || undefined,
                recurrence: recurrence,
                tagIds: selectedTags,
                priority,
            });
            toast.success('Aufgabe hinzugefügt! 🎉');

            // Reset
            setTitle('');
            setSkillId('');
            setRecurrence('none');
            setSelectedTags([]);
            setPriority('medium');

            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} title="Neue Aufgabe">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Was möchtest du erledigen?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="z.B. E-Mails beantworten"
                    autoFocus
                    required
                />

                <Select
                    label="Priorität"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    options={[
                        { value: 'low', label: 'Niedrig' },
                        { value: 'medium', label: 'Mittel' },
                        { value: 'high', label: 'Hoch' },
                    ]}
                />

                <Select
                    label="Skill"
                    value={skillId}
                    onChange={(e) => setSkillId(e.target.value as any)}
                    options={[
                        { value: '', label: 'Keiner' },
                        ...SKILL_OPTIONS.map(o => ({ value: o.value, label: o.label }))
                    ]}
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

                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>
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
