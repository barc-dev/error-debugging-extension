import React from "react";

interface Note {
  description: string;
  codeSnippet: string;
  tags: string[];
}

interface NotesPanelProps {
  notes: Note[];
  onSaveNew: () => void;
  onViewAll: () => void;
}

export default function NotesPanel({
  notes,
  onSaveNew,
  onViewAll,
}: NotesPanelProps) {
  return (
    <div className="notes-panel">
      <span className="notes-header">
        <strong>YOUR NOTES({notes.length} saved)</strong>
      </span>
      {notes.length === 0 ? (
        <span className="notes-empty"></span>
      ) : (
        notes.map((note, index) => (
          <div key={index} className="note-card">
            <div className="note-description">{note.description}</div>
            <pre className="note-code">{note.codeSnippet}</pre>
            <div className="note-footer">
              <div className="note-tags">
                {note.tags.map((tag, index) => (
                  <span key={index} className="note-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
      <div className="notes-buttons">
        <button className="sf-btn sf-btn-secondary" onClick={onViewAll}>
          View All
        </button>
        <button className="sf-btn sf-btn-primary" onClick={onSaveNew}>
          Save New Note
        </button>
      </div>
    </div>
  );
}
