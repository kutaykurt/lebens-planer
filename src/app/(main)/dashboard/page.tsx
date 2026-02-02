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

    return (
        <PageContainer width="full" className="text-[var(--foreground)] pb-32">
            {/* ─── HEADER ─── */}
            <div className="mb-12">
                <div className="flex items-center gap-3 text-indigo-500 mb-2">
                    <Zap className="w-5 h-5 fill-current" />
                    <span className="text-xs font-black uppercase tracking-[0.4em]">Life OS Zentrale</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter italic">
                    Deine <span className="text-indigo-500">Kommandozentrale</span>
                </h1>
                <p className="text-[var(--foreground-muted)] text-lg mt-2 font-medium italic">
                    Alles an einem Ort. Direkt bearbeitbar. Keine Umwege.
                </p>
            </div>

            {/* ─── 3 COLUMN COMMAND CENTER ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

                {/* SPALTE 1: TAGESPLAN */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-black uppercase tracking-widest text-indigo-500 flex items-center gap-3 italic">
                            <ListTodo className="w-5 h-5" /> Heute
                        </h2>
                        <div className="bg-indigo-500/10 px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 uppercase">
                            {tasks.length} Aufgaben
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

                    {/* Routinen Section Inline */}
                    <div className="pt-6 border-t border-[var(--border)]">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-4 px-2 italic">Tägliche Routinen</p>
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
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-black uppercase tracking-widest text-purple-500 flex items-center gap-3 italic">
                            <Brain className="w-5 h-5" /> Gedanken
                        </h2>
                        <button onClick={() => window.location.href = '/wiki'} className="text-[10px] font-black text-purple-600 uppercase underline">Wiki öffnen</button>
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
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-black uppercase tracking-widest text-rose-500 flex items-center gap-3 italic">
                            <Target className="w-5 h-5" /> Strategie
                        </h2>
                        <button onClick={() => window.location.href = '/focus'} className="text-[10px] font-black text-rose-600 uppercase underline">Fokus-Hub</button>
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
                    <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-[3rem] border border-indigo-500/20 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-2">System Performance</h3>
                            <div className="text-3xl font-black italic tracking-tighter mb-4">OPTIMAL</div>
                            <div className="flex justify-center gap-4">
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-[var(--foreground-muted)] uppercase">Done</p>
                                    <p className="text-lg font-black">{tasks.filter(t => t.status === 'completed').length}</p>
                                </div>
                                <div className="w-px h-8 bg-[var(--border)]" />
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-[var(--foreground-muted)] uppercase">Streak</p>
                                    <p className="text-lg font-black">7</p>
                                </div>
                            </div>
                        </div>
                        <Sparkles className="absolute -bottom-4 -right-4 w-20 h-20 text-indigo-500/10" />
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
