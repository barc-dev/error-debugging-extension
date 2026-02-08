import React from "react";

interface PastFixProps {
  description: string;
  codeSnippet: string;
  timesUsed: number;
}

export default function PastFix({
  description,
  codeSnippet,
  timesUsed,
}: PastFixProps) {
  return (
    <div className="past-fix">
      <div className="section-header">
        <strong>YOUR PAST FIX (USED {timesUsed} TIMES)</strong>
      </div>
      <p className="fix-description">{description}</p>
      <pre className="code-block">
        <code>{codeSnippet}</code>
      </pre>
    </div>
  );
}
