import React from "react";

export function Toast({ toasts }: { toasts: { id: number; message: string; type?: "success" | "error" }[] }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded px-4 py-2 shadow text-white ${toast.type === "error" ? "bg-red-500" : "bg-amber-500"}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
