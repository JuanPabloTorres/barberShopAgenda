import "./globals.css";
import type { ReactNode } from "react";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-black min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
