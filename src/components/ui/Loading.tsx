import React from "react";
import { Icons } from "@/ui/icons";

export function Loading() {
  const Loader = Icons.loading;
  return (
    <div className="flex items-center justify-center py-8">
      <Loader className="animate-spin h-6 w-6 text-amber-500" aria-hidden="true" />
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );
}
