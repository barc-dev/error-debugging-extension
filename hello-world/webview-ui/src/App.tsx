import React from 'react';
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { vscode } from "./utilities/vscode";
import "./App.css";

export default function App() {
  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    });
  }

  return (
    <main>
      <h1>Hello from React!</h1>
      <VSCodeButton onClick={handleHowdyClick}>
        Howdy!
      </VSCodeButton>
    </main>
  );
}