import * as vscode from 'vscode';

// We define what a "Note" looks like
export interface ErrorNote {
    fingerprintId: string;
    message: string;
    fixDescription: string;
    codeSnippet: string;
    aiInsight?: string; //  AI feature
}

export class NoteStore {
    private readonly STORAGE_KEY = 'error-notes-db';

    constructor(private context: vscode.ExtensionContext) {}

    public saveNote(note: ErrorNote) {
        const allNotes = this.getAllNotes();
        allNotes[note.fingerprintId] = note;
        this.context.globalState.update(this.STORAGE_KEY, allNotes);
        console.log(`💾 Saved note for ${note.fingerprintId}`);
    }

    public getNote(fingerprintId: string): ErrorNote | undefined {
        const allNotes = this.getAllNotes();
        return allNotes[fingerprintId];
    }

    private getAllNotes(): Record<string, ErrorNote> {
        return this.context.globalState.get(this.STORAGE_KEY) || {};
    }
}