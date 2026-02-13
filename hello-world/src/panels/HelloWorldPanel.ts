import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getNonce } from '../utilities/getNonce';
import { getUri } from '../utilities/getUri';
import { ErrorNote } from '../backend/NoteStore';

/**
 * Message payload sent to React webview
 */
interface WebviewMessage {
    command: string;
    text?: string;
    fileName?: string;
    lineNumber?: number;
    message?: string;
    pastFix?: string;
    codeSnippet?: string;
    aiInsight?: string;
}

/**
 * Message received from React webview
 */
interface WebviewReceivedMessage {
    command: string;
    [key: string]: unknown;
}

export class HelloWorldPanel {
    public static currentPanel: HelloWorldPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];
    private readonly _editor: vscode.TextEditor | undefined;
    
    /**
     * 🔴 Check 2: Pending state to handle race condition
     * Stores note data that should be sent to React once it's ready
     */
    private _pendingNote: ErrorNote | null = null;
    private _isReactReady: boolean = false;

    private constructor(
        panel: vscode.WebviewPanel,
        extensionUri: vscode.Uri,
        activeEditor: vscode.TextEditor | undefined,
    ) {
        this._panel = panel;
        this._editor = activeEditor;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getWebviewContent(
            this._panel.webview,
            extensionUri,
        );
        
        // Set up message handler for React communication
        this._panel.webview.onDidReceiveMessage((message: WebviewReceivedMessage) => {
            const activeEditor = this._editor;
            
            if (message.command === 'ready') {
                // React has mounted and is ready to receive messages
                this._isReactReady = true;
                
                // 🔴 Check 2: If we have pending note data, send it now
                if (this._pendingNote) {
                    this._sendNoteToReact(this._pendingNote);
                    this._pendingNote = null; // Clear pending state
                    return;
                }
                
                // Original behavior: send current editor diagnostics if no pending note
                if (activeEditor === undefined) {
                    this._panel.webview.postMessage({
                        command: 'sendErrorMessage',
                        text: 'No errors.',
                    } as WebviewMessage);
                } else {
                    const activeEditorUri = activeEditor.document.uri;
                    const editorDiagnostics = vscode.languages.getDiagnostics(activeEditorUri);
                    const filteredDiagnostics = editorDiagnostics.filter(
                        (diagnostic) =>
                            diagnostic.severity === vscode.DiagnosticSeverity.Error,
                    );
                    
                    if (filteredDiagnostics.length === 0) {
                        this._panel.webview.postMessage({
                            command: 'sendErrorMessage',
                            text: 'No errors found.',
                        } as WebviewMessage);
                        return;
                    }

                    this._panel.webview.postMessage({
                        command: 'sendErrorMessage',
                        fileName: path.basename(activeEditor.document.fileName),
                        lineNumber: filteredDiagnostics[0].range.start.line + 1,
                        message: filteredDiagnostics[0].message,
                    } as WebviewMessage);
                }
            }
        }, null, this._disposables);
    }

    /**
     * Helper method to send note data to React webview
     */
    private _sendNoteToReact(savedNote: ErrorNote): void {
        this._panel.webview.postMessage({
            command: 'sendErrorMessage',
            text: savedNote.message,
            pastFix: savedNote.fixDescription,
            codeSnippet: savedNote.codeSnippet,
            aiInsight: savedNote.aiInsight,
        } as WebviewMessage);
    }

    public static render(extensionUri: vscode.Uri): void {
        if (HelloWorldPanel.currentPanel) {
            HelloWorldPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
        } else {
            const activeEditor = vscode.window.activeTextEditor;
            const panel = vscode.window.createWebviewPanel(
                'hello-world',
                'Hello World',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    localResourceRoots: [
                        vscode.Uri.joinPath(extensionUri, 'webview-dist'),
                    ],
                },
            );

            HelloWorldPanel.currentPanel = new HelloWorldPanel(
                panel,
                extensionUri,
                activeEditor,
            );
        }
    }

    /**
     * 🔴 Check 2: Refactored to handle race condition
     * 
     * This method is called by DiagnosticListener when a known error is detected.
     * 
     * Race Condition Solution:
     * 1. If panel doesn't exist, create it (this triggers React to mount)
     * 2. Check if React is ready (_isReactReady flag)
     * 3. If React is ready: immediately send the note data via postMessage
     * 4. If React is NOT ready: store the note in _pendingNote queue
     * 5. When React sends "ready" command, the message handler checks _pendingNote
     *    and automatically sends the queued data
     * 
     * This guarantees the postMessage only fires AFTER React has mounted and
     * registered its message listener.
     */
    public static showKnownError(extensionUri: vscode.Uri, savedNote: ErrorNote): void {
        // Ensure the panel is created/opened
        HelloWorldPanel.render(extensionUri);

        if (!HelloWorldPanel.currentPanel) {
            console.error('Failed to create or access HelloWorldPanel');
            return;
        }

        const panel = HelloWorldPanel.currentPanel;

        // Check if React is ready
        if (panel._isReactReady) {
            // React is ready, send immediately
            panel._sendNoteToReact(savedNote);
        } else {
            // React is not ready yet, queue the note data
            panel._pendingNote = savedNote;
            console.log('⏳ React not ready yet, queuing note data...');
        }
    }

    public dispose(): void {
        HelloWorldPanel.currentPanel = undefined;
        this._pendingNote = null;
        this._isReactReady = false;
        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _getWebviewContent(
        webview: vscode.Webview,
        extensionUri: vscode.Uri,
    ): string {
        const manifestPath = path.join(
            extensionUri.fsPath,
            'webview-dist',
            'asset-manifest.json',
        );
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

        const cssPath = manifest.files['main.css'];
        const jsPath = manifest.files['main.js'];

        const stylesUri = getUri(webview, extensionUri, [
            'webview-dist',
            ...cssPath.split('/').filter(Boolean),
        ]);
        const scriptUri = getUri(webview, extensionUri, [
            'webview-dist',
            ...jsPath.split('/').filter(Boolean),
        ]);

        const nonce = getNonce();

        return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <link rel="stylesheet" type="text/css" href="${stylesUri}">
        <title>Hello World</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
      </body>
    </html>
  `;
    }
}
