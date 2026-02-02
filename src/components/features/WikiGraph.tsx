'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Note } from '@/types';
import { generateGraphData } from '@/lib/wiki';

interface WikiGraphProps {
    notes: Note[];
    onNodeClick: (note: Note) => void;
    activeNoteId?: string;
}

export function WikiGraph({ notes, onNodeClick, activeNoteId }: WikiGraphProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
    const data = useMemo(() => generateGraphData(notes), [notes]);

    useEffect(() => {
        if (containerRef.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    setDimensions({
                        width: entry.contentRect.width,
                        height: 500
                    });
                }
            });
            resizeObserver.observe(containerRef.current);
            return () => resizeObserver.disconnect();
        }
    }, []);

    return (
        <div ref={containerRef} className="w-full h-[500px] bg-[var(--background-surface)] rounded-3xl overflow-hidden border border-[var(--border)] relative shadow-inner">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground-muted)] bg-[var(--background)]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--border)] shadow-sm">
                    Brain Graph View
                </p>
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-indigo-500/20 shadow-sm">
                    {notes.length} Nodes
                </div>
            </div>

            <ForceGraph2D
                graphData={data}
                nodeLabel="name"
                nodeColor={node => (node as any).id === activeNoteId ? '#6366f1' : '#94a3b8'}
                nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px "Geist Sans", sans-serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

                    // Draw connection points (subtle glow)
                    if (node.id === activeNoteId) {
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, bckgDimensions[0] / 1.5, 0, 2 * Math.PI, false);
                        ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
                        ctx.fill();
                    }

                    // Node Background
                    ctx.fillStyle = (node as any).id === activeNoteId ? '#6366f1' : 'rgba(255, 255, 255, 0.9)';
                    const r = 4 / globalScale; // border radius
                    const x = node.x - bckgDimensions[0] / 2;
                    const y = node.y - bckgDimensions[1] / 2;
                    const w = bckgDimensions[0];
                    const h = bckgDimensions[1];

                    ctx.beginPath();
                    ctx.moveTo(x + r, y);
                    ctx.lineTo(x + w - r, y);
                    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                    ctx.lineTo(x + w, y + h - r);
                    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                    ctx.lineTo(x + r, y + h);
                    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                    ctx.lineTo(x, y + r);
                    ctx.quadraticCurveTo(x, y, x + r, y);
                    ctx.closePath();
                    ctx.fill();

                    // Text
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = node.id === activeNoteId ? '#ffffff' : '#0f172a';
                    ctx.font = `bold ${fontSize}px "Geist Sans", sans-serif`;
                    ctx.fillText(label, node.x, node.y);

                    node.__bckgDimensions = bckgDimensions;
                }}
                nodePointerAreaPaint={(node: any, color, ctx) => {
                    ctx.fillStyle = color;
                    const bckgDimensions = node.__bckgDimensions;
                    bckgDimensions && ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);
                }}
                linkColor={() => 'rgba(148, 163, 184, 0.3)'}
                linkWidth={1}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
                linkDirectionalParticleWidth={1.5}
                onNodeClick={(node: any) => {
                    const note = notes.find(n => n.id === node.id);
                    if (note) onNodeClick(note);
                }}
                width={dimensions.width}
                height={dimensions.height}
                backgroundColor="transparent"
            />
        </div>
    );
}
