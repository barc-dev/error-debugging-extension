import React from "react";

interface ActionButtonsProps {
  onApply: () => void;
  onDismiss: () => void;
}
export default function ActionButtons({
  onApply,
  onDismiss,
}: ActionButtonsProps) {
  return (
    <div className="action-buttons">
      <button className="apply-btn" onClick={onApply}>
        Apply
      </button>
      <button className="dismiss-btn" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
}
