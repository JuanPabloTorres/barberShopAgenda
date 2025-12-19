"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/admin/agenda", label: "Agenda" },
  { href: "/admin/barbers", label: "Barbers", adminOnly: true },
  { href: "/admin/services", label: "Services", adminOnly: true },
  { href: "/admin/profile", label: "Profile" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const hideNav = pathname === "/admin/login";
  return (
    <div className="min-h-screen bg-gray-100">
      {!hideNav && (
        <nav className="bg-white shadow flex items-center px-4 py-2">
          <span className="font-bold text-lg mr-6">Barber Agenda</span>
          <div className="flex gap-4 flex-1">
          {navLinks
            .filter((link) => !link.adminOnly || session?.role === "ADMIN")
            .map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-700 hover:text-amber-600 font-medium">
                {link.label}
              </Link>
            ))}
          </div>
          {session && (
            <button
              className="ml-4 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              Logout
            </button>
          )}
        </nav>
      )}
      <main className="max-w-3xl mx-auto py-8 px-2">{children}</main>
    </div>
  );
}
