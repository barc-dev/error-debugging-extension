import { useState, useEffect } from "react";
import { vscode } from "./utilities/vscode";
import "./App.css";

import ErrorMessage from "./components/ErrorMessage";
import ErrorLocation from "./components/ErrorLocation";
import ErrorPanelHeader from "./components/ErrorPanelHeader";
import AiInsight from "./components/AiInsight";
import NotesPanel from "./components/NotesPanel";
import RelevantDocs from "./components/RelevantDocs";
import SaveFixHeader from "./components/SaveFixHeader";
import FormField from "./components/FormField";
import TagSelector from "./components/TagSelector";
import SaveFixActions from "./components/SaveFixActions";

import { Note } from "./components/NotesPanel";

interface errorDataTypes {
  command: string;
  fileName: string;
  lineNumber: number;
  message: string;
}

export default function App() {
  const [errorData, setErrorData] = useState<errorDataTypes | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [docs, setDocs] = useState<{ title: string; url: string }[] | null>(
    null,
  );
  const [view, setView] = useState<
    "mainPanel" | "saveNotePanel" | "viewAllNotesPanel"
  >("mainPanel");
  const [fixDescription, setFixDescription] = useState<string>("");
  const [fixCodeSnippet, setFixCodeSnippet] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.command === "sendErrorMessage") {
        setAiInsight(null);
        setDocs(null);
        if (!e.data.text) {
          setErrorData(e.data);
        } else {
          setErrorData({
            command: "sendErrorMessage",
            fileName: "",
            lineNumber: 0,
            message: "No errors found in the current file.",
          });
        }
      }
      if (e.data.command === "sendAiInsight") {
        setAiInsight(e.data.message);
      }
      if (e.data.command === "sendAllNotes") {
        setNotes(e.data.notes);
      }
      if (e.data.command === "sendRelevantDocs") {
        setDocs(e.data.docs);
      }
    };
    window.addEventListener("message", handleMessage);
    vscode.postMessage({ command: "ready" });
    vscode.postMessage({ command: "getNotes" });
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (view === "viewAllNotesPanel") {
    return (
      <div className="error-panel">
        <div className="notes-panel">
          <div className="error-header">
            <h2>All Notes ({notes.length})</h2>
          </div>
          {notes.map((note, index) => (
            <div key={index} className="note-card">
              <div className="note-error">
                {note.error.fileName}:{note.error.lineNumber} -{" "}
                {note.error.message}
              </div>
              <div className="note-description">{note.description}</div>
              <pre className="note-code">{note.codeSnippet}</pre>
              <div className="note-footer">
                <div className="note-tags">
                  {note.tags.map((tag, i) => (
                    <span key={i} className="note-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  className="note-delete-btn"
                  onClick={() => {
                    vscode.postMessage({ command: "deleteNote", index });
                    vscode.postMessage({ command: "getNotes" });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <div className="notes-buttons">
            <button
              className="sf-btn sf-btn-secondary"
              onClick={() => setView("mainPanel")}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === "saveNotePanel") {
    return (
      <div className="error-panel">
        <SaveFixHeader fileName={errorData?.fileName ?? ""} />
        <FormField
          label="Description"
          placeholder="What did you do to fix this?"
          value={fixDescription}
          onChange={setFixDescription}
        />
        <FormField
          label="Code Snippet"
          placeholder="Paste the fix here..."
          value={fixCodeSnippet}
          onChange={setFixCodeSnippet}
        />
        <TagSelector
          defaultTags={["React", "TypeScript", "CSS", "Node"]}
          selectedTags={new Set(selectedTags)}
          onToggle={(tag) =>
            setSelectedTags((prev) =>
              prev.includes(tag)
                ? prev.filter((t) => t !== tag)
                : [...prev, tag],
            )
          }
          onAddCustom={(tag) => setSelectedTags((prev) => [...prev, tag])}
          onRemoveCustom={(tag) =>
            setSelectedTags((prev) => prev.filter((t) => t !== tag))
          }
        />
        <SaveFixActions
          onSave={() => {
            vscode.postMessage({
              command: "saveNote",
              note: {
                error: {
                  fileName: errorData?.fileName ?? "",
                  lineNumber: errorData?.lineNumber ?? 0,
                  message: errorData?.message ?? "",
                },
                description: fixDescription ?? "",
                codeSnippet: fixCodeSnippet ?? "",
                tags: selectedTags ?? [],
              },
            });
            vscode.postMessage({ command: "getNotes" });
            setView("mainPanel");
            setFixDescription("");
            setFixCodeSnippet("");
            setSelectedTags([]);
          }}
          onClose={() => setView("mainPanel")}
          saveDisabled={false}
        />
      </div>
    );
  }

  //main panel
  return (
    <div className="error-panel">
      <ErrorPanelHeader panelTitle="Error Debugger" />
      <ErrorLocation
        fileName={errorData?.fileName ?? ""}
        lineNumber={errorData?.lineNumber ?? 0}
      />
      <ErrorMessage message={errorData?.message ?? ""} />
      <div className="save-fix-actions">
        <button
          className="sf-btn sf-btn-primary"
          onClick={() => vscode.postMessage({ command: "analyzeError" })}
        >
          Analyze code and find relevant docs
        </button>
      </div>
      {aiInsight && (
        <div className="ai-insight-container">
          <AiInsight aiInsight={aiInsight} />
          <RelevantDocs docs={docs ?? []} />
        </div>
      )}

      <NotesPanel
        notes={notes.slice(0, 3)}
        totalCount={notes.length}
        onSaveNew={() => setView("saveNotePanel")}
        onViewAll={() => setView("viewAllNotesPanel")}
        onDelete={(index) => {
          vscode.postMessage({ command: "deleteNote", index });
          vscode.postMessage({ command: "getNotes" });
        }}
      />
    </div>
  );
}
