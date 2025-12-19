import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  color?: "default" | "success" | "error" | "warning" | "info";
  className?: string;
}

const colorMap: Record<string, string> = {
  default: "bg-slatewood-100 text-slatewood-700",
  success: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-blue-100 text-blue-800",
};

export function Badge({ children, color = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
        colorMap[color] || colorMap.default
      } ${className}`}
    >
      {children}
    </span>
  );
}
