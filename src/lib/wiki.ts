import { Note } from '@/types';

/**
 * Extracts wiki-links [[Note Title]] from markdown content
 */
export function extractWikiLinks(content: string): string[] {
    const regex = /\[\[(.*?)\]\]/g;
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}

/**
 * Generates nodes and links for the graph view
 */
export function generateGraphData(notes: Note[]) {
    const nodes = notes.map(note => ({
        id: note.id,
        name: note.title,
        val: 1
    }));

    const links: { source: string; target: string }[] = [];

    notes.forEach(note => {
        const linkedTitles = extractWikiLinks(note.content);
        linkedTitles.forEach(title => {
            const targetNote = notes.find(n => n.title.toLowerCase() === title.toLowerCase());
            if (targetNote) {
                links.push({
                    source: note.id,
                    target: targetNote.id
                });
            }
        });
    });

    return { nodes, links };
}
