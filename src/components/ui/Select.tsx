import React from "react";

export function Select({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`rounded border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 w-full ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
