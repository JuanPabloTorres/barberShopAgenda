import "./globals.css";
import type { ReactNode } from "react";
import { Providers } from "./providers";

const APP_VERSION = "1.0.0";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-black min-h-screen font-sans">
        <Providers>{children}</Providers>
        <div style={{ position: "fixed", bottom: 8, right: 12, zIndex: 50 }} className="text-xs text-gray-400 select-none pointer-events-none">
          v{APP_VERSION}
        </div>
      </body>
    </html>
  );
}
