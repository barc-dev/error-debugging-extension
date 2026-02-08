import React from "react";

interface AiInsightProps {
  aiInsight: string;
}

export default function AiInsight({ aiInsight }: AiInsightProps) {
  return (
    <div className="ai-insight">
      <div className="insight-header">
        <strong>AI Insight</strong>
      </div>
      <p>{aiInsight}</p>
    </div>
  );
}
