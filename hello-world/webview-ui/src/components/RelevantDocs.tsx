import React from "react";

interface Doc {
  title: string;
  url: string;
}

interface RelevantDocsProps {
  docs: Doc[];
}

export default function RelevantDocs({ docs }: RelevantDocsProps) {
  return (
    <div className="relevant-docs">
      <div className="section-header">
        <strong>RELEVANT DOCUMENTATION</strong>
      </div>
      {docs.map((doc, index) => {
        return <a
          key={index} //each rendered element in a map needs a unique key
          className="doc-link"
          href={doc.url}
          target="_blank" //opens link in a new tab
          rel="noopener noreferrer" //security best practices?
        >
          {doc.title}
        </a>;
      })}
    </div>
  );
}
