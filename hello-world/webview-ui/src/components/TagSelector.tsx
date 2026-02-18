import React, { useState } from "react";

interface TagSelectorProps {
  defaultTags: string[];
  selectedTags: Set<string>;
  onToggle: (tag: string) => void;
  onAddCustom: (tag: string) => void;
  onRemoveCustom: (tag: string) => void;
}

export default function TagSelector({
  defaultTags,
  selectedTags,
  onToggle,
  onAddCustom,
  onRemoveCustom,
}: TagSelectorProps) {
  const [customInput, setCustomInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const val = customInput.trim();
    if (!val) return;
    onAddCustom(val);
    setCustomInput("");
  };

  return (
    <div className="tag-selector">
      <div className="sf-label">Tags</div>
      <div className="tag-chips">
        {defaultTags.map((tag) => (
          <div
            key={tag}
            className={"chip" + (selectedTags.has(tag) ? " active" : "")}
            onClick={() => onToggle(tag)}
          >
            {tag}
          </div>
        ))}
        {Array.from(selectedTags)
          .filter((tag) => !defaultTags.includes(tag))
          .map((tag) => (
            <div
              key={tag}
              className="chip active"
              onClick={() => onRemoveCustom(tag)}
            >
              {tag} &#x2715;
            </div>
          ))}
      </div>
      <div className="tag-input-row">
        <input
          type="text"
          className="tag-input"
          placeholder="+ Add a tag (press Enter)"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
