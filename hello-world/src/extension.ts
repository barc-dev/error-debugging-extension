// import * as vscode from 'vscode';
// import { registerDiagnosticListener } from './backend/DiagnosticListener';
// import { NoteStore } from './backend/NoteStore';

// export function activate(context: vscode.ExtensionContext): void {
//     console.log('Backend Core is active.');

//     // 1. Boot up the database
//     const noteStore = new NoteStore(context);

//     // Temporary test data for ts-1005 error
//     noteStore.saveNote({
//         fingerprintId: 'ts-1005',
//         message: "';' expected.",
//         fixDescription:
//             'You forgot a semicolon or closed a bracket wrong. Check the end of the line.',
//         codeSnippet: 'const x = 5;',
//     });

//     // 2. Start the background watcher
//     registerDiagnosticListener(context, noteStore);
// }

// export function deactivate(): void {
//     // Cleanup if needed
// }
import * as vscode from 'vscode';
import { registerDiagnosticListener } from './backend/DiagnosticListener';
import { NoteStore } from './backend/NoteStore';

export function activate(context: vscode.ExtensionContext) {
  // THE NUCLEAR PING: This bypasses everything and forces a popup instantly.
  vscode.window.showInformationMessage(
    '🚀 NUCLEAR PING: THE EXTENSION IS ALIVE!',
  );
  console.log('🚀 Backend Core is active.');

  const noteStore = new NoteStore(context);
  registerDiagnosticListener(context, noteStore);
}

export function deactivate() {}
