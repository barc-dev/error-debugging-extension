"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// hello-world/src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode2 = __toESM(require("vscode"));

// hello-world/src/panels/HelloWorldPanel.ts
var vscode = __toESM(require("vscode"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));

// hello-world/src/utilities/getNonce.ts
function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// hello-world/src/utilities/getUri.ts
var import_vscode = require("vscode");
function getUri(webview, extensionUri, pathList) {
  return webview.asWebviewUri(import_vscode.Uri.joinPath(extensionUri, ...pathList));
}

// hello-world/src/panels/HelloWorldPanel.ts
var HelloWorldPanel = class _HelloWorldPanel {
  static currentPanel;
  _panel;
  _disposables = [];
  _editor;
  constructor(panel, extensionUri, activeEditor) {
    this._panel = panel;
    this._editor = activeEditor;
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.webview.html = this._getWebviewContent(
      this._panel.webview,
      extensionUri
    );
    this._panel.webview.onDidReceiveMessage((message) => {
      const activeEditor2 = this._editor;
      if (message.command === "ready") {
        if (activeEditor2 === void 0) {
          this._panel.webview.postMessage({
            command: "sendErrorMessage",
            text: "No errors."
          });
        } else {
          const activeEditorUri = activeEditor2.document.uri;
          const editorDiagnostics = vscode.languages.getDiagnostics(activeEditorUri);
          const filteredDiagnostics = editorDiagnostics.filter(
            (diagnostic) => diagnostic.severity === vscode.DiagnosticSeverity.Error
          );
          if (filteredDiagnostics.length === 0) {
            this._panel.webview.postMessage({
              command: "sendErrorMessage",
              text: "No errors found."
            });
            return;
          }
          this._panel.webview.postMessage({
            command: "sendErrorMessage",
            fileName: path.basename(activeEditor2.document.fileName),
            //grabs the filename of the active editor
            lineNumber: filteredDiagnostics[0].range.start.line + 1,
            //grabs the line of the error
            message: filteredDiagnostics[0].message
            //grabs the error message
          });
        }
      }
    });
  }
  static render(extensionUri) {
    if (_HelloWorldPanel.currentPanel) {
      _HelloWorldPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
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
            vscode.Uri.joinPath(extensionUri, "webview-dist")
          ]
        }
      );
      _HelloWorldPanel.currentPanel = new _HelloWorldPanel(
        panel,
        extensionUri,
        activeEditor
      );
    }
  }
  dispose() {
    _HelloWorldPanel.currentPanel = void 0;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
  _getWebviewContent(webview, extensionUri) {
    const manifestPath = path.join(
      extensionUri.fsPath,
      "webview-dist",
      "asset-manifest.json"
    );
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const cssPath = manifest.files["main.css"];
    const jsPath = manifest.files["main.js"];
    const stylesUri = getUri(webview, extensionUri, [
      "webview-dist",
      ...cssPath.split("/").filter(Boolean)
    ]);
    const scriptUri = getUri(webview, extensionUri, [
      "webview-dist",
      ...jsPath.split("/").filter(Boolean)
    ]);
    const nonce = getNonce();
    return (
      /*html*/
      `
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
  `
    );
  }
};

// hello-world/src/extension.ts
function activate(context) {
  const helloCommand = vscode2.commands.registerCommand(
    "hello-world.helloWorld",
    () => {
      HelloWorldPanel.render(context.extensionUri);
    }
  );
  context.subscriptions.push(helloCommand);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
