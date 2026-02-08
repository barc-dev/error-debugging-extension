import React from "react";

interface ErrorLocationProps {
  fileName: string;
  lineNumber: number;
}

export default function ErrorLocation({
  fileName,
  lineNumber,
}: ErrorLocationProps) {
  return (
    <div className="error-location">
      {fileName}:{lineNumber}
    </div>
  );
}
