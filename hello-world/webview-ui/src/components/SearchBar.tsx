import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <span className="search-icon">&#x1f50e;</span>
      <input
        type="text"
        className="search-input"
        placeholder="Search your notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="search-history-icon" title="Coming soon">&#x27F2;</span>
    </div>
  );
}
