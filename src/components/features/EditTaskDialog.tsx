'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogFooter, Input, Textarea, Select, Button, toast } from '@/components/ui';
import { useLifeOSStore } from '@/stores';
import { Task, SkillType, RecurrencePattern } from '@/types';
import { SKILL_OPTIONS } from '@/lib/constants';
import { Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditTaskDialogProps {
    task: Task | null;
    open: boolean;
    onClose: () => void;
}

export function EditTaskDialog({ task, open, onClose }: EditTaskDialogProps) {
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [priority, setPriority] = useState<Task['priority']>('medium');
    const [skillId, setSkillId] = useState<SkillType | ''>('');
    const [recurrence, setRecurrence] = useState<RecurrencePattern>('none');
    const [newSubtask, setNewSubtask] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const updateTask = useLifeOSStore((s) => s.updateTask);
    const addSubtask = useLifeOSStore((s) => s.addSubtask);
    const toggleSubtask = useLifeOSStore((s) => s.toggleSubtask);
    const deleteSubtask = useLifeOSStore((s) => s.deleteSubtask);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setNotes(task.notes || '');
            setPriority(task.priority || 'medium');
            setSkillId(task.skillId || '');
            setRecurrence(task.recurrence || 'none');
            setSelectedTags(task.tagIds || []);
        }
    }, [task, open]);

    const handleAddSubtask = () => {
        if (task && newSubtask.trim()) {
            addSubtask(task.id, newSubtask.trim());
            setNewSubtask('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (task && title.trim()) {
            updateTask(task.id, {
                title: title.trim(),
                notes: notes.trim() || null,
                priority,
                skillId: skillId || undefined,
                recurrence,
                tagIds: selectedTags,
            });
            toast.success('Aufgabe aktualisiert! ✨');
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} title="Aufgabe bearbeiten">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Titel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Was möchtest du erledigen?"
                    autoFocus
                    required
                />
                <Textarea
                    label="Notizen (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Details hinzufügen..."
                    className="min-h-[100px]"
                />
                <Select
                    label="Priorität"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    options={[
                        { value: 'low', label: 'Niedrig (Blau)' },
                        { value: 'medium', label: 'Mittel (Gelb/Standard)' },
                        { value: 'high', label: 'Hoch (Rot)' },
                    ]}
                />
                <Select
                    label="Skill (XP-Zuweisung)"
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

                <div className="pt-4 border-t border-[var(--border-subtle)]">
                    <label className="text-sm font-semibold text-[var(--foreground)] mb-3 block">Subtasks</label>
                    <div className="space-y-2 mb-4">
                        {task?.subtasks?.map(st => (
                            <div key={st.id} className="flex items-center gap-2 group">
                                <button
                                    type="button"
                                    onClick={() => toggleSubtask(task.id, st.id)}
                                    className={cn(
                                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                                        st.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-[var(--border-strong)]"
                                    )}
                                >
                                    {st.completed && <CheckCircle2 className="w-3 h-3" />}
                                </button>
                                <span className={cn("text-sm flex-1", st.completed && "line-through text-muted-foreground")}>{st.title}</span>
                                <button
                                    type="button"
                                    onClick={() => deleteSubtask(task.id, st.id)}
                                    className="p-1 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Neuer Subtask..."
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                        />
                        <Button type="button" size="icon" onClick={handleAddSubtask} disabled={!newSubtask.trim()}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Abbrechen
                    </Button>
                    <Button type="submit" disabled={!title.trim()}>
                        Speichern
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
