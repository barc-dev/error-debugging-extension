// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { HelloWorldPanel } from "./panels/HelloWorldPanel";
import GlobalStorageService from "./backend/GlobalStorageService";
// import { registerDiagnosticListener } from './backend/DiagnosticListener';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
  // Open the panel automatically on startup
 
  const globalStorageService = new GlobalStorageService(context);
  HelloWorldPanel.render(context.extensionUri, globalStorageService);

  const helloCommand = vscode.commands.registerCommand(
    "hello-world.helloWorld",
    () => {
      HelloWorldPanel.render(context.extensionUri, globalStorageService);
    },
  );

  context.subscriptions.push(helloCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
