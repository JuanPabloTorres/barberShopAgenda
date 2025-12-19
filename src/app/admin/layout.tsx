"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/ui/Button";
import { Icons } from "@/ui/icons";

const navLinks = [
  { href: "/admin/agenda", label: "Agenda", icon: Icons.calendar },
  { href: "/admin/barbers", label: "Barbers", icon: Icons.users, adminOnly: true },
  { href: "/admin/services", label: "Services", icon: Icons.services, adminOnly: true },
  { href: "/admin/profile", label: "Profile", icon: Icons.user },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const hideNav = pathname === "/admin/login";
  const visibleLinks = navLinks.filter((link) => !link.adminOnly || session?.role === "ADMIN");
  const userName = session?.user?.name || session?.user?.email || "Account";
  const roleLabel = session?.role === "ADMIN" ? "Admin" : "Barber";
  if (hideNav) {
    return <div className="min-h-screen bg-cream-50 text-slatewood-900">{children}</div>;
  }
  return (
    <div className="min-h-screen bg-cream-50 text-slatewood-900">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex md:w-64 md:flex-col md:justify-between bg-brick-900 text-cream-100">
          <div className="px-6 py-6">
            <div className="text-lg font-semibold tracking-wide">Barber Agenda</div>
            <div className="mt-8 flex flex-col gap-2">
              {visibleLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                      isActive ? "bg-leather-500 text-white" : "text-cream-100/80 hover:text-white hover:bg-brick-800"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 mr-2" aria-hidden="true" />}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="px-6 py-6 text-xs text-cream-100/70">
            Barber Agenda © 2025
          </div>
        </aside>
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-cream-200 bg-cream-100 px-4 py-3 md:px-8">
            <div className="flex items-center gap-3">
              <div className="text-lg font-semibold text-brick-800">Dashboard</div>
              <span className="rounded-full bg-cream-200 px-2 py-0.5 text-xs font-medium text-brick-700">
                {roleLabel}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slatewood-700">{userName}</div>
              {session && (
                <Button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="bg-brick-700 hover:bg-brick-800 flex items-center gap-2">
                  <Icons.logout className="w-4 h-4" aria-hidden="true" />
                  Logout
                </Button>
              )}
            </div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
