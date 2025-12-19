import React from "react";
import { Icons } from "@/ui/icons";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  icon?: keyof typeof Icons;
}

export function EmptyState({ title, description, action, className = "", icon = "view" }: EmptyStateProps) {
  const Icon = Icons[icon] || Icons.view;
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Icon className="w-10 h-10 mb-3 text-slatewood-200" aria-hidden="true" />
      <div className="text-lg font-semibold text-slatewood-600">{title}</div>
      {description && <div className="mt-2 text-sm text-slatewood-400">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
