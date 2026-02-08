import React from "react";
import "./App.css";
import ActionButtons from "./components/ActionButtons"; //props: onApply, onDismiss
import ErrorMessage from "./components/ErrorMessage"; //props: message
import ErrorLocation from "./components/ErrorLocation"; //props: fileName, lineNumber
import ErrorPanelHeader from "./components/ErrorPanelHeader"; //props: panelTitle, onClose
import AiInsight from "./components/AiInsight"; //props: aiInsight
import PastFix from "./components/PastFix"; //props: description, codeSnippet, timesUsed
import RelevantDocs from "./components/RelevantDocs"; //props: docs

export default function App() {
  //will replace these with useState hooks to actually fetch data
  const mockErrorLocation = { fileName: "UserList.tsx", lineNumber: 23 };
  const mockErrorMessage =
    "Property 'map' does not exist on type 'User[] | undefined'";
  const mockAIInsight = "TypeScript can't guarantee...";
  const mockPastFix = {
    description:
      "Added optional chaining to safely access 'map' method on possibly undefined 'users' array.",
    codeSnippet: "const userNames = users?.map(user => user.name);",
    timesUsed: 3,
  };
  const mockDocs = [
  {
    title: "TypeScript: Optional Chaining",
    url: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining"
  },
  {
    title: "Array.isArray() - MDN",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray"
  }
];

  const handleClose = () => alert("Panel closed");
  const handleApply = () => alert("Apply button clicked");
  const handleDismiss = () => alert("Dismiss button clicked");
  return (
    <div className="error-panel">
      <ErrorPanelHeader
        panelTitle="Solution found in your notes"
        onClose={() => {
          handleClose();
        }}
      />
      <ErrorLocation
        fileName={mockErrorLocation.fileName}
        lineNumber={mockErrorLocation.lineNumber}
      />
      <ErrorMessage message={mockErrorMessage} />
      <AiInsight aiInsight={mockAIInsight} />
      <PastFix
        description={mockPastFix.description}
        codeSnippet={mockPastFix.codeSnippet}
        timesUsed={mockPastFix.timesUsed}
      />
      <RelevantDocs docs={mockDocs} />
      <ActionButtons onApply={handleApply} onDismiss={handleDismiss} />
    </div>
  );
}
