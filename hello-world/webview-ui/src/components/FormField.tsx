import React from "react";

interface FormFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function FormField({
  label,
  placeholder,
  value,
  onChange,
}: FormFieldProps) {
  return (
    <div className="form-field">
      <div className="sf-label">{label}</div>
      <textarea
        className="form-textarea"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
