import React from "react";

export default function SymptomCheckbox({ id, label, checked, onChange }) {
  return (
    <label className="flex items-start gap-3 p-2 cursor-pointer">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e)=>onChange(id, e.target.checked)}
        className="mt-1"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
