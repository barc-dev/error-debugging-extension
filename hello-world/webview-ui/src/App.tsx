import { useState, useEffect } from "react";
import { vscode } from "./utilities/vscode";
import "./App.css";

//components
import ErrorMessage from "./components/ErrorMessage"; //props: message
import ErrorLocation from "./components/ErrorLocation"; //props: fileName, lineNumber
import ErrorPanelHeader from "./components/ErrorPanelHeader"; //props: panelTitle, onClose
import AiInsight from "./components/AiInsight"; //props: aiInsight
import NotesPanel from "./components/NotesPanel"; //props: notes, onSaveNew, onViewAll
import RelevantDocs from "./components/RelevantDocs"; //props: docs
import SearchBar from "./components/SearchBar"; //props: onSearch
import SaveFixHeader from "./components/SaveFixHeader"; //props: headerTitle
import ErrorSelect from "./components/ErrorSelect"; //props: errors, onSelect
import FormField from "./components/FormField"; //props: label, value, onChange
import TagSelector from "./components/TagSelector"; //props: availableTags, selectedTags, onChange
import SaveFixActions from "./components/SaveFixActions"; //props: onSave, onCancel

interface errorDataTypes {
  command: string;
  fileName: string;
  lineNumber: number;
  message: string;
  // fileName: path.basename(activeEditor.document.fileName),
  // lineNumber: filteredDiagnostics[0].range.start.line + 1,
  // message: filteredDiagnostics[0].message
}

export default function App() {
  //will replace these with useState hooks to actually fetch data
  const mockErrorLocation = { fileName: "UserList.tsx", lineNumber: 23 };
  const mockErrorMessage =
    "Property 'map' does not exist on type 'User[] | undefined'";
  const mockAIInsight = "TypeScript can't guarantee...";
  const mockNotes = [
    {
      description: "Had the same error, fixed it by adding optional chaining",
      codeSnippet: "users?.map(user => ...)",
      tags: ["typescript", "optional-chaining"],
    },
  ];
  const mockErrors = [
    {
      key: "1",
      message: mockErrorMessage,
      source: "ts",
      code: "2532",
      line: mockErrorLocation.lineNumber,
      col: 5,
    },
  ];
  const mockDocs = [
    {
      title: "TypeScript: Optional Chaining",
      url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining",
    },
    {
      title: "Array.isArray() - MDN",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray",
    },
  ];

  //errorData variable holds onto error messages from useEffect
  const [errorData, setErrorData] = useState<errorDataTypes | null>(null);

  //aiInsight variable holds onto AI insights from useEffect
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  //lets you swap between the main error panel and the save fix panel
  const [view, setView] =  useState<"mainPanel" | "saveNotePanel">("mainPanel");

  //fields within the save note panel
  const [searchText, setSearchText] = useState<string>("");
  const [selectedErrorKey, setSelectedErrorKey] = useState<string>("");
  const [fixDescription, setFixDescription] = useState<string>("");
  const [fixCodeSnippet, setFixCodeSnippet] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      console.log(e.data);
      if (e.data.command === "sendErrorMessage") {
        setErrorData(e.data);
      }
      if (e.data.command === "sendAiInsight") {
        setAiInsight(e.data.message);
      }
    };
    window.addEventListener("message", handleMessage);
    vscode.postMessage({ command: "ready" });
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleClose = () => alert("Panel closed");
  const handleApply = () => alert("Apply button clicked");
  const handleDismiss = () => alert("Dismiss button clicked");

  //there is a button that has an event handler to swap to the to the save note panel..
  //when the view's state switches, it returns new JSX which is the saveNotePanel interface that Kish implemented
  if (view === "saveNotePanel") {
    return (
      <div className="error-panel">
        <SaveFixHeader
          fileName={errorData?.fileName ?? mockErrorLocation.fileName}
        />
        <SearchBar value={searchText} onChange={setSearchText} />
        <ErrorSelect
          errors={mockErrors}
          selectedKey={selectedErrorKey}
          linePreview="const userNames=users.map(..."
          onSelect={setSelectedErrorKey}
        />
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
          onSave={() => setView("mainPanel")}
          onClose={() => setView("mainPanel")}
          saveDisabled={false}
        />
      </div>
    );
  }

  return (
    <div className="error-panel">
      <ErrorPanelHeader
        panelTitle="Solution found in your notes"
        onClose={handleClose}
      />
      <ErrorLocation
        fileName={errorData?.fileName ?? mockErrorLocation.fileName}
        lineNumber={errorData?.lineNumber ?? mockErrorLocation.lineNumber}
      />
      <ErrorMessage message={errorData?.message ?? mockErrorMessage} />
      <AiInsight aiInsight={aiInsight ?? "Analyzing error..."} />
      <RelevantDocs docs={mockDocs} />
      <NotesPanel
        notes={mockNotes}
        onSaveNew={() => setView("saveNotePanel")}
        onViewAll={() => alert("View all notes")}
      />
    </div>
  );
}
