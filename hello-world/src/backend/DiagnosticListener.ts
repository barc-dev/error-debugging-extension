import * as path from "path"
import * as vscode from "vscode";

export default function registerDiagnosticListener(
  context: vscode.ExtensionContext,
  activeEditor: vscode.TextEditor,
  onErrorChange: (
    error: { fileName: string; lineNumber: number; message: string } | null,
  ) => void,
) {
    const eventListener = vscode.languages.onDidChangeDiagnostics((e) => {
        const activeEditorUri = activeEditor.document.uri;
        if (e.uris.some((uri) => uri.toString() === activeEditorUri.toString())) {
            const editorDiagnostics = vscode.languages.getDiagnostics(activeEditorUri);
            const filteredDiagnostics = editorDiagnostics.filter(
                (diagnostic) =>
                    diagnostic.severity === vscode.DiagnosticSeverity.Error,
            );
            if (filteredDiagnostics.length === 0) {
                onErrorChange(null);
                return;
            }
            onErrorChange({
                fileName: path.basename(activeEditor.document.fileName),
                lineNumber: filteredDiagnostics[0].range.start.line + 1,
                message: filteredDiagnostics[0].message,
            });
        }
    });
    context.subscriptions.push(eventListener);
}
