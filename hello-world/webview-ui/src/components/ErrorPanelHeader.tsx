import React from "react";

interface ErrorPanelHeaderProps {
  panelTitle: string;
}

export default function ErrorPanelHeader({ panelTitle }: ErrorPanelHeaderProps) {
  return (
    <div className='error-header'>
      <h2>{panelTitle}</h2>
    </div>
  );
}
