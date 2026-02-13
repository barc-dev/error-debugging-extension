import * as vscode from 'vscode';
import { NoteStore } from './NoteStore';
import { HelloWorldPanel } from '../panels/HelloWorldPanel';

/**
 * Safely extracts the diagnostic code value, handling both primitive and object formats.
 * In newer VS Code API versions, diagnostic.code can be:
 * - A string: "1005"
 * - A number: 1005
 * - An object: { value: 1005, target: Uri }
 */
function extractDiagnosticCode(diagnostic: vscode.Diagnostic): string {
    if (!diagnostic.code) {
        return 'unknown';
    }

    // Handle object format: { value: number | string, target?: Uri }
    if (typeof diagnostic.code === 'object' && diagnostic.code !== null) {
        const codeObj = diagnostic.code as { value?: string | number; target?: vscode.Uri };
        if (codeObj.value !== undefined) {
            return String(codeObj.value);
        }
        return 'unknown';
    }

    // Handle primitive format: string or number
    return String(diagnostic.code);
}

export function registerDiagnosticListener(context: vscode.ExtensionContext, store: NoteStore): void {
    const listener = vscode.languages.onDidChangeDiagnostics((event: vscode.DiagnosticChangeEvent) => {
        const uris: readonly vscode.Uri[] = event.uris;
        
        uris.forEach((uri: vscode.Uri) => {
            const diagnostics: readonly vscode.Diagnostic[] = vscode.languages.getDiagnostics(uri);
            
            diagnostics.forEach((diagnostic: vscode.Diagnostic) => {
                if (diagnostic.severity === vscode.DiagnosticSeverity.Error) {
                    // Safely extract the code value
                    const codeValue: string = extractDiagnosticCode(diagnostic);
                    const source: string = diagnostic.source || 'unknown';
                    const fingerprintId: string = `${source}-${codeValue}`;
                    
                    let noteToOpen = store.getNote(fingerprintId);
                    
                    if (!noteToOpen) {
                        // 🔴 Auto-Catch-All Test Mode: Dynamically create a note for whatever error just happened!
                        noteToOpen = {
                            fingerprintId: fingerprintId,
                            message: diagnostic.message,
                            fixDescription: "AUTO-GENERATED FIX: We caught your error dynamically! This proves the end-to-end pipeline works perfectly for any error code.",
                            codeSnippet: "Your broken code here"
                        };
                        // Save it so it's in the database
                        store.saveNote(noteToOpen);
                    }
                    
                    // Now force the UI to open and show the blue popup!
                    console.log(`💡 Error detected! Opening note for ${fingerprintId}...`);
                    vscode.window.showInformationMessage(`✅ BACKEND CAUGHT: ${fingerprintId}`);
                    HelloWorldPanel.showKnownError(context.extensionUri, noteToOpen);
                }
            });
        });
    });

    context.subscriptions.push(listener);
}
