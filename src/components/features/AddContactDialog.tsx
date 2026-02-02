'use client';

import { useState } from 'react';
import { Dialog, DialogFooter, Input, Button, Select, toast, Textarea } from '@/components/ui';
import { useLifeOSStore } from '@/stores';
import { ContactCategory, ContactFrequency } from '@/types';

interface AddContactDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORY_OPTIONS = [
    { value: 'family', label: 'Familie' },
    { value: 'friend', label: 'Freunde' },
    { value: 'mentor', label: 'Mentoren' },
    { value: 'colleague', label: 'Kollegen' },
    { value: 'professional', label: 'Geschäftlich' },
    { value: 'other', label: 'Sonstiges' }
];

const FREQUENCY_OPTIONS = [
    { value: 'none', label: 'Keine Erinnerung' },
    { value: 'weekly', label: 'Wöchentlich' },
    { value: 'biweekly', label: 'Alle 2 Wochen' },
    { value: 'monthly', label: 'Monatlich' },
    { value: 'quarterly', label: 'Alle 3 Monate' },
    { value: 'yearly', label: 'Jährlich' }
];

export function AddContactDialog({ isOpen, onClose }: AddContactDialogProps) {
    const addContact = useLifeOSStore((s) => s.addContact);

    const [name, setName] = useState('');
    const [category, setCategory] = useState<ContactCategory>('friend');
    const [frequency, setFrequency] = useState<ContactFrequency>('monthly');
    const [birthday, setBirthday] = useState(''); // MM-DD
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            addContact({
                name: name.trim(),
                category,
                frequency,
                birthday: birthday || null,
                notes: notes.trim() || null,
                email: null,
                phone: null,
                importantDates: [],
                tags: []
            });
            toast.success(`${name.trim()} hinzugefügt! 🤝`);

            // Reset & Close
            setName('');
            setCategory('friend');
            setFrequency('monthly');
            setBirthday('');
            setNotes('');
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} title="Neuer Kontakt">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="z.B. Max Mustermann"
                    autoFocus
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Select
                        label="Kategorie"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        options={CATEGORY_OPTIONS}
                    />
                    <Select
                        label="Intervall"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value as any)}
                        options={FREQUENCY_OPTIONS}
                    />
                </div>

                <Input
                    label="Geburtstag (optional)"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    placeholder="MM-DD (z.B. 12-24)"
                />

                <Textarea
                    label="Notizen"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Wichtige Infos zu dieser Person..."
                    rows={3}
                />

                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Abbrechen
                    </Button>
                    <Button type="submit" disabled={!name.trim()}>
                        Kontakt anlegen
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}
