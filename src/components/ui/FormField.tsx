import React from "react";
import { Input } from "./Input";

export function FormField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block mb-2">
      <span className="block text-sm font-medium mb-1">{label}</span>
      <Input {...props} />
    </label>
  );
}
