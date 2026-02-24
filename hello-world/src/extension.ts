import * as vscode from "vscode";
import { ErrorDebuggerPanel } from "./panels/ErrorDebuggerPanel";
import GlobalStorageService from "./backend/GlobalStorageService";

export function activate(context: vscode.ExtensionContext) {
  const globalStorageService = new GlobalStorageService(context);

  ErrorDebuggerPanel.render(
    context.extensionUri,
    globalStorageService,
    context,
  );

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBarItem.text = "$(bug) Error Debugger";
  statusBarItem.command = "error-debugger.toggle";
  statusBarItem.tooltip = "Toggle Error Debugger Panel";
  statusBarItem.show();

  const toggleCommand = vscode.commands.registerCommand(
    "error-debugger.toggle",
    () => {
      if (ErrorDebuggerPanel.currentPanel) {
        ErrorDebuggerPanel.currentPanel.dispose();
      } else {
        ErrorDebuggerPanel.render(
          context.extensionUri,
          globalStorageService,
          context,
        );
      }
    },
  );

  const analyzeCommand = vscode.commands.registerCommand(
    "error-debugger.analyze",
    () => {
      ErrorDebuggerPanel.render(
        context.extensionUri,
        globalStorageService,
        context,
      );
    },
  );

  context.subscriptions.push(statusBarItem, toggleCommand, analyzeCommand);
}

export function deactivate() {}
