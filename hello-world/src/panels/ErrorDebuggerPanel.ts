import * as vscode from "vscode";
import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import { getNonce } from "../utilities/getNonce";
import { getUri } from "../utilities/getUri";
import "dotenv/config";
import GlobalStorageService from "../backend/GlobalStorageService";
import registerDiagnosticListener from "../backend/DiagnosticListener";

export class ErrorDebuggerPanel {
  public static currentPanel: ErrorDebuggerPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private _storageService: GlobalStorageService;
  private readonly _editor: vscode.TextEditor | undefined;

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    activeEditor: vscode.TextEditor | undefined,
    storageService: GlobalStorageService,
    context: vscode.ExtensionContext,
  ) {
    this._panel = panel;
    this._editor = activeEditor;
    this._storageService = storageService;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getWebviewContent(
      this._panel.webview,
      extensionUri,
    );
    this._panel.webview.onDidReceiveMessage(async (message: any) => {
      const activeEditor = vscode.window.activeTextEditor ?? this._editor;
      if (message.command === "ready") {
        if (activeEditor === undefined) {
          this._panel.webview.postMessage({
            command: "sendErrorMessage",
            text: "No errors.",
          });
        } else {
          const activeEditorUri = activeEditor.document.uri;
          const editorDiagnostics =
            vscode.languages.getDiagnostics(activeEditorUri);
          const filteredDiagnostics = editorDiagnostics.filter(
            (diagnostic) =>
              diagnostic.severity === vscode.DiagnosticSeverity.Error,
          );

          if (filteredDiagnostics.length === 0) {
            this._panel.webview.postMessage({
              command: "sendErrorMessage",
              text: "No errors found.",
            });
            return;
          }

          this._panel.webview.postMessage({
            command: "sendErrorMessage",
            fileName: path.basename(activeEditor.document.fileName),
            lineNumber: filteredDiagnostics[0].range.start.line + 1,
            message: filteredDiagnostics[0].message,
          });
        }
      }
      if (message.command === "saveNote")
        await this._storageService.saveNote(message.note);

      if (message.command === "deleteNote")
        await this._storageService.deleteNote(message.index);

      if (message.command === "getNotes") {
        const notes = this._storageService.getAllNotes();
        this._panel.webview.postMessage({
          command: "sendAllNotes",
          notes: notes,
        });
      }

      if (message.command === "analyzeError") {
        console.log("activeEditor:", activeEditor);
        if (activeEditor) {
          const activeEditorUri = activeEditor.document.uri;
          const filteredDiagnostics = vscode.languages
            .getDiagnostics(activeEditorUri)
            .filter((d) => d.severity === vscode.DiagnosticSeverity.Error);
          if (filteredDiagnostics.length === 0) {
            return;
          }
          try {
            const ai = new GoogleGenAI({
              apiKey: process.env.API_KEY,
            });
            const aiResponse = await ai.models.generateContent({
              model: "gemini-2.0-flash",
              contents: `In one short paragraph (3 sentences max), explain what caused this error and how to fix it: ${filteredDiagnostics[0].message}`,
            });

            const docsResponse = await ai.models.generateContent({
              model: "gemini-2.0-flash",
              contents: `Find the top resources to help fix this TypeScript error: ${filteredDiagnostics[0].message}`,
              config: {
                tools: [{ googleSearch: {} }],
              },
            });

            const docs =
              docsResponse.candidates?.[0]?.groundingMetadata?.groundingChunks
                ?.slice(0, 3)
                .map((chunk: any) => ({
                  title: chunk.web?.title,
                  url: chunk.web?.uri,
                }));

            this._panel.webview.postMessage({
              command: "sendAiInsight",
              message: aiResponse.text,
            });

            this._panel.webview.postMessage({
              command: "sendRelevantDocs",
              docs: docs,
            });
          } catch (e) {
            console.log("Error:", (e as Error).message);
          }
        }
      }
    });

    if (activeEditor) {
      registerDiagnosticListener(context, activeEditor, (error) => {
        if (error === null) {
          this._panel.webview.postMessage({
            command: "sendErrorMessage",
            text: "No errors found.",
          });
        } else {
          this._panel.webview.postMessage({
            command: "sendErrorMessage",
            ...error,
          });
        }
      });
    }

    context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (!editor) {
          return;
        }
        const uri = editor.document.uri;
        const filteredDiagnostics = vscode.languages
          .getDiagnostics(uri)
          .filter((d) => d.severity === vscode.DiagnosticSeverity.Error);
        if (filteredDiagnostics.length === 0) {
          this._panel.webview.postMessage({
            command: "sendErrorMessage",
            text: "No errors found.",
          });
        } else {
          this._panel.webview.postMessage({
            command: "sendErrorMessage",
            fileName: path.basename(editor.document.fileName),
            lineNumber: filteredDiagnostics[0].range.start.line + 1,
            message: filteredDiagnostics[0].message,
          });
        }
      }),
    );
  }

  public static render(
    extensionUri: vscode.Uri,
    storageService: GlobalStorageService,
    context: vscode.ExtensionContext,
  ) {
    if (ErrorDebuggerPanel.currentPanel) {
      ErrorDebuggerPanel.currentPanel._panel.reveal(vscode.ViewColumn.Beside);
    } else {
      const activeEditor = vscode.window.activeTextEditor;
      const panel = vscode.window.createWebviewPanel(
        "error-debugger",
        "Error Debugger",
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(extensionUri, "webview-dist"),
          ],
        },
      );

      ErrorDebuggerPanel.currentPanel = new ErrorDebuggerPanel(
        panel,
        extensionUri,
        activeEditor,
        storageService,
        context,
      );
    }
  }

  public dispose() {
    ErrorDebuggerPanel.currentPanel = undefined;

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
  ) {
    const manifestPath = path.join(
      extensionUri.fsPath,
      "webview-dist",
      "asset-manifest.json",
    );
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    const cssPath = manifest.files["main.css"];
    const jsPath = manifest.files["main.js"];

    const stylesUri = getUri(webview, extensionUri, [
      "webview-dist",
      ...cssPath.split("/").filter(Boolean),
    ]);
    const scriptUri = getUri(webview, extensionUri, [
      "webview-dist",
      ...jsPath.split("/").filter(Boolean),
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
        <title>Error Debugger</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
      </body>
    </html>
  `;
  }
}
