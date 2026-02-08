import React from "react";

interface ErrorPanelHeaderProps {
  panelTitle: string;
  onClose: () => void;
}

export default function ErrorPanelHeader({
  panelTitle,
  onClose
}: ErrorPanelHeaderProps) {
  return (
    <div className='error-header'>
      <h2>{panelTitle}</h2>
      <button className='close-btn' onClick={onClose}>X</button>
    </div>
  );
}
