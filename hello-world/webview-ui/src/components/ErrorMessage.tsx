import React from "react";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return <div className="error-message">{message}</div>;
  //if you have a simple component, you can do a one liner
}
