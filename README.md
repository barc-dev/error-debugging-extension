# Error Debugger

A VS Code extension that detects errors in your active editor, explains them using Google Gemini AI, surfaces relevant documentation, and lets you save notes about fixes for future reference.

---

## Features

- **Real-time error detection** — Automatically reads the first diagnostic error in your active file and displays the file name, line number, and error message.
- **File switching support** — Error display updates instantly when you switch between files.
- **AI-powered explanations** — Click "Analyze with AI" to get a plain-language explanation of the error and suggested fixes, powered by Google Gemini 2.0 Flash.
- **Relevant documentation links** — AI analysis surfaces related documentation links via Google Search grounding, shown directly in the panel.
- **Note-taking system** — Save notes about how you fixed an error, including a description, code snippet, and custom tags.
- **Note management** — View your 3 most recent notes on the main panel, or browse all saved notes. Delete notes you no longer need.
- **Persistent storage** — Notes are saved globally in VS Code and persist across sessions and workspace changes.
- **Status bar toggle** — A `$(bug) Error Debugger` button in the status bar lets you show or hide the panel at any time.

---

## Requirements

- **VS Code** version `1.108.1` or higher
- An active internet connection (required for AI analysis and documentation search)

---

## Installation

### From the VS Code Marketplace

1. Open VS Code
2. Go to the **Extensions** panel (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **Error Debugger**
4. Click **Install**

The panel opens automatically when VS Code starts. You can also toggle it at any time using the `$(bug) Error Debugger` button in the status bar.

### From a `.vsix` file

1. Download the `.vsix` file
2. Open the Extensions panel in VS Code
3. Click the `...` menu (top-right of the panel) → **Install from VSIX...**
4. Select the downloaded `.vsix` file

---

## Usage

### Main Panel

When you open a file that contains errors, the panel displays:

- The **file name** and **line number** of the first detected error
- The **error message**

Click **Analyze with AI** to send the error to Gemini 2.0 Flash. The panel will then show:

- An **AI Insight** — a plain-language explanation of the error and how to fix it
- **Relevant Documentation** — links to related docs and resources

### Saving a Note

1. Click **Save New Note** on the main panel
2. Fill in a description of what caused the error and how you fixed it
3. Optionally paste a code snippet showing the solution
4. Select one or more tags (React, TypeScript, CSS, Node, or a custom tag)
5. Click **Save Note**

### Viewing Notes

- The main panel shows your **3 most recent notes** along with the total saved count
- Click **View All** to see every saved note, where you can also delete individual notes
- Click **Back** to return to the main panel

### Toggling the Panel

Click the **`$(bug) Error Debugger`** button in the bottom status bar to open or close the panel. You can also run the **Toggle Error Debugger Panel** command from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).

---

## Authors

- [Jonathan Cabera](https://github.com/jonathancabera)
- [John Adams](https://github.com/johnadms3)
- [Afnan Rahman](https://github.com/afnan185)
- [Kish Bosomtwe](https://github.com/Keshybb11)

---

## License

MIT License — Copyright (c) 2026 Jonathan Cabera

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
