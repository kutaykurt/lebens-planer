'use client';

import { useState, useMemo } from 'react';
import {
    Plus, Brain, Target, Rocket, Repeat,
    CheckCircle2, Circle, Flame, Search,
    ArrowRight, MessageSquare, Shield,
    Zap, Sparkles, Folder, Calendar,
    PlusCircle, ListTodo, FileText, TrendingUp,
    X, Trash2
} from 'lucide-react';
import { PageContainer } from '@/components/layout';
import { Card, Button, Input, Textarea, toast } from '@/components/ui';
import { useLifeOSStore, useTodaysTasks, useActiveHabits } from '@/stores';
import { getToday, cn, generateId } from '@/lib/utils';
import { Task, Note, Goal, Project } from '@/types';

export default function OmniDashboard() {
    const today = getToday();

    // Store data
    const tasks = useTodaysTasks();
    const activeHabits = useActiveHabits();
    const notes = useLifeOSStore((s) => s.notes);
    const goals = useLifeOSStore((s) => s.goals);
    const projects = useLifeOSStore((s) => s.projects);
    const habitLogs = useLifeOSStore((s) => s.habitLogs);

    // Filtered Content
    const [searchQuery, setSearchQuery] = useState('');
    const filteredNotes = useMemo(() => {
        return notes
            .filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            .slice(0, 5);
    }, [notes, searchQuery]);

    const activeGoals = goals.filter(g => g.status === 'active').slice(0, 3);
    const activeProjects = projects.filter(p => p.status === 'active').slice(0, 3);

    // Actions
    const addTask = useLifeOSStore((s) => s.addTask);
    const completeTask = useLifeOSStore((s) => s.completeTask);
    const uncompleteTask = useLifeOSStore((s) => s.uncompleteTask);
    const deleteTask = useLifeOSStore((s) => s.deleteTask);
    const addNote = useLifeOSStore((s) => s.addNote);
    const toggleHabit = useLifeOSStore((s) => s.toggleHabitForDate);
    const addGoal = useLifeOSStore((s) => s.addGoal);
    const addProject = useLifeOSStore((s) => s.addProject);

    // State for editing
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    // Inline Add state
    const [newTask, setNewTask] = useState('');
    const [newNote, setNewNote] = useState('');
    const [newGoal, setNewGoal] = useState('');

    const updateTask = useLifeOSStore((s) => s.updateTask);
    const updateNote = useLifeOSStore((s) => s.updateNote);
    const updateGoal = useLifeOSStore((s) => s.updateGoal);
    const updateProject = useLifeOSStore((s) => s.updateProject);
    const deleteNote = useLifeOSStore((s) => s.deleteNote);
    const deleteGoal = useLifeOSStore((s) => s.deleteGoal);
    const deleteProject = useLifeOSStore((s) => s.deleteProject);

    // Helpers
    const handleAdd = (type: 'task' | 'note' | 'goal', value: string) => {
        if (!value.trim()) return;
        if (type === 'task') {
            addTask({ title: value, scheduledDate: today, status: 'pending', priority: 'medium', tagIds: [], notes: null, goalId: null } as any);
            setNewTask('');
        } else if (type === 'note') {
            addNote({ title: value.split('\n')[0].substring(0, 30), content: value, tagIds: [], isPinned: false } as any);
            setNewNote('');
        } else if (type === 'goal') {
            addGoal({ title: value, category: 'other', timeHorizon: 'short', status: 'active', progress: 0, description: null, projectId: null, tagIds: [] } as any);
            setNewGoal('');
        }
        toast.success('Hinzugefügt');
    };

    const preferences = useLifeOSStore((s) => s.preferences);
    const userName = preferences?.name || 'User';

    return (
        <PageContainer width="full" className="text-[var(--foreground)] pb-32">
            {/* ─── WELCOME HEADER ─── */}
            <div className="mb-16 relative">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-indigo-600 mb-4 animate-fade-in">
                        <div className="p-2 bg-indigo-100 rounded-xl">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Willkommen zurück</span>
                    </div>

                    <h1 className="text-6xl font-black tracking-tighter leading-tight">
                        Schön, dass du da bist, <br />
                        <span className="text-indigo-600 italic">
                            {userName}.
                        </span>
                    </h1>

                    <p className="text-[var(--foreground-secondary)] text-xl mt-6 font-medium max-w-2xl leading-relaxed">
                        Hier ist deine <span className="font-black italic text-indigo-600">Übersicht</span> – bereit für neue Erfolge heute?
                    </p>
                </div>
            </div>

            {/* ─── 3 COLUMN COMMAND CENTER ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                {/* SPALTE 1: TAGESPLAN */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600">
                                <ListTodo className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">Heute</h2>
                        </div>
                        <div className="bg-indigo-50 px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-wider">
                            {tasks.length} offen
                        </div>
                    </div>

                    {/* Quick Add Task */}
                    <div className="relative group">
                        <Input
                            placeholder="Neue Aufgabe hinzufügen..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd('task', newTask)}
                            className="bg-[var(--background-surface)] border-[var(--border)] h-12 pl-12 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
                    </div>

                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <Card key={task.id} variant="glass" className="p-4 rounded-2xl border-[var(--border)] hover:border-indigo-500/30 transition-all flex items-center gap-4 group">
                                <button
                                    onClick={() => task.status === 'completed' ? uncompleteTask(task.id) : completeTask(task.id)}
                                    className="shrink-0"
                                >
                                    {task.status === 'completed'
                                        ? <CheckCircle2 className="w-6 h-6 text-indigo-500" />
                                        : <Circle className="w-6 h-6 text-[var(--foreground-subtle)] hover:text-indigo-500 transition-colors" />}
                                </button>

                                {editingId === task.id ? (
                                    <Input
                                        autoFocus
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onBlur={() => {
                                            updateTask(task.id, { title: editValue });
                                            setEditingId(null);
                                        }}
                                        onKeyDown={(e) => e.key === 'Enter' && (updateTask(task.id, { title: editValue }), setEditingId(null))}
                                        className="flex-1 h-8 bg-transparent border-none p-0 focus:ring-0 font-bold"
                                    />
                                ) : (
                                    <span
                                        onClick={() => { setEditingId(task.id); setEditValue(task.title); }}
                                        className={cn(
                                            "flex-1 text-sm font-bold truncate cursor-text",
                                            task.status === 'completed' && "line-through opacity-30"
                                        )}
                                    >
                                        {task.title}
                                    </span>
                                )}

                                <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-2 hover:text-red-500 transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </Card>
                        ))}
                    </div>

                    <div className="pt-10 border-t border-zinc-100">
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <Flame className="w-3.5 h-3.5 text-emerald-500" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/70">Deine Routinen</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {activeHabits.map((habit) => {
                                const isDone = habitLogs.some(l => l.habitId === habit.id && l.date === today && l.completed);
                                return (
                                    <button
                                        key={habit.id}
                                        onClick={() => toggleHabit(habit.id, today)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                            isDone
                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-sm"
                                                : "bg-[var(--background-surface)] border-[var(--border)] text-[var(--foreground-muted)]"
                                        )}
                                    >
                                        <Flame className={cn("w-3 h-3", isDone && "fill-current animate-pulse")} />
                                        {habit.title}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* SPALTE 2: WISSEN */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600">
                                <Brain className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">Gedanken</h2>
                        </div>
                        <button onClick={() => window.location.href = '/wiki'} className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-purple-600 transition-colors">Notizen & Wiki</button>
                    </div>

                    {/* Quick Add Note */}
                    <div className="relative group">
                        <Textarea
                            placeholder="Einen schnellen Gedanken festhalten..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAdd('note', newNote))}
                            className="bg-[var(--background-surface)] border-[var(--border)] min-h-[100px] p-4 pt-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-500/20 resize-none"
                        />
                        <div className="absolute right-4 bottom-4 flex items-center gap-2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                            <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Enter zum Speichern</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredNotes.map((note) => (
                            <Card key={note.id} variant="glass" className="p-5 rounded-3xl border-[var(--border)] hover:border-purple-500/30 transition-all group relative overflow-hidden">
                                {editingId === note.id ? (
                                    <div className="space-y-3">
                                        <Input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="bg-[var(--background-elevated)] border-none font-black uppercase italic"
                                        />
                                        <Textarea
                                            autoFocus
                                            defaultValue={note.content}
                                            onBlur={(e) => {
                                                updateNote(note.id, { title: editValue, content: e.target.value });
                                                setEditingId(null);
                                            }}
                                            className="bg-transparent border-none p-0 focus:ring-0 text-xs italic min-h-[80px] resize-none"
                                        />
                                    </div>
                                ) : (
                                    <div onClick={() => { setEditingId(note.id); setEditValue(note.title); }}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-sm font-black uppercase italic tracking-tight group-hover:text-purple-500 transition-colors">
                                                {note.title}
                                            </h3>
                                            <div className="flex gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} className="p-1 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-[var(--foreground-muted)] font-medium line-clamp-3 italic">
                                            {note.content}
                                        </p>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>

                {/* SPALTE 3: STRATEGIE */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-600">
                                <Target className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">Strategie</h2>
                        </div>
                        <button onClick={() => window.location.href = '/focus'} className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600 transition-colors">Fokus-Hub</button>
                    </div>

                    {/* Quick Add Goal/Project */}
                    <div className="relative group">
                        <Input
                            placeholder="Neues Ziel oder Projekt..."
                            value={newGoal}
                            onChange={(e) => setNewGoal(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd('goal', newGoal)}
                            className="bg-[var(--background-surface)] border-[var(--border)] h-12 pl-12 rounded-2xl shadow-sm"
                        />
                        <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500" />
                    </div>

                    {/* PROJEKTE UND ZIELE GEMISCHT ODER GETRENNT - HIER DIREKT EDITIERBAR */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            {activeProjects.map(project => (
                                <Card key={project.id} className="p-5 bg-[var(--background-surface)] border-[var(--border)] rounded-3xl shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            {editingId === project.id ? (
                                                <Input
                                                    autoFocus
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={() => { updateProject(project.id, { title: editValue }); setEditingId(null); }}
                                                    className="h-6 bg-transparent border-none p-0 text-xs font-black uppercase tracking-widest focus:ring-0"
                                                />
                                            ) : (
                                                <h4 onClick={() => { setEditingId(project.id); setEditValue(project.title); }} className="text-xs font-black uppercase tracking-widest cursor-text">{project.title}</h4>
                                            )}
                                            <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mt-1 italic">Projekt</p>
                                        </div>
                                        <button onClick={() => deleteProject(project.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500"><X className="w-4 h-4" /></button>
                                    </div>

                                    <div className="space-y-3 mt-4">
                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                            <span className="text-[var(--foreground-muted)] uppercase tracking-widest">Fortschritt</span>
                                            <span className="text-indigo-500">{project.progress}%</span>
                                        </div>
                                        <div className="relative h-6 flex items-center">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={project.progress}
                                                onChange={(e) => updateProject(project.id, { progress: parseInt(e.target.value) })}
                                                className="w-full h-1.5 bg-[var(--background-elevated)] rounded-full appearance-none cursor-pointer accent-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </Card>
                            ))}

                            {activeGoals.map(goal => (
                                <Card key={goal.id} className="p-5 border-[var(--border)] border-dashed bg-transparent rounded-3xl hover:bg-[var(--background-surface)] hover:border-solid transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            {editingId === goal.id ? (
                                                <Input
                                                    autoFocus
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={() => { updateGoal(goal.id, { title: editValue }); setEditingId(null); }}
                                                    className="h-6 bg-transparent border-none p-0 text-xs font-black uppercase tracking-widest focus:ring-0"
                                                />
                                            ) : (
                                                <h4 onClick={() => { setEditingId(goal.id); setEditValue(goal.title); }} className="text-xs font-black uppercase tracking-widest cursor-text">{goal.title}</h4>
                                            )}
                                            <p className="text-[8px] font-black text-orange-500 uppercase tracking-widest mt-1 italic">Langzeitziel</p>
                                        </div>
                                        <button onClick={() => deleteGoal(goal.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500"><X className="w-3 h-3" /></button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1 bg-[var(--background-elevated)] rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-500" style={{ width: `${goal.progress}%` }} />
                                        </div>
                                        <input
                                            type="number"
                                            value={goal.progress}
                                            onChange={(e) => updateGoal(goal.id, { progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                                            className="w-8 bg-transparent text-[10px] font-black text-right focus:outline-none"
                                        />
                                        <span className="text-[8px] font-black opacity-30">%</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* STATUS SUMMARY */}
                    <div className="p-8 bg-zinc-50 rounded-[3rem] border border-zinc-100 shadow-sm text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-4">Dein Status</h3>
                            <div className="text-3xl font-black italic tracking-tighter mb-6">Alles im <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">grünen Bereich</span></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-white/50 rounded-2xl border border-indigo-50/50">
                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Erledigt</p>
                                    <p className="text-2xl font-black text-indigo-600">{tasks.filter(t => t.status === 'completed').length}</p>
                                </div>
                                <div className="text-center p-4 bg-white/50 rounded-2xl border border-indigo-50/50">
                                    <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Streak</p>
                                    <p className="text-2xl font-black text-rose-600">7</p>
                                </div>
                            </div>
                        </div>
                        <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-indigo-500/5" />
                    </div>
                </div>
            </div>

            {/* Quick Guide */}
            <div className="mt-24 border-t border-[var(--border)] pt-12 flex flex-col items-center">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--foreground-muted)] bg-[var(--background-surface)] px-6 py-2 rounded-full border border-[var(--border)] shadow-sm">
                    <MessageSquare className="w-4 h-4" /> Tipps: Klicke auf Texte zum Bearbeiten • Enter zum Speichern • Slider für Fortschritt
                </div>
            </div>

            <style jsx global>{`
                .glass-card {
                    background: var(--background-surface);
                    border: 1px solid var(--border);
                    box-shadow: var(--shadow-sm);
                }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: #6366f1;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
                    border: 2px solid white;
                }
            `}</style>
        </PageContainer>
    );
}
