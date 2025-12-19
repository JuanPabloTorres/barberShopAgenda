import React from "react";
import { Icons } from "@/ui/icons";

export function Toast({ toasts }: { toasts: { id: number; message: string; type?: "success" | "error" }[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = toast.type === "error" ? Icons.error : Icons.success;
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-2 rounded px-4 py-2 shadow text-white ${toast.type === "error" ? "bg-red-500" : "bg-amber-500"}`}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}
