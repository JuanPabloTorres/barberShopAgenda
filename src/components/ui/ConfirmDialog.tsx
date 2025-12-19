import React from "react";
import { Button } from "./Button";

export function ConfirmDialog({ open, onConfirm, onCancel, message }: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded shadow-lg p-6 min-w-[300px]">
        <div className="mb-4 text-gray-800">{message}</div>
        <div className="flex gap-2 justify-end">
          <Button onClick={onCancel} className="bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</Button>
          <Button onClick={onConfirm} className="bg-amber-500 hover:bg-amber-600">Confirm</Button>
        </div>
      </div>
    </div>
  );
}
