import React from "react";

interface SaveFixHeaderProps {
  fileName: string;
}

export default function SaveFixHeader({ fileName }: SaveFixHeaderProps) {
  return (
    <div className="save-fix-header">
      <h1>Save Fix</h1>
      <div className="save-fix-sub">
        <span>{fileName ? `File: ${fileName}` : "Open a file with errors to begin."}</span>
        <span className="save-fix-match">&#x2728; <strong>Current Match</strong> - Auto Highlighted</span>
      </div>
    </div>
  );
}
