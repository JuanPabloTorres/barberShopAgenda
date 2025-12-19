import React from "react";
import { Icons } from "@/ui/icons";

export function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: React.ReactNode; title?: string }) {
  if (!open) return null;
  const CloseIcon = Icons.error;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-lg w-full relative mx-2">
        <button
          className="absolute -top-4 -right-4 bg-white rounded-full shadow p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          onClick={onClose}
          aria-label="Close"
          style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }}
        >
          <CloseIcon className="w-6 h-6" aria-hidden="true" />
        </button>
        {title && (
          <div className="mb-6 text-xl font-semibold text-slatewood-800 text-center">
            {title}
          </div>
        )}
        <div className="space-y-5">{children}</div>
      </div>
    </div>
  );
}
