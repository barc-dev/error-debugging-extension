import React from "react";

interface SaveFixActionsProps {
  onSave: () => void;
  onClose: () => void;
  saveDisabled: boolean;
}

export default function SaveFixActions({
  onSave,
  onClose,
  saveDisabled,
}: SaveFixActionsProps) {
  return (
    <div className="save-fix-actions">
      <button
        className="sf-btn sf-btn-primary"
        onClick={onSave}
        disabled={saveDisabled}
      >
        Save Fix
      </button>
      <button className="sf-btn sf-btn-secondary" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
