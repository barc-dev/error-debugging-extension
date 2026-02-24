import React from "react";

interface SaveFixHeaderProps {
  fileName: string;
}

export default function SaveFixHeader({ fileName }: SaveFixHeaderProps) {
  return (
    <div className="save-fix-header">
      <h1>Save Note</h1>
      <div className="save-fix-sub">
        <span>{fileName ? `File: ${fileName}` : "Open a file with errors to begin."}</span>
      </div>
    </div>
  );
}
