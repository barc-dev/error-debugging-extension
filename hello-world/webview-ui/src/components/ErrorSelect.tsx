import React from "react";

interface ErrorOption {
  key: string;
  message: string;
  source: string;
  code: string;
  line: number;
  col: number;
}

interface ErrorSelectProps {
  errors: ErrorOption[];
  selectedKey: string;
  linePreview: string;
  onSelect: (key: string) => void;
}

export default function ErrorSelect({
  errors,
  selectedKey,
  linePreview,
  onSelect,
}: ErrorSelectProps) {
  const selected = errors.find((e) => e.key === selectedKey) || errors[0];

  return (
    <div className="error-select-section">
      <div className="sf-label">Select an error</div>
      <select
        className="error-select"
        value={selectedKey}
        onChange={(e) => onSelect(e.target.value)}
      >
        {errors.length === 0 ? (
          <option value="">No errors found in active file</option>
        ) : (
          errors.map((e) => (
            <option key={e.key} value={e.key}>
              {e.message} (Ln {e.line}, Col {e.col})
            </option>
          ))
        )}
      </select>
      {selected && (
        <div className="error-meta">
          {selected.code ? `ts · code ${selected.code}` : "ts"} · Ln {selected.line}, Col {selected.col}
        </div>
      )}
      {selected && linePreview && (
        <div className="line-preview">
          Line {selected.line}: {linePreview}
        </div>
      )}
    </div>
  );
}
