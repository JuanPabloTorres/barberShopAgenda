import { useCallback, useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState<{ id: number; message: string; type?: "success" | "error" }[]>([]);
  const showToast = useCallback((message: string, type?: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);
  return { toasts, showToast };
}
