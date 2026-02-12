import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { getNonce } from "../utilities/getNonce";
import { getUri } from "../utilities/getUri";

export class HelloWorldPanel {
  public static currentPanel: HelloWorldPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private readonly _editor: vscode.TextEditor | undefined;

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
    this._panel.webview.onDidReceiveMessage((message: any) => {
      const activeEditor = this._editor; //we now access the activeEditorWindow through the property of the class instance
      if (message.command === "ready") {
        if (activeEditor === undefined) {
          this._panel.webview.postMessage({
            command: "sendErrorMessage",
            text: "No errors.",
          });
        } else {
          //grabs the active editor uri (what file is the error in)
          const activeEditorUri = activeEditor.document.uri;
          //returns an array of diagnostics
          const editorDiagnostics =
            vscode.languages.getDiagnostics(activeEditorUri);
          //filteredDiagnostics checks to make sure the diagnostic rendered to the frontend is actually an error
          const filteredDiagnostics = editorDiagnostics.filter(
            (diagnostic) =>
              diagnostic.severity === vscode.DiagnosticSeverity.Error,
          );
          //.filter always returns an array even if its empty, empty arrays return true.
          //to check if the array is empty, you need to check its length, not if its truthy or falsy
          if (filteredDiagnostics.length === 0) {
            this._panel.webview.postMessage({
              command: "sendErrorMessage",
              text: "No errors found.",
            });
            return;
          }

          this._panel.webview.postMessage({
            command: "sendErrorMessage",
            fileName: path.basename(activeEditor.document.fileName), //grabs the filename of the active editor
            lineNumber: filteredDiagnostics[0].range.start.line + 1, //grabs the line of the error
            message: filteredDiagnostics[0].message, //grabs the error message
          });
        }
      }
    });
  }

  public static render(extensionUri: vscode.Uri) {
    if (HelloWorldPanel.currentPanel) {
      HelloWorldPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      //active editor is moved down here because we need to capture the "snapshot" of the activeTextEditor before it's rendered in the UI
      const activeEditor = vscode.window.activeTextEditor;
      const panel = vscode.window.createWebviewPanel(
        "hello-world",
        "Hello World",
        vscode.ViewColumn.One,
        {
          // Enable javascript in the webview
          enableScripts: true,
          // Restrict the webview to only load resources from the `out` directory
          localResourceRoots: [
            vscode.Uri.joinPath(extensionUri, "webview-dist"),
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

  public dispose() {
    HelloWorldPanel.currentPanel = undefined;

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
