'use client';

import { useState, useEffect } from 'react';
import { Download, Upload, Trash2, Moon, Sun, Monitor, Shield, Database, Palette, Bell, BellOff, CheckCircle2, Layout, Type, Maximize2, Minimize2, Droplets, GripVertical, Eye, EyeOff, ArrowUp, ArrowDown, Tag as TagIcon, X, Edit2, Check, Plus, Smartphone, Lock, Unlock, Sparkles, UserCircle, Settings } from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Input, Dialog, DialogFooter, toast } from '@/components/ui';
import { useLifeOSStore, usePreferences, useHydration } from '@/stores';
import { downloadFile, getCurrentTimestamp, cn } from '@/lib/utils';
import { NotificationService } from '@/lib/notifications';
import type { ThemeMode } from '@/types';

// ─── Profile Section ────────────────────────────────────────────────────────

function ProfileSection() {
    const preferences = usePreferences();
    const updatePreferences = useLifeOSStore((s) => s.updatePreferences);
    const [name, setName] = useState(preferences.name);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        if (name.trim()) {
            updatePreferences({ name: name.trim() });
            setIsEditing(false);
            toast.success('Name aktualisiert! 👋');
        }
    };

    return (
        <Card variant="elevated" className="mb-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                    <UserCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--foreground)]">Dein Profil</h3>
                    {isEditing ? (
                        <div className="mt-2 flex flex-col sm:flex-row gap-2">
                            <Input
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                className="h-9 text-sm focus:ring-2 focus:ring-indigo-500/20"
                                autoFocus
                                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSave()}
                            />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleSave} className="flex-1 sm:flex-none">Speichern</Button>
                                <Button size="sm" variant="ghost" onClick={() => { setName(preferences.name); setIsEditing(false); }} className="flex-1 sm:flex-none">Abbrechen</Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--foreground-secondary)]">
                            Eingestellt auf: <span className="font-bold text-[var(--foreground)]">{preferences.name}</span>
                        </p>
                    )}
                </div>
                {!isEditing && (
                    <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                        Ändern
                    </Button>
                )}
            </div>
        </Card>
    );
}

// ─── Notification Section ───────────────────────────────────────────────────

function NotificationSection() {
    const preferences = usePreferences();
    const updatePreferences = useLifeOSStore((s) => s.updatePreferences);
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        setPermission(NotificationService.getPermission());
    }, []);

    const requestPermission = async () => {
        const result = await NotificationService.requestPermission();
        setPermission(result);
        if (result === 'granted') {
            toast.success('Benachrichtigungen aktiviert! 🔔');
            const currentNotifs = preferences.notifications || {
                enabled: false,
                morningBriefing: true,
                eveningReflection: true,
                taskDeadlines: true,
                habitReminders: true,
                streakWarnings: true,
            };
            updatePreferences({ notifications: { ...currentNotifs, enabled: true } });

            // Send test notification
            NotificationService.send('Lebensplaner ist bereit!', {
                body: 'Du erhältst jetzt wichtige Updates und Erinnerungen.',
            });
        } else if (result === 'denied') {
            toast.error('Berechtigung wurde verweigert. Bitte in den Browser-Einstellungen ändern.');
        }
    };

    const toggleNotif = (key: string) => {
        if (!preferences.notifications) return;
        // @ts-ignore
        const currentVal = preferences.notifications[key];
        updatePreferences({
            notifications: {
                ...preferences.notifications,
                [key]: !currentVal
            }
        });
    };

    if (!NotificationService.isSupported()) {
        return (
            <Card variant="elevated" className="opacity-60 grayscale cursor-not-allowed">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-500/10 flex items-center justify-center">
                        <BellOff className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[var(--foreground)]">Benachrichtigungen</h3>
                        <p className="text-xs text-[var(--foreground-secondary)]">Wird von deinem Browser nicht unterstützt</p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <Card variant="elevated">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                        permission === 'granted' ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-blue-500 shadow-lg shadow-blue-500/20"
                    )}>
                        <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-[var(--foreground)]">System-Benachrichtigungen</h3>
                        <p className="text-sm text-[var(--foreground-secondary)]">
                            {permission === 'granted' ? 'Berechtigung erteilt' : 'Erlaube Lebensplaner dir Hinweise zu senden'}
                        </p>
                    </div>
                    {permission !== 'granted' ? (
                        <Button onClick={requestPermission} size="sm">Aktivieren</Button>
                    ) : (
                        <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Aktiv
                        </div>
                    )}
                </div>
            </Card>

            {permission === 'granted' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in">
                    {[
                        { id: 'morningBriefing', label: 'Morgen-Briefing', desc: 'Täglich um 08:00 Uhr' },
                        { id: 'eveningReflection', label: 'Abend-Reflexion', desc: 'Täglich um 21:00 Uhr' },
                        { id: 'taskDeadlines', label: 'Task-Fälligkeit', desc: 'Warnung vor Deadlines' },
                        { id: 'habitReminders', label: 'Habit-Erinnerungen', desc: 'Basierend auf deinen Habits' },
                        { id: 'streakWarnings', label: 'Streak-Gefahr', desc: 'Bevor Serien abbrechen' }
                    ].map((item) => {
                        const isEnabled = preferences.notifications?.[item.id as keyof typeof preferences.notifications];
                        return (
                            <button
                                key={item.id}
                                onClick={() => toggleNotif(item.id as any)}
                                className={cn(
                                    "flex items-start gap-3 p-4 rounded-2xl border transition-all text-left",
                                    isEnabled
                                        ? "bg-[var(--accent-primary-light)] border-[var(--accent-primary)]"
                                        : "bg-[var(--background-surface)] border-[var(--border)] hover:border-[var(--border-strong)]"
                                )}
                            >
                                <div className={cn(
                                    "w-5 h-5 rounded-md border-2 mt-0.5 flex items-center justify-center transition-all",
                                    isEnabled ? "bg-[var(--accent-primary)] border-[var(--accent-primary)]" : "border-[var(--border-strong)]"
                                )}>
                                    {isEnabled && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[var(--foreground)]">{item.label}</p>
                                    <p className="text-[10px] text-[var(--foreground-muted)] uppercase font-bold tracking-wider">{item.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}



function ThemeSelector() {
    const preferences = usePreferences();
    const updatePreferences = useLifeOSStore((s) => s.updatePreferences);

    const themes: { value: ThemeMode; label: string; icon: typeof Sun; gradient: string }[] = [
        { value: 'light', label: 'Hell', icon: Sun, gradient: 'from-amber-400 to-orange-500' },
        { value: 'dark', label: 'Dunkel', icon: Moon, gradient: 'from-indigo-500 to-purple-600' },
        { value: 'system', label: 'System', icon: Monitor, gradient: 'from-slate-500 to-slate-600' },
    ];

    return (
        <div className="grid grid-cols-3 gap-3">
            {themes.map(({ value, label, icon: Icon, gradient }) => {
                const isActive = preferences.theme === value;

                return (
                    <button
                        key={value}
                        onClick={() => updatePreferences({ theme: value })}
                        className={cn(
                            'relative flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300',
                            'hover:scale-[1.02] active:scale-[0.98]',
                            isActive
                                ? 'bg-gradient-to-br text-white shadow-lg'
                                : 'bg-[var(--background-surface)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--border-strong)]',
                            isActive && gradient
                        )}
                    >
                        <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center',
                            isActive ? 'bg-white/20' : 'bg-[var(--background-elevated)]'
                        )}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-sm font-medium">{label}</span>

                        {/* Selected ring */}
                        {isActive && (
                            <div className="absolute inset-0 rounded-2xl ring-2 ring-white/50 ring-offset-2 ring-offset-[var(--background)]" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

// ─── Appearance Section ──────────────────────────────────────────────────────

function AppearanceSection() {
    const preferences = usePreferences();
    const updatePreferences = useLifeOSStore((s) => s.updatePreferences);

    const presets: { id: any; label: string; color: string; bg: string }[] = [
        { id: 'none', label: 'Standard', color: '#6366f1', bg: 'bg-[#6366f1]' },
        { id: 'forest', label: 'Wald', color: '#10b981', bg: 'bg-[#10b981]' },
        { id: 'ocean', label: 'Ozean', color: '#0ea5e9', bg: 'bg-[#0ea5e9]' },
        { id: 'sunset', label: 'Sonnenuntergang', color: '#f43f5e', bg: 'bg-[#f43f5e]' },
        { id: 'midnight', label: 'Mitternacht', color: '#8b5cf6', bg: 'bg-[#8b5cf6]' },
    ];

    const fontSizes: { id: any; label: string; icon: any }[] = [
        { id: 'small', label: 'Klein', icon: Type },
        { id: 'medium', label: 'Mittel', icon: Type },
        { id: 'large', label: 'Groß', icon: Type },
    ];

    const colors = [
        '#6366f1', '#10b981', '#0ea5e9', '#f43f5e', '#8b5cf6',
        '#f59e0b', '#ec4899', '#06b6d4', '#84cc16'
    ];

    const updateAppearance = (updates: Partial<typeof preferences.appearance>) => {
        updatePreferences({
            appearance: {
                ...preferences.appearance,
                ...updates
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Themes */}
            <div>
                <p className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-3">Farbschema & Presets</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {presets.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => updateAppearance({ themePreset: preset.id })}
                            className={cn(
                                "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                                preferences.appearance.themePreset === preset.id
                                    ? "bg-[var(--background-elevated)] border-[var(--accent-primary)] shadow-sm"
                                    : "bg-[var(--background-surface)] border-[var(--border)] hover:border-[var(--border-strong)]"
                            )}
                        >
                            <div className={cn("w-8 h-8 rounded-full shadow-inner", preset.bg)} />
                            <span className="text-[10px] font-bold">{preset.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Accent Color (only if no preset) */}
            {preferences.appearance.themePreset === 'none' && (
                <div className="animate-fade-in">
                    <p className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-3 flex items-center gap-2">
                        <Droplets className="w-3 h-3" /> Eigene Akzentfarbe
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => updateAppearance({ accentColor: color })}
                                className={cn(
                                    "w-8 h-8 rounded-full border-2 transition-all p-0.5",
                                    preferences.appearance.accentColor === color ? "border-[var(--accent-primary)] scale-110" : "border-transparent hover:scale-105"
                                )}
                            >
                                <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />
                            </button>
                        ))}
                        <input
                            type="color"
                            value={preferences.appearance.accentColor}
                            onChange={(e) => updateAppearance({ accentColor: e.target.value })}
                            className="w-8 h-8 rounded-full bg-transparent border-none cursor-pointer p-0"
                        />
                    </div>
                </div>
            )}

            {/* Font Size & Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-3">Schriftgröße</p>
                    <div className="flex bg-[var(--background-elevated)] p-1 rounded-2xl border border-[var(--border)]">
                        {fontSizes.map((size) => (
                            <button
                                key={size.id}
                                onClick={() => updateAppearance({ fontSize: size.id })}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all",
                                    preferences.appearance.fontSize === size.id
                                        ? "bg-[var(--background-surface)] text-[var(--accent-primary)] shadow-sm"
                                        : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                                )}
                            >
                                <size.icon className={cn(
                                    size.id === 'small' ? 'w-3 h-3' : size.id === 'medium' ? 'w-4 h-4' : 'w-5 h-5'
                                )} />
                                {size.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-3">Layout-Dichte</p>
                    <button
                        onClick={() => updateAppearance({ compactMode: !preferences.appearance.compactMode })}
                        className={cn(
                            "w-full flex items-center justify-between p-3 rounded-2xl border transition-all",
                            preferences.appearance.compactMode
                                ? "bg-[var(--accent-primary-light)] border-[var(--accent-primary)]"
                                : "bg-[var(--background-surface)] border-[var(--border)] hover:border-[var(--border-strong)]"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center",
                                preferences.appearance.compactMode ? "bg-[var(--accent-primary)] text-white" : "bg-[var(--background-elevated)] text-[var(--foreground-muted)]"
                            )}>
                                {preferences.appearance.compactMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold">Kompakt-Modus</p>
                                <p className="text-[10px] text-[var(--foreground-muted)]">{preferences.appearance.compactMode ? 'Aktiviert' : 'Deaktiviert'}</p>
                            </div>
                        </div>
                        <div className={cn(
                            "w-10 h-5 rounded-full relative transition-colors",
                            preferences.appearance.compactMode ? "bg-[var(--accent-primary)]" : "bg-[var(--background-elevated)]"
                        )}>
                            <div className={cn(
                                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                                preferences.appearance.compactMode ? "left-6" : "left-1"
                            )} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}



// ─── Tag Section ────────────────────────────────────────────────────────────

function TagSection() {
    const tags = useLifeOSStore((s) => s.tags);
    const addTag = useLifeOSStore((s) => s.addTag);
    const updateTag = useLifeOSStore((s) => s.updateTag);
    const deleteTag = useLifeOSStore((s) => s.deleteTag);

    const [isAdding, setIsAdding] = useState(false);
    const [newLabel, setNewLabel] = useState('');
    const [newColor, setNewColor] = useState('#6366f1');

    const [editingTag, setEditingTag] = useState<{ id: string, label: string, color: string } | null>(null);

    const handleAdd = () => {
        if (!newLabel.trim()) return;
        addTag({ label: newLabel, color: newColor });
        setNewLabel('');
        setIsAdding(false);
        toast.success('Tag hinzugefügt! 🏷️');
    };

    const handleUpdate = () => {
        if (!editingTag || !editingTag.label.trim()) return;
        updateTag(editingTag.id, { label: editingTag.label, color: editingTag.color });
        setEditingTag(null);
        toast.success('Tag aktualisiert!');
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tags.map((tag) => (
                    <div key={tag.id} className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--background-surface)] flex items-center gap-3 group transition-all hover:border-[var(--accent-primary)]/30">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                        <span className="flex-1 text-sm font-medium text-[var(--foreground)] truncate">{tag.label}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setEditingTag({ id: tag.id, label: tag.label, color: tag.color })}
                                className="p-1.5 hover:bg-[var(--background-elevated)] rounded-lg"
                            >
                                <Edit2 className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                            </button>
                            <button
                                onClick={() => deleteTag(tag.id)}
                                className="p-1.5 hover:bg-red-500/10 rounded-lg"
                            >
                                <X className="w-3.5 h-3.5 text-red-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isAdding ? (
                <Card variant="elevated" className="border-dashed border-2 animate-fade-in">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${newColor}20`, color: newColor }}>
                                <TagIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <input
                                    autoFocus
                                    className="w-full bg-transparent border-b border-[var(--border)] py-1.5 text-sm font-bold text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-primary)]"
                                    placeholder="Tag Name..."
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                />
                            </div>
                            <div className="relative group">
                                <input
                                    type="color"
                                    className="w-8 h-8 rounded-lg overflow-hidden bg-transparent cursor-pointer border-none p-0"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--background-elevated)] text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[var(--border)]">
                                    Farbe wählen
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Abbrechen</Button>
                            <Button size="sm" onClick={handleAdd} disabled={!newLabel.trim()}>Erstellen</Button>
                        </div>
                    </div>
                </Card>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full h-12 rounded-2xl border-2 border-dashed border-[var(--border)] flex items-center justify-center gap-2 text-sm font-bold text-[var(--foreground-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)]/50 transition-all hover:bg-[var(--accent-primary-light)]/10 group"
                >
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Neuen Tag erstellen
                </button>
            )}

            {/* Edit Dialog */}
            <Dialog
                open={!!editingTag}
                onClose={() => setEditingTag(null)}
                title="Tag bearbeiten"
                description="Passe Name und Farbe für diesen Tag an."
            >
                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <p className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-1.5">Label</p>
                            <input
                                className="w-full bg-[var(--background-surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm font-bold text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-primary)]"
                                value={editingTag?.label || ''}
                                onChange={(e) => editingTag && setEditingTag({ ...editingTag, label: e.target.value })}
                            />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] mb-1.5">Farbe</p>
                            <input
                                type="color"
                                className="w-10 h-10 rounded-xl overflow-hidden bg-transparent cursor-pointer border border-[var(--border)] p-0"
                                value={editingTag?.color || '#000000'}
                                onChange={(e) => editingTag && setEditingTag({ ...editingTag, color: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setEditingTag(null)}>Abbrechen</Button>
                    <Button onClick={handleUpdate}>Änderungen speichern</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}

// ─── Settings Card ───────────────────────────────────────────────────────────

interface SettingsCardProps {
    icon: typeof Download;
    iconColor: string;
    title: string;
    description: string;
    action: React.ReactNode;
}

function SettingsCard({ icon: Icon, iconColor, title, description, action }: SettingsCardProps) {
    return (
        <Card variant="elevated" className="mb-4">
            <div className="flex items-center gap-4">
                <div className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
                    'bg-gradient-to-br shadow-lg',
                    iconColor
                )}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--foreground)]">{title}</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                        {description}
                    </p>
                </div>
                {action}
            </div>
        </Card>
    );
}

// ─── Export Section ──────────────────────────────────────────────────────────

function ExportSection() {
    const exportAllData = useLifeOSStore((s) => s.exportAllData);

    const handleExport = () => {
        const data = exportAllData();
        const timestamp = getCurrentTimestamp().replace(/[:.]/g, '-');
        downloadFile(data, `lebensplaner-export-${timestamp}.json`, 'application/json');
        toast.success('Daten exportiert! 📥');
    };

    return (
        <SettingsCard
            icon={Download}
            iconColor="from-blue-500 to-cyan-500"
            title="Daten exportieren"
            description="Lade alle deine Daten als JSON-Datei herunter"
            action={
                <Button variant="secondary" onClick={handleExport}>
                    Export
                </Button>
            }
        />
    );
}



// ─── Delete All Data ─────────────────────────────────────────────────────────

function DeleteDataSection() {
    const [showConfirm, setShowConfirm] = useState(false);
    const clearAllData = useLifeOSStore((s) => s.clearAllData);

    const handleDelete = () => {
        clearAllData();
        toast.success('Alle Daten gelöscht');
        setShowConfirm(false);
    };

    return (
        <>
            <Card variant="elevated" className="border-l-4 border-l-[var(--accent-error)]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
                        <Trash2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--foreground)]">Alle Daten löschen</h3>
                        <p className="text-sm text-[var(--foreground-secondary)]">
                            Diese Aktion kann nicht rückgängig gemacht werden
                        </p>
                    </div>
                    <Button variant="destructive" onClick={() => setShowConfirm(true)}>
                        Löschen
                    </Button>
                </div>
            </Card>

            <Dialog
                open={showConfirm}
                onClose={() => setShowConfirm(false)}
                title="Alle Daten löschen?"
                description="Bist du sicher? Alle Ziele, Aufgaben, Gewohnheiten und Reflexionen werden unwiderruflich gelöscht."
            >
                <div className="flex items-center justify-center py-6">
                    <div className="w-20 h-20 rounded-3xl bg-[var(--accent-error-light)] flex items-center justify-center">
                        <Trash2 className="w-10 h-10 text-[var(--accent-error)]" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                        Abbrechen
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Ja, alles löschen
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

// ─── PWA Install Section ─────────────────────────────────────────────────────

function InstallPWASection() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
        });

        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        });

        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    if (isInstalled) return null; // Already installed or running in standalone

    return (
        <Card variant="elevated" className="mb-4 border-l-4 border-l-[var(--accent-primary)]">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/10 flex items-center justify-center shrink-0">
                    <Smartphone className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--foreground)]">App installieren</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                        Installiere den Lebensplaner für die beste Erfahrung (Offline-Modus, Fullscreen)
                    </p>
                </div>
                <Button onClick={handleInstall} disabled={!deferredPrompt} className="gap-2">
                    <Download className="w-4 h-4" />
                    Installieren
                </Button>
            </div>
        </Card>
    );
}

// ─── Security Section ────────────────────────────────────────────────────────

function SecuritySection() {
    const preferences = usePreferences();
    const updatePreferences = useLifeOSStore((s) => s.updatePreferences);

    // Local state for PIN setup
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isSettingUp, setIsSettingUp] = useState(false);

    const isLockedEnabled = preferences.security?.enabled || false;

    const handleEnable = () => {
        setIsSettingUp(true);
        setPin('');
        setConfirmPin('');
    };

    const handleDisable = () => {
        updatePreferences({
            security: {
                enabled: false,
                pin: null,
                lockAfterMinutes: 0
            }
        });
        toast.success('App-Sperre deaktiviert');
    };

    const handleSavePin = () => {
        if (pin.length !== 4) return toast.error('PIN muss 4 Stellen haben');
        if (pin !== confirmPin) return toast.error('PINs stimmen nicht überein');

        updatePreferences({
            security: {
                enabled: true,
                pin: pin,
                lockAfterMinutes: 0 // Default: Immediate
            }
        });
        setIsSettingUp(false);
        toast.success('App-Sperre aktiviert! 🔒');
    };

    return (
        <Card variant="elevated" className={cn("mb-4 border-l-4", isLockedEnabled ? "border-l-emerald-500" : "border-l-[var(--foreground-muted)]")}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all",
                        isLockedEnabled ? "bg-emerald-500/10 text-emerald-500" : "bg-[var(--background-elevated)] text-[var(--foreground-muted)]"
                    )}>
                        {isLockedEnabled ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--foreground)]">App-Sperre</h3>
                        <p className="text-sm text-[var(--foreground-secondary)]">
                            Schütze dein Journal und deine Ziele mit einer PIN.
                        </p>
                    </div>
                    {isLockedEnabled ? (
                        <Button variant="ghost" size="sm" onClick={handleDisable} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            Deaktivieren
                        </Button>
                    ) : (
                        <Button size="sm" onClick={handleEnable} disabled={isSettingUp}>
                            Aktivieren
                        </Button>
                    )}
                </div>

                {isSettingUp && (
                    <div className="pt-4 border-t border-[var(--border)] animate-fade-in flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-[var(--foreground-muted)] uppercase mb-1 block">Neue PIN</label>
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="----"
                                    className="w-full bg-[var(--background-subtle)] border border-[var(--border)] rounded-lg px-3 py-2 text-center font-mono tracking-widest focus:outline-none focus:border-[var(--accent-primary)]"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[var(--foreground-muted)] uppercase mb-1 block">Bestätigen</label>
                                <input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="----"
                                    className="w-full bg-[var(--background-subtle)] border border-[var(--border)] rounded-lg px-3 py-2 text-center font-mono tracking-widest focus:outline-none focus:border-[var(--accent-primary)]"
                                    value={confirmPin}
                                    onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <Button variant="ghost" size="sm" onClick={() => setIsSettingUp(false)}>Abbrechen</Button>
                            <Button size="sm" onClick={handleSavePin} disabled={pin.length !== 4 || pin !== confirmPin}>Speichern</Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

function SettingsPageSkeleton() {
    return (
        <PageContainer>
            <div className="animate-pulse">
                <div className="h-8 w-36 skeleton rounded-xl mb-2" />
                <div className="h-4 w-56 skeleton rounded-lg mb-8" />
                <div className="h-6 w-40 skeleton rounded-lg mb-4" />
                <div className="grid grid-cols-3 gap-3 mb-8">
                    <div className="h-28 skeleton rounded-2xl" />
                    <div className="h-28 skeleton rounded-2xl" />
                    <div className="h-28 skeleton rounded-2xl" />
                </div>
                <div className="h-6 w-40 skeleton rounded-lg mb-4" />
                <div className="h-20 skeleton rounded-2xl mb-4" />
                <div className="h-20 skeleton rounded-2xl" />
            </div>
        </PageContainer>
    );
}

// ─── Settings Page ───────────────────────────────────────────────────────────

export default function SettingsPage() {
    const [mounted, setMounted] = useState(false);
    const isHydrated = useHydration();
    const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'data'>('general');

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isHydrated) {
        return <SettingsPageSkeleton />;
    }

    const tabs = [
        { id: 'general', label: 'Allgemein', icon: UserCircle },
        { id: 'appearance', label: 'Erscheinungsbild', icon: Palette },
        { id: 'data', label: 'Daten & System', icon: Database },
    ];

    return (
        <PageContainer width="wide">
            {/* Premium Header */}
            <div className="relative mb-12 animate-fade-in overflow-hidden rounded-[2.5rem] bg-[var(--background-surface)] border border-[var(--border)] p-12 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)] flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Settings className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tight italic uppercase">Einstellungen</h1>
                    </div>
                    <p className="text-[var(--foreground-secondary)] text-lg max-w-2xl font-medium">
                        Konfiguriere deinen digitalen Lebensraum und passe alles an deine Workflow-Bedürfnisse an.
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1.5 bg-[var(--background-surface)] border border-[var(--border)] rounded-2xl mb-12 shadow-sm shrink-0 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                            activeTab === tab.id
                                ? "bg-[var(--accent-primary)] text-white shadow-lg shadow-indigo-500/20 scale-[1.02]"
                                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-elevated)]"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-12 min-h-[500px]">
                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="animate-fade-in-up space-y-10">
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <UserCircle className="w-6 h-6 text-[var(--accent-primary)]" />
                                <h2 className="text-xl font-black uppercase italic text-[var(--foreground)]">Benutzerprofil</h2>
                            </div>
                            <ProfileSection />
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-6 h-6 text-[var(--accent-primary)]" />
                                <h2 className="text-xl font-black uppercase italic text-[var(--foreground)]">Sicherheit & Schutz</h2>
                            </div>
                            <SecuritySection />
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Bell className="w-6 h-6 text-[var(--accent-primary)]" />
                                <h2 className="text-xl font-black uppercase italic text-[var(--foreground)]">Benachrichtigungs-Center</h2>
                            </div>
                            <NotificationSection />
                        </section>
                    </div>
                )}

                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                    <div className="animate-fade-in-up space-y-10">
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Monitor className="w-6 h-6 text-[var(--accent-primary)]" />
                                <h2 className="text-xl font-black uppercase italic text-[var(--foreground)]">Farbgrundton & Modus</h2>
                            </div>
                            <ThemeSelector />
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Palette className="w-6 h-6 text-[var(--accent-primary)]" />
                                <h2 className="text-xl font-black uppercase italic text-[var(--foreground)]">Erscheinungsbild Anpassen</h2>
                            </div>
                            <AppearanceSection />
                        </section>

                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <TagIcon className="w-6 h-6 text-[var(--accent-primary)]" />
                                <h2 className="text-xl font-black uppercase italic text-[var(--foreground)]">Tags & Labels</h2>
                            </div>
                            <TagSection />
                        </section>
                    </div>
                )}

                {/* Data Tab */}
                {activeTab === 'data' && (
                    <div className="animate-fade-in-up space-y-10">
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Database className="w-6 h-6 text-[var(--accent-primary)]" />
                                <h2 className="text-xl font-black uppercase italic text-[var(--foreground)]">Datenverwaltung</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ExportSection />
                                <InstallPWASection />
                            </div>
                        </section>

                        <section className="pt-8 border-t border-red-500/10">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-6 h-6 text-[var(--accent-error)]" />
                                <h2 className="text-xl font-black uppercase italic text-[var(--accent-error)]">Gefahrenzone</h2>
                            </div>
                            <DeleteDataSection />
                        </section>
                    </div>
                )}
            </div>

            {/* Version Info */}
            <div className="mt-20 text-center animate-fade-in-up">
                <div className="inline-flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                        <span>Life OS</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
                        <span>v1.2.0</span>
                    </div>
                    <p className="text-[10px] text-[var(--foreground-subtle)] font-bold uppercase tracking-wider mt-2">
                        Designed for high performance & mental clarity
                    </p>
                </div>
            </div>
        </PageContainer>
    );
}
